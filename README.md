Travel Destinations Review Site
A full-stack web application for discovering, reviewing, and managing travel destinations. Users can browse destinations, read and write reviews, while administrators have comprehensive control over content and users. The application features a robust authentication system with different user roles to manage permissions.

Table of Contents
Features
Tech Stack
Project Structure
Getting Started
Prerequisites
Backend Setup
Frontend Setup
Environment Variables
Database Seeding
API Endpoints
Authentication & Authorization
Deployment
Future Enhancements
Contributing
License
Features
This application implements core functionalities for a review site, categorized by user roles:

Public Users (Not Logged In):

Browse and read reviews for travel destinations.
View detailed information about a specific destination, including its average rating.
Search for destinations.
User registration and login.
Logged-In Users:

Submit written reviews and scores for destinations (one review per item per user).
View, edit, and delete their own reviews.
Write, edit, and delete comments on other users' reviews.
Manage user profile (view/edit).
Add images to reviews (Tier 2).
Administrators:

Full CRUD (Create, Read, Update, Delete) operations on travel destinations (items).
Manage destination categories/tags and associated pictures.
Manage all users (view list, set roles, edit information, remove users).
Access a dashboard for managing categories, items, reviews, and users.
Handle reported content (reviews, items).
Engineers:

Well-seeded database for various testing scenarios.
Secured user data and robust authentication/authorization.
Tech Stack
This project is built using a modern MERN-like stack with a focus on maintainability and scalability.

Frontend:

React.js: A JavaScript library for building user interfaces.
React Router: For declarative routing.
Context API / useState / useEffect: For state management.
CSS / Styling: (Specify if you used Tailwind, Material-UI, styled-components, plain CSS, etc.)
Axios / Fetch API: For making HTTP requests to the backend.
Backend:

Node.js: JavaScript runtime.
Express.js: A fast, unopinionated, minimalist web framework for Node.js.
Prisma ORM: Next-generation ORM for Node.js & TypeScript, simplifying database access.
PostgreSQL: Robust relational database for storing application data.
Bcrypt.js: For secure password hashing.
JSON Web Tokens (JWT): For stateless user authentication and authorization.
CORS: Middleware for handling Cross-Origin Resource Sharing.
Database:

PostgreSQL (Render Managed Database): Cloud-hosted relational database.
Deployment:

Render: For deploying both frontend and backend services.
Project Structure
.
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Top-level page components (e.g., HomePage, LoginPage)
│   │   ├── context/          # React Contexts (e.g., AuthContext)
│   │   ├── hooks/            # Custom React Hooks
│   │   ├── assets/           # Images, icons, etc.
│   │   ├── App.js            # Main application component
│   │   └── index.js          # Entry point
│   └── .env.development      # Frontend environment variables
├── backend/
│   ├── prisma/               # Prisma schema and migrations
│   │   └── schema.prisma
│   ├── node_modules/
│   ├── routes/               # Express route modules (auth, destinations, reviews, users, reports)
│   │   ├── auth.js           # User registration and login
│   │   ├── destinations.js   # CRUD for travel destinations
│   │   ├── reviews.js        # CRUD for reviews and comments
│   │   ├── users.js          # User profile management (protected)
│   │   └── reports.js        # Content reporting (protected)
│   ├── middleware/           # Express middleware (e.g., auth, role-based access)
│   │   └── auth.js
│   ├── utils/                # Utility functions (e.g., prismaClient)
│   │   └── prismaClient.js
│   ├── server.js             # Main Express application file (or app.js/index.js)
│   └── .env                  # Backend environment variables
├── .github/                  # GitHub Actions for CI/CD (if implemented)
├── .gitignore
├── README.md
└── package.json              # Monorepo setup or project metadata (if applicable)
Getting Started
Follow these steps to set up and run the project locally.

Prerequisites
Node.js (LTS version recommended)
npm (comes with Node.js)
PostgreSQL database (for local development, or configure to use Render's DB)
Git

Backend Setup
1. Navigate to the backend directory:
Bash

cd backend
2. Install dependencies:
Bash

npm install
3. Create a .env file in the backend directory and populate it with your environment variables (see Environment Variables).

4.  Run Prisma migrations:
Bash
npx prisma migrate dev --name init
(This will create your database tables based on prisma/schema.prisma.)

5. Seed the database: (Optional, but highly recommended for development)
Bash
node prisma/seed.js # Or whatever your seed script is named

6. Start the backend server:
Bash
npm start
The backend server will typically run on http://localhost:8080 (or process.env.PORT).

Frontend Setup
1. Navigate to the frontend directory:
Bash

cd frontend
2. Install dependencies:
Bash
npm install

3.  Create a .env.development file in the frontend directory and populate it with your environment variables (see Environment Variables).

Start the React development server:
4. Bash

npm start


The frontend application will typically open in your browser at http://localhost:3000.
Environment Variables
Both the frontend and backend require specific environment variables for configuration.

Backend (backend/.env)
Code snippet

# JWT Secret for token signing
JWT_SECRET=your_strong_jwt_secret_here

# PostgreSQL Database Connection String
DATABASE_URL="postgresql://user:password@host:port/database_name"

# Port the backend server listens on (optional, Render provides it)
PORT=8080
Frontend (frontend/.env.development for local, or set on Render for production)
Code snippet

# Base URL for your backend API
REACT_APP_API_BASE_URL=http://localhost:8080 # For local development
# For production (Render):
# REACT_APP_API_BASE_URL=https://travel-destinations-capstone.onrender.com/api
Database Seeding
The project includes a robust database seeding script (prisma/seed.js or similar) to pre-populate the database with:

Multiple user accounts (including Admin and Engineer roles)
Numerous travel destinations across various categories
A large volume of reviews and comments
This setup allows for easy testing of features like pagination, search, filtering, and role-based access control without manual data entry.
API Endpoints
The backend exposes a RESTful API with the following main routes:

/auth: User registration, login.
/destinations: CRUD operations for travel destinations (public read, admin write).
/reviews: CRUD operations for reviews and comments (public read, authenticated user write/edit/delete, admin manage).
/users: User profile management (authenticated, protected).
/reports: Reporting mechanism for inappropriate content (protected).
(A more detailed API documentation with request/response examples would be beneficial for a larger project).

Authentication & Authorization
JWT-based Authentication: Users receive a JWT upon successful login, which they include in subsequent requests for protected routes.
Role-Based Access Control (RBAC): Users are assigned roles (user, admin, engineer). Middleware (authenticateToken in backend/middleware/auth.js) verifies the token and user's role to restrict access to certain API endpoints (e.g., only administrators can add/edit destinations).
Deployment
The application is designed for deployment on Render.

Backend: Deployed as a Web Service on Render, connecting to a Render-managed PostgreSQL database.
Frontend: Deployed as a Static Site on Render, configured to point to the deployed backend API URL.
Ensure your environment variables are correctly configured on Render for both services.

Future Enhancements (Tier 2 & 3)
Enhanced UI/UX: Comprehensive mobile responsiveness, accessibility (ADA compliance), loading indicators, and error handling.
Image Uploads: Implement secure image storage (e.g., AWS S3 or Cloudinary) for reviews and destination pictures.
User Profiles: Allow users to view and edit their own profiles.
Content Reporting: Implement a system for users to "report" inappropriate content, managed by administrators.
Item Ownership: Allow users to claim ownership of items and respond to reviews as owners.
Admin Dashboard: Centralized interface for comprehensive content and user management.
Third-Party Authentication (OAuth): Integrate Google, Facebook, or other OAuth providers for login.
Social Features: User following, notifications (email/in-app).
Advanced Filtering/Search & Pagination/Infinite Scrolling.
Recommendations System.
Contributing
Feel free to fork this repository, open issues, and submit pull requests.
