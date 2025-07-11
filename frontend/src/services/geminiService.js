import axios from "axios";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

/**
 * Generate travel recommendations based on user preferences
 * @param {Object} preferences - User preferences from the onboarding form
 * @returns {Promise<Array>} - Array of recommended destinations
 */
export const generateRecommendations = async (preferences) => {
  try {
    const {budget, timeAvailability, interests, transportation} = preferences;

    // Construct a detailed prompt for Gemini
    const prompt = `
      Act as a travel expert and recommend 4 destinations based on the following preferences:

      Budget: ${budget.min} to ${budget.max} INR
      Days Available: ${timeAvailability.daysAvailable}
      Preferred Season: ${timeAvailability.preferredSeason}
      Interests: ${interests.join(", ")}
      Transportation: ${
        transportation.hasOwnVehicle ? "Has own vehicle" : "No vehicle"
      }, Prefers ${transportation.preferredModes.join(", ")}

      For each destination, provide:
      1. Name of the destination
      2. A short description (50-60 words)
      3. Estimated total cost (in INR)
      4. Best time to visit
      5. Three top attractions

      Note: Do not include image URLs in your response as they may not be accessible. The application will handle images separately.

      Format the response as a JSON array with objects having the following structure:
      {
        "name": "Destination Name",
        "description": "Short description",
        "totalCost": 15000,
        "bestTimeToVisit": "October to March",
        // The application will handle images separately
        "topAttractions": ["Attraction 1", "Attraction 2", "Attraction 3"]
      }

      Only return the JSON array, no additional text.
    `;

    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    // Extract and parse the JSON response
    const textResponse = response.data.candidates[0].content.parts[0].text;

    try {
      // First try to parse the entire response as JSON
      return JSON.parse(textResponse);
    } catch (parseError) {
      // If that fails, try to extract JSON from the text
      try {
        const jsonStartIndex = textResponse.indexOf("[");
        const jsonEndIndex = textResponse.lastIndexOf("]") + 1;

        if (jsonStartIndex === -1 || jsonEndIndex <= jsonStartIndex) {
          throw new Error("Could not find valid JSON array in the response");
        }

        const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);

        // Clean the JSON string to handle potential formatting issues
        const cleanedJsonString = jsonString
          .replace(/\,(?=\s*[\}\]])/g, "") // Remove trailing commas
          .replace(/([\{\,])\s*(\w+)\s*\:/g, '$1"$2":') // Ensure property names are quoted
          .replace(/:\s*\'([^\']*)\'\s*([\,\}])/g, ':"$1"$2'); // Replace single quotes with double quotes

        return JSON.parse(cleanedJsonString);
      } catch (extractError) {
        console.error("Error extracting JSON from response:", extractError);
        console.error("Raw response:", textResponse);

        // Fallback to a default response if parsing fails
        return [
          {
            name: "Goa",
            description:
              "Beautiful beaches and vibrant nightlife make Goa a perfect getaway for relaxation and fun.",
            totalCost: 25000,
            bestTimeToVisit: "November to February",
            topAttractions: [
              "Calangute Beach",
              "Fort Aguada",
              "Dudhsagar Falls",
            ],
          },
          {
            name: "Jaipur",
            description:
              "The Pink City offers a rich cultural experience with its majestic forts and palaces.",
            totalCost: 20000,
            bestTimeToVisit: "October to March",
            topAttractions: ["Amber Fort", "Hawa Mahal", "City Palace"],
          },
        ];
      }
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

/**
 * Get detailed information about a specific destination
 * @param {Object} destination - Basic destination info
 * @param {Object} preferences - User preferences
 * @returns {Promise<Object>} - Detailed destination information
 */
export const getDestinationDetails = async (destination, preferences) => {
  try {
    const {budget, timeAvailability, interests, transportation} = preferences;

    // Construct a detailed prompt for Gemini
    const prompt = `
      Act as a travel expert and provide detailed information about ${
        destination.name
      } for a traveler with the following preferences:

      Budget: ${budget.min} to ${budget.max} INR
      Days Available: ${timeAvailability.daysAvailable}
      Preferred Season: ${timeAvailability.preferredSeason}
      Interests: ${interests.join(", ")}
      Transportation: ${
        transportation.hasOwnVehicle ? "Has own vehicle" : "No vehicle"
      }, Prefers ${transportation.preferredModes.join(", ")}

      Provide a comprehensive travel guide in JSON format with the following structure:
      {
        "destination": "${destination.name}",
        "overview": "Detailed description (150-200 words)",
        "bestTimeToVisit": "Season information",
        "daysRecommended": 3,
        "budget": {
          "total": 15000,
          "accommodation": {
            "budget": 2000,
            "midRange": 4000,
            "luxury": 8000
          },
          "food": {
            "budget": 500,
            "midRange": 1000,
            "luxury": 2000
          },
          "transportation": 2000,
          "activities": 3000,
          "shopping": 2000
        },
        "accommodation": [
          {
            "name": "Hotel/Hostel Name",
            "type": "Budget/Mid-range/Luxury",
            "pricePerNight": 2000,
            "location": "Area name",
            "description": "Brief description",
            "amenities": ["WiFi", "AC", "etc"]
          }
        ],
        "attractions": [
          {
            "name": "Attraction Name",
            "description": "Description",
            "entryFee": 500,
            "timeRequired": "2-3 hours",
            "bestTimeToVisit": "Morning/Evening"
          }
        ],
        "activities": [
          {
            "name": "Activity Name",
            "description": "Description",
            "cost": 1000,
            "duration": "3 hours",
            "difficulty": "Easy/Moderate/Hard"
          }
        ],
        "food": [
          {
            "name": "Restaurant/Dish Name",
            "type": "Local cuisine/International",
            "priceRange": "Budget/Mid-range/Luxury",
            "mustTry": ["Dish 1", "Dish 2"],
            "location": "Area name"
          }
        ],
        "transportation": {
          "localOptions": ["Bus", "Auto", "Taxi"],
          "costs": {
            "bus": 20,
            "auto": 100,
            "taxi": 200
          },
          "tips": "Transportation tips"
        },
        "itinerary": [
          {
            "day": 1,
            "activities": [
              {
                "time": "Morning",
                "activity": "Visit X",
                "description": "Brief description"
              },
              {
                "time": "Afternoon",
                "activity": "Lunch at Y",
                "description": "Brief description"
              },
              {
                "time": "Evening",
                "activity": "Explore Z",
                "description": "Brief description"
              }
            ]
          }
        ],
        "tips": [
          "Tip 1",
          "Tip 2",
          "Tip 3"
        ],
        "images": [
          {
            "caption": "Caption for image 1"
          },
          {
            "caption": "Caption for image 2"
          },
          {
            "caption": "Caption for image 3"
          }
        ]
      }

      Only return the JSON object, no additional text.
    `;

    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    // Extract and parse the JSON response
    const textResponse = response.data.candidates[0].content.parts[0].text;

    try {
      // First try to parse the entire response as JSON
      return JSON.parse(textResponse);
    } catch (parseError) {
      // If that fails, try to extract JSON from the text
      try {
        const jsonStartIndex = textResponse.indexOf("{");
        const jsonEndIndex = textResponse.lastIndexOf("}") + 1;

        if (jsonStartIndex === -1 || jsonEndIndex <= jsonStartIndex) {
          throw new Error("Could not find valid JSON in the response");
        }

        const jsonString = textResponse.substring(jsonStartIndex, jsonEndIndex);

        // Clean the JSON string to handle potential formatting issues
        const cleanedJsonString = jsonString
          .replace(/\,(?=\s*[\}\]])/g, "") // Remove trailing commas
          .replace(/([\{\,])\s*(\w+)\s*\:/g, '$1"$2":') // Ensure property names are quoted
          .replace(/:\s*\'([^\']*)\'\s*([\,\}])/g, ':"$1"$2'); // Replace single quotes with double quotes

        return JSON.parse(cleanedJsonString);
      } catch (extractError) {
        console.error("Error extracting JSON from response:", extractError);
        console.error("Raw response:", textResponse);
        throw new Error("Failed to parse the AI response. Please try again.");
      }
    }
  } catch (error) {
    console.error("Error getting destination details:", error);
    throw error;
  }
};
