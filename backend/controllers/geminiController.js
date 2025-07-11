const {GoogleGenerativeAI} = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate trip recommendations
// @route   POST /api/gemini/trip-recommendations
// @access  Private
const generateTripRecommendations = async (req, res) => {
  try {
    const {
      destination,
      duration,
      budget,
      travelStyle,
      transportation,
      interests,
      accommodationType,
    } = req.body;

    // Create prompt for Gemini
    const prompt = `
      Generate a detailed trip plan for a ${duration}-day trip to ${destination}.

      User preferences:
      - Budget: ${budget.total} ${budget.currency || "INR"}
      - Travel style: ${travelStyle || "balanced"}
      - Transportation preferences: ${transportation.join(", ") || "Any"}
      - Interests: ${interests.join(", ") || "General sightseeing"}
      - Accommodation type: ${accommodationType || "Mid-range hotel"}
      - Has own vehicle: ${req.body.hasOwnVehicle ? "Yes" : "No"}
      - Available time: ${
        req.body.timeAvailability?.daysAvailable || duration
      } days
      - Preferred season: ${req.body.timeAvailability?.preferredSeason || "Any"}

      Please provide a comprehensive travel plan with the following details:
      1. A day-by-day itinerary with specific places to visit
      2. Detailed cost breakdown in INR for each activity, meal, accommodation, and transportation
      3. Recommended restaurants and local cuisine to try with price ranges
      4. Must-see attractions and hidden gems that match the user's interests
      5. Practical tips for visiting each place including best times to visit
      6. Estimated time required for each activity
      7. Transportation options between locations with costs
      8. Accommodation recommendations with costs
      9. Cultural experiences and local events if available
      10. Shopping recommendations for local specialties
      11. Safety tips specific to the destination

      For each place, include a URL to an image that represents the location.

      Format the response as a structured JSON object with the following structure:
      {
        "destination": "${destination}",
        "duration": ${duration},
        "currency": "INR",
        "itinerary": [
          {
            "day": 1,
            "places": [
              {
                "name": "Place name",
                "description": "Detailed description of the place",
                "category": "attraction/restaurant/accommodation/activity",
                "estimatedCost": 500,
                "estimatedTimeRequired": "2 hours",
                "bestTimeToVisit": "Morning/Afternoon/Evening",
                "location": {
                  "address": "Full address if available",
                  "googleMapsUrl": "Google Maps URL if available"
                },
                "imageUrl": "URL to an image of this place",
                "tips": ["Detailed tip 1", "Detailed tip 2"],
                "culturalSignificance": "Brief explanation of cultural importance if applicable"
              }
            ],
            "transportation": {
              "mode": "walking/bus/taxi/etc",
              "estimatedCost": 200,
              "details": "Specific details about the transportation option"
            },
            "meals": [
              {
                "type": "breakfast/lunch/dinner/snack",
                "suggestion": "Restaurant or food recommendation",
                "cuisine": "Type of cuisine",
                "specialDish": "Must-try dish at this place",
                "estimatedCost": 300,
                "location": "Area or address"
              }
            ],
            "accommodation": {
              "name": "Accommodation name",
              "type": "hotel/hostel/guesthouse/etc",
              "estimatedCost": 2000,
              "location": "Area or address",
              "amenities": ["Amenity 1", "Amenity 2"]
            },
            "totalDayCost": 3000
          }
        ],
        "summary": {
          "highlights": ["Detailed highlight 1", "Detailed highlight 2"],
          "totalCost": 15000,
          "averageDailyCost": 3000,
          "mustTryExperiences": ["Detailed experience 1", "Detailed experience 2"],
          "bestTimeToVisit": "Information about the best season to visit",
          "localCustoms": ["Custom 1", "Custom 2"],
          "packingTips": ["Packing tip 1", "Packing tip 2"],
          "safetyTips": ["Safety tip 1", "Safety tip 2"]
        }
      }

      Ensure all costs are in INR and realistic for the destination. Be specific with place names, and provide detailed descriptions.
    `;

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({model: "gemini-1.5-pro"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    let tripPlan;
    try {
      // Find JSON in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
        text.match(/```\n([\s\S]*?)\n```/) || [null, text];

      const jsonString = jsonMatch[1] || text;
      tripPlan = JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return res.status(500).json({
        message: "Failed to parse AI response",
        rawResponse: text,
      });
    }

    res.json(tripPlan);
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({message: "Error generating trip recommendations"});
  }
};

// @desc    Generate place details
// @route   POST /api/gemini/place-details
// @access  Private
const generatePlaceDetails = async (req, res) => {
  try {
    const {placeName, destination, interests} = req.body;

    // Create prompt for Gemini
    const prompt = `
      Provide comprehensive and detailed information about "${placeName}" in ${destination}.

      User interests: ${
        interests ? interests.join(", ") : "General information"
      }

      Please include the following details in your response:
      1. A detailed description of the place including its history and significance
      2. Why it's worth visiting and what makes it special
      3. Detailed cost breakdown in INR (entry fees, guided tours, etc.)
      4. Best time of day and season to visit with weather considerations
      5. How much time to spend there for the optimal experience
      6. Special tips, insider advice, and local secrets
      7. Nearby attractions, restaurants, and shops within walking distance
      8. Cultural significance and any customs to be aware of
      9. Photography tips and best spots for pictures
      10. Accessibility information
      11. URL to a high-quality image of the place
      12. Google Maps URL if available

      Format the response as a structured JSON object with the following structure:
      {
        "name": "${placeName}",
        "destination": "${destination}",
        "description": "Detailed description",
        "history": "Historical background",
        "significance": "Cultural or historical significance",
        "whyVisit": ["Reason 1", "Reason 2"],
        "costs": {
          "entryFee": "Amount in INR",
          "guidedTour": "Amount in INR",
          "audioGuide": "Amount in INR",
          "otherFees": ["Fee description: Amount in INR"]
        },
        "timing": {
          "bestTimeOfDay": "Morning/Afternoon/Evening",
          "bestSeason": "Season name",
          "openingHours": "Opening hours information",
          "timeRequired": "Recommended duration"
        },
        "tips": ["Detailed tip 1", "Detailed tip 2"],
        "nearby": {
          "attractions": ["Nearby place 1", "Nearby place 2"],
          "restaurants": ["Restaurant 1: cuisine type", "Restaurant 2: cuisine type"],
          "shopping": ["Shop 1: items available", "Shop 2: items available"]
        },
        "culturalNotes": ["Cultural note 1", "Cultural note 2"],
        "photographyTips": ["Photo tip 1", "Photo tip 2"],
        "accessibility": "Information about accessibility",
        "imageUrl": "URL to an image of this place",
        "googleMapsUrl": "Google Maps URL if available"
      }

      Ensure all costs are in INR and realistic. Be specific and detailed in your descriptions.
    `;

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({model: "gemini-1.5-pro"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    let placeDetails;
    try {
      // Find JSON in the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
        text.match(/```\n([\s\S]*?)\n```/) || [null, text];

      const jsonString = jsonMatch[1] || text;
      placeDetails = JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return res.status(500).json({
        message: "Failed to parse AI response",
        rawResponse: text,
      });
    }

    res.json(placeDetails);
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({message: "Error generating place details"});
  }
};

// @desc    Generate budget optimization
// @route   POST /api/gemini/optimize-budget
// @access  Private
const optimizeBudget = async (req, res) => {
  try {
    const {tripPlan, budgetConstraint} = req.body;

    // Create prompt for Gemini
    const prompt = `
      I have a trip plan to ${
        tripPlan.destination
      } with a total estimated cost of ${tripPlan.summary.totalCost}.
      However, my budget is limited to ${budgetConstraint}.

      Please optimize my trip plan to fit within my budget while maintaining the best possible experience.

      Current trip plan:
      ${JSON.stringify(tripPlan, null, 2)}

      Please provide:
      1. Suggestions for cheaper alternatives to expensive activities
      2. Recommendations for budget-friendly dining options
      3. Cost-saving transportation options
      4. Any activities that could be removed with minimal impact on the overall experience
      5. A revised day-by-day itinerary that fits within my budget

      Format the response as a structured JSON object similar to the input trip plan.
    `;

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({model: "gemini-1.5-pro"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    let optimizedPlan;
    try {
      // Find JSON in the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
        text.match(/```\n([\s\S]*?)\n```/) || [null, text];

      const jsonString = jsonMatch[1] || text;
      optimizedPlan = JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return res.status(500).json({
        message: "Failed to parse AI response",
        rawResponse: text,
      });
    }

    res.json(optimizedPlan);
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({message: "Error optimizing budget"});
  }
};

module.exports = {
  generateTripRecommendations,
  generatePlaceDetails,
  optimizeBudget,
};
