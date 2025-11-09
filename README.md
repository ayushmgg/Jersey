# Jersey Recommendation System

A production-ready MERN stack application with collaborative filtering recommendations for sports jerseys.

## 🏗️ Architecture

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React (Vite) + React Router + React Query
- **Database**: MongoDB with Mongoose ODM
- **Recommendations**: MongoDB-based collaborative filtering (no ML service needed)
- **Caching**: Redis (optional, falls back to in-memory)
- **Authentication**: JWT-based

## 📁 Project Structure

```
recommendation4/
├── server/                 # Node.js/Express backend
│   ├── models/            # MongoDB models (User, Jersey, Interaction)
│   ├── routes/            # API routes (auth, jerseys, interactions, recommendations)
│   ├── middleware/        # Auth, error handling, request logging
│   ├── utils/             # Logger, cache, ML service client
│   ├── server.js          # Main server file
│   └── package.json
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # Auth context
│   │   ├── utils/         # API client
│   │   └── App.jsx
│   └── package.json
├── ml-service/            # Python ML service
│   ├── app.py            # Flask app with CF model
│   └── requirements.txt
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or connection string)
- Python 3.8+ (for ML service)
- Redis (optional, for caching)

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Add Sample Data to MongoDB

```bash
cd server
node scripts/add-sample-jerseys.js
```

This adds 10 sample jerseys to your database.

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/jersey-recommendations
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
REDIS_HOST=localhost
REDIS_PORT=6379
ML_SERVICE_URL=http://localhost:5001
ML_SERVICE_TIMEOUT=2000
CORS_ORIGIN=http://localhost:5173
```

### ML Service (.env)

```env
PORT=5001
FLASK_DEBUG=False
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jerseys
- `GET /api/jerseys` - Get all jerseys (with filters)
- `GET /api/jerseys/:id` - Get single jersey
- `POST /api/jerseys` - Create jersey (authenticated)
- `PUT /api/jerseys/:id` - Update jersey (authenticated)
- `DELETE /api/jerseys/:id` - Delete jersey (authenticated)

### Interactions
- `POST /api/interactions` - Record interaction (view/cart/purchase)
- `GET /api/interactions/me` - Get user's interactions

### Recommendations
- `GET /api/recommendations?limit=10` - Get personalized recommendations

## 🧠 Recommendation System

The recommendation system uses **MongoDB-based collaborative filtering**:
- **Algorithm**: User-based collaborative filtering
- **How it works**: 
  1. Finds users with similar interaction patterns
  2. Recommends jerseys that similar users liked (but current user hasn't seen)
  3. Scores recommendations based on interaction type (purchases weighted higher than carts)
- **Fallback**: Popular jerseys when user has no interaction history
- **No ML service required**: Everything runs directly in MongoDB/Node.js

## 🔒 Security Features

- JWT authentication on protected routes
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS configuration
- Request sanitization

## 📊 Observability

- **Logging**: Winston with structured logs (correlation IDs, user IDs)
- **Request Tracing**: Correlation IDs for request tracking
- **Metrics**: Cache hit rate, latency tracking
- **Error Handling**: Centralized error handler with stack traces (dev mode)

## 🎨 Frontend Features

- **Pages**:
  - Login/Register
  - Home (recommendations + popular jerseys)
  - Jersey Details (with "You may also like")
  - Profile (user history + recommendations)

- **Components**:
  - RecommendationCarousel
  - JerseyCard
  - Navbar
  - Auth forms

- **State Management**:
  - React Query for server state
  - Context API for authentication

## 🧪 Testing the System

1. **Register a user**:
   ```bash
   POST http://localhost:5000/api/auth/register
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login**:
   ```bash
   POST http://localhost:5000/api/auth/login
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Create some jerseys** (use the token from login):
   ```bash
   POST http://localhost:5000/api/jerseys
   Authorization: Bearer <token>
   {
     "team": "Lakers",
     "player": "LeBron James",
     "category": "home",
     "imageUrl": "https://example.com/jersey.jpg",
     "price": 99.99
   }
   ```

4. **Record interactions**:
   ```bash
   POST http://localhost:5000/api/interactions
   Authorization: Bearer <token>
   {
     "jerseyId": "<jersey_id>",
     "type": "view"
   }
   ```

5. **Get recommendations**:
   ```bash
   GET http://localhost:5000/api/recommendations?limit=10
   Authorization: Bearer <token>
   ```

## 🚧 Production Considerations

1. **Environment Variables**: Use secure secrets management
2. **Database**: Use MongoDB Atlas or managed MongoDB
3. **Caching**: Use Redis for production caching
4. **Recommendations**: Consider adding more sophisticated algorithms (matrix factorization, etc.)
5. **Monitoring**: Add APM tools (e.g., New Relic, Datadog)
6. **CI/CD**: Set up automated testing and deployment
7. **Load Balancing**: Use nginx or similar for production
8. **HTTPS**: Enable SSL/TLS certificates

## 📝 License

ISC

## 👥 Contributing

Contributions welcome! Please open an issue or submit a PR.

