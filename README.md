# Social Serve — Backend API

A RESTful backend server built with **Node.js and Express.js** that powers [Social Serve](https://social-serve-phi.vercel.app/), an event management and social platform. It provides APIs for event management, user participation, authentication, and event discovery.

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | NoSQL database |
| JWT | Authentication and authorization |
| dotenv | Environment variable management |
| CORS | Cross-origin resource sharing |

## ✨ Features

- **CRUD Operations:** Create, read, update, and delete events.
- **JWT Authentication:** Secure authentication and protected API routes.
- **Route Protection:** Middleware-based authorization for restricted endpoints.
- **Event Management:** Create, update, retrieve, and delete events.
- **Event Participation:** Allow authenticated users to join and leave events.
- **User-specific Data:** Retrieve created events and joined events for individual users.
- **Event Discovery:** Fetch upcoming events, related events, and event galleries.
- **Environment Configuration:** Secure configuration using environment variables.
- **CORS Support:** Configured cross-origin requests for frontend integration.

## ⚙️ Getting Started

Follow these steps to run the backend server locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm
- [MongoDB](https://www.mongodb.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/mdmoshiurrahman-dev/ASSIGNMENT-9-BACK-END.git
```

**2. Navigate to the project directory**

```bash
cd ASSIGNMENT-9-BACK-END
```

**3. Install dependencies**

```bash
npm install
```

### 🔐 Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=5000
MONGO_AUTH_URL=your_mongodb_connection_string
CLIENT_API_URL=your_frontend_url
```

| Variable | Description |
|---|---|
| `PORT` | Port number for the backend server |
| `MONGO_AUTH_URL` | MongoDB connection string |
| `CLIENT_API_URL` | Frontend application URL for CORS configuration |

### ▶️ Running the Application

**Development Mode**

If you haven't installed Nodemon, install it first:

```bash
npm install --save-dev nodemon
```

Start the development server:

```bash
npx nodemon index.js
```

The server will start on your configured port.

```text
http://localhost:5000
```

## 📡 API Endpoints

### 🔑 Authentication & Event Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create-event` | Create a new event |
| POST | `/api/auth/login` | Authenticate user and obtain a JWT |
| POST | `/join-event` | Join an event (protected) |
| GET | `/get-join-event/:email` | Retrieve a user's joined event data |
| GET | `/get-created-events/:email` | Retrieve events created by a user |
| GET | `/delete/:id` | Delete a created event |
| POST | `/update` | Update an existing event |
| POST | `/get-joined-event/:email` | Retrieve all joined events |
| DELETE | `/delete-joined-event/:email/:id` | Remove a specific joined event |

### 📅 Event Discovery

| Method | Endpoint | Description |
|---|---|---|
| GET | `/recent-upcoming-events` | Retrieve the latest 6 upcoming events |
| GET | `/old-gallery-image` | Retrieve the 8 oldest event photos |
| GET | `/all-events` | Retrieve all existing events |
| GET | `/gallery-image` | Retrieve event gallery images |
| GET | `/event/:id` | Retrieve a specific event by ID |
| GET | `/related/:category` | Retrieve events related to a category |

## 🔒 Authentication

Social Serve uses **JSON Web Tokens (JWT)** to authenticate users and protect restricted API endpoints.

- Users authenticate to obtain a JWT.
- Protected routes require a valid JWT in the request's `Authorization` header.
- Authentication middleware verifies incoming tokens before allowing access to protected resources.

Example request header:

```http
Authorization: Bearer <your_jwt_token>
```

## 🌐 Frontend Integration

This backend is designed to work with the Social Serve frontend.

**Live Application:** [Social Serve](https://social-serve-phi.vercel.app/)

## 👨‍💻 Developer

**Reyad**  
Aspiring Full-Stack Web Developer

- GitHub: [@mdmoshiurrahman-dev](https://github.com/mdmoshiurrahman-dev)

---

