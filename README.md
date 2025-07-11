# Trip Planner

A MERN stack application that provides personalized trip planning with detailed expenses, attractions, and recommendations based on user preferences using Gemini 2.0 AI.

## Features

- User authentication and profile management
- Personalized trip planning based on user preferences
- Detailed itineraries with cost estimates
- Budget optimization
- Place recommendations with detailed information
- Responsive design for all devices

## Tech Stack

### Frontend

- React with Vite
- React Router for navigation
- Material UI for components
- Axios for API requests

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Google's Generative AI (Gemini 2.0) for recommendations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gemini API key

### Installation

1. Clone the repository

```
git clone <repository-url>
cd trip-planner
```

2. Install backend dependencies

```
cd backend
npm install
```

3. Set up environment variables
   Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

4. Install frontend dependencies

```
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server

```
cd backend
npm run dev
```

2. Start the frontend development server

```
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Trips

- `POST /api/trips` - Create a new trip
- `GET /api/trips` - Get all trips for a user
- `GET /api/trips/:id` - Get trip by ID
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `PUT /api/trips/:id/itinerary` - Update trip itinerary

### Gemini AI

- `POST /api/gemini/trip-recommendations` - Generate trip recommendations
- `POST /api/gemini/place-details` - Get detailed information about a place
- `POST /api/gemini/optimize-budget` - Optimize trip budget

## License

This project is licensed under the MIT License.
