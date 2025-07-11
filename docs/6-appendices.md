# 6. Appendices

## APPENDIX A: SOURCE CODE SNIPPETS

### APPENDIX A.1: User Model Schema (MongoDB)

```javascript
const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  memberSince: {type: Date, default: Date.now},
  preferences: {
    travelStyle: {type: String, enum: ["budget", "luxury", "adventure"]},
    favoriteDestinations: [{type: String}],
    dietaryRestrictions: [{type: String}],
  },
  location: {
    type: {type: String, default: "Point"},
    coordinates: {type: [Number], default: [0, 0]},
  },
  totalTrips: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});
```

### APPENDIX A.2: Trip Model Schema (MongoDB)

```javascript
const tripSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  destination: {
    name: {type: String, required: true},
    coordinates: {type: [Number], required: true},
    address: {type: String, required: true},
  },
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
  budget: {type: Number, required: true},
  activities: [
    {
      name: String,
      location: {type: [Number]},
      duration: Number,
      cost: Number,
    },
  ],
  status: {
    type: String,
    enum: ["planning", "confirmed", "in-progress", "completed", "cancelled"],
    default: "planning",
  },
  aiRecommendations: [
    {
      type: {type: String},
      description: String,
      confidence: Number,
    },
  ],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});
```

### APPENDIX A.3: Google Maps Integration

```javascript
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";

const MapComponent = ({center, markers}) => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{width: "100%", height: "400px"}}
        center={center}
        zoom={12}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} title={marker.title} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};
```

### APPENDIX A.4: Google Gemini AI Integration

```javascript
import {GoogleGenerativeAI} from "@google/generative-ai";

const generateTripRecommendations = async (userPreferences, destination) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({model: "gemini-pro"});

  const prompt = `Generate travel recommendations for ${destination} based on:
    Travel style: ${userPreferences.travelStyle}
    Budget: ${userPreferences.budget}
    Duration: ${userPreferences.duration} days`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

## APPENDIX B: DATABASE SCHEMA AND TABLES

### APPENDIX B.1: MongoDB Collections Overview

| Collection Name | Description                             |
| --------------- | --------------------------------------- |
| users           | Stores user information and preferences |
| trips           | Stores trip information and itineraries |
| deletedUsers    | Stores backup of deleted user accounts  |

### APPENDIX B.2: User Collection Schema

| Field Name                       | Data Type | Description               | Constraints                             |
| -------------------------------- | --------- | ------------------------- | --------------------------------------- |
| \_id                             | ObjectId  | Unique identifier         | PRIMARY KEY                             |
| name                             | String    | User's full name          | REQUIRED                                |
| email                            | String    | User's email address      | REQUIRED, UNIQUE                        |
| password                         | String    | Hashed password           | REQUIRED, MIN LENGTH: 6                 |
| memberSince                      | Date      | Registration date         | DEFAULT: Current date                   |
| preferences.travelStyle          | String    | Preferred travel style    | ENUM: ["budget", "luxury", "adventure"] |
| preferences.favoriteDestinations | [String]  | User's favorite places    | OPTIONAL                                |
| preferences.dietaryRestrictions  | [String]  | Dietary requirements      | OPTIONAL                                |
| location.type                    | String    | GeoJSON type              | DEFAULT: "Point"                        |
| location.coordinates             | [Number]  | [longitude, latitude]     | DEFAULT: [0, 0]                         |
| totalTrips                       | Number    | Total trips planned       | DEFAULT: 0                              |
| createdAt                        | Date      | Record creation timestamp | AUTO                                    |
| updatedAt                        | Date      | Record update timestamp   | AUTO                                    |

### APPENDIX B.3: Trip Collection Schema

| Field Name              | Data Type | Description               | Constraints                                                              |
| ----------------------- | --------- | ------------------------- | ------------------------------------------------------------------------ |
| \_id                    | ObjectId  | Unique identifier         | PRIMARY KEY                                                              |
| user                    | ObjectId  | Reference to user         | REQUIRED, REF: 'User'                                                    |
| destination.name        | String    | Destination name          | REQUIRED                                                                 |
| destination.coordinates | [Number]  | [longitude, latitude]     | REQUIRED                                                                 |
| destination.address     | String    | Full address              | REQUIRED                                                                 |
| startDate               | Date      | Trip start date           | REQUIRED                                                                 |
| endDate                 | Date      | Trip end date             | REQUIRED                                                                 |
| budget                  | Number    | Total budget              | REQUIRED                                                                 |
| activities              | Array     | Planned activities        | OPTIONAL                                                                 |
| status                  | String    | Current trip status       | ENUM: ["planning", "confirmed", "in-progress", "completed", "cancelled"] |
| aiRecommendations       | Array     | AI-generated suggestions  | OPTIONAL                                                                 |
| createdAt               | Date      | Record creation timestamp | AUTO                                                                     |
| updatedAt               | Date      | Record update timestamp   | AUTO                                                                     |

## APPENDIX C: API ENDPOINTS

### APPENDIX C.1: Authentication Endpoints

| Endpoint         | Method | Description         | Request Body              | Response                     |
| ---------------- | ------ | ------------------- | ------------------------- | ---------------------------- |
| /api/users       | POST   | Register a new user | { name, email, password } | { \_id, name, email, token } |
| /api/users/login | POST   | Login a user        | { email, password }       | { \_id, name, email, token } |

### APPENDIX C.2: User Endpoints

| Endpoint           | Method | Description         | Request Body               | Response                                         |
| ------------------ | ------ | ------------------- | -------------------------- | ------------------------------------------------ |
| /api/users/profile | GET    | Get user profile    | -                          | { \_id, name, email, preferences, ... }          |
| /api/users/profile | PUT    | Update user profile | { name, preferences, ... } | { \_id, name, email, preferences, ... }          |
| /api/users/profile | DELETE | Delete user account | -                          | { message: "User account deleted successfully" } |

### APPENDIX C.3: Trip Endpoints

| Endpoint                  | Method | Description       | Request Body                                | Response                                     |
| ------------------------- | ------ | ----------------- | ------------------------------------------- | -------------------------------------------- |
| /api/trips                | POST   | Create a new trip | { destination, startDate, endDate, budget } | { \_id, user, destination, ... }             |
| /api/trips/:id            | GET    | Get trip details  | -                                           | { \_id, user, destination, activities, ... } |
| /api/trips/:id/activities | POST   | Add activity      | { name, location, duration, cost }          | { \_id, activities: [...], ... }             |
| /api/trips/:id/confirm    | PUT    | Confirm trip      | -                                           | { \_id, status: "confirmed", ... }           |
| /api/trips/:id/cancel     | PUT    | Cancel trip       | -                                           | { \_id, status: "cancelled", ... }           |

## APPENDIX D: INSTALLATION INSTRUCTIONS

### APPENDIX D.1: Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (v4.4 or higher)
- npm (v6.0.0 or higher)
- Google Maps API Key
- Google Gemini AI API Key

### APPENDIX D.2: Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/trip-planner.git
cd trip-planner
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Create a .env file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/trip-planner
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

4. Start the backend server:

```bash
npm run dev
```

### APPENDIX D.3: Frontend Setup

1. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

2. Create a .env file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

3. Start the frontend development server:

```bash
npm run dev
```

4. Access the application at http://localhost:3000

## APPENDIX E: TEST CASES

### APPENDIX E.1: Authentication Test Cases

| Test Case ID | Description                       | Input                                                                    | Expected Output                           | Result |
| ------------ | --------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------- | ------ |
| AUTH-TC-001  | User Registration - Valid Data    | { name: "John Doe", email: "john@example.com", password: "password123" } | User created successfully with 201 status | Pass   |
| AUTH-TC-002  | User Registration - Invalid Email | { name: "John Doe", email: "invalid-email", password: "password123" }    | 400 Bad Request with validation error     | Pass   |
| AUTH-TC-003  | User Login - Valid Credentials    | { email: "john@example.com", password: "password123" }                   | 200 OK with user data and token           | Pass   |

### APPENDIX E.2: Trip Planning Test Cases

| Test Case ID | Description               | Input                                                     | Expected Output                     | Result |
| ------------ | ------------------------- | --------------------------------------------------------- | ----------------------------------- | ------ |
| TRIP-TC-001  | Create Trip - Valid Data  | { destination, startDate, endDate, budget }               | Trip created with "planning" status | Pass   |
| TRIP-TC-002  | Add Activity - Valid Data | { name: "Visit Museum", location, duration: 2, cost: 50 } | Activity added to trip              | Pass   |
| TRIP-TC-003  | Confirm Trip              | { tripId }                                                | Trip status updated to "confirmed"  | Pass   |
| TRIP-TC-004  | Cancel Trip               | { tripId }                                                | Trip status updated to "cancelled"  | Pass   |

### APPENDIX E.3: AI Integration Test Cases

| Test Case ID | Description              | Input                                 | Expected Output              | Result |
| ------------ | ------------------------ | ------------------------------------- | ---------------------------- | ------ |
| AI-TC-001    | Generate Recommendations | { destination: "Paris", preferences } | AI-generated recommendations | Pass   |
| AI-TC-002    | Update Recommendations   | { tripId, newPreferences }            | Updated recommendations      | Pass   |
| AI-TC-003    | Error Handling           | Invalid API key                       | Appropriate error message    | Pass   |

## APPENDIX F: THIRD-PARTY LIBRARIES AND TOOLS

### APPENDIX F.1: Backend Dependencies

| Library               | Version | Purpose                         |
| --------------------- | ------- | ------------------------------- |
| express               | 4.18.2  | Web framework for Node.js       |
| mongoose              | 7.0.3   | MongoDB object modeling         |
| jsonwebtoken          | 9.0.0   | JWT authentication              |
| bcryptjs              | 2.4.3   | Password hashing                |
| @google/generative-ai | 0.1.0   | Google Gemini AI integration    |
| cors                  | 2.8.5   | Cross-Origin Resource Sharing   |
| dotenv                | 16.0.3  | Environment variable management |

### APPENDIX F.2: Frontend Dependencies

| Library                | Version | Purpose                      |
| ---------------------- | ------- | ---------------------------- |
| react                  | 18.2.0  | UI library                   |
| react-dom              | 18.2.0  | DOM manipulation for React   |
| react-router-dom       | 6.10.0  | Routing for React            |
| @react-google-maps/api | 2.18.1  | Google Maps integration      |
| @google/generative-ai  | 0.1.0   | Google Gemini AI integration |
| axios                  | 1.3.5   | HTTP client                  |
| framer-motion          | 10.12.4 | Animations                   |
| tailwindcss            | 3.3.1   | Utility-first CSS framework  |
| vite                   | 4.2.1   | Frontend build tool          |
