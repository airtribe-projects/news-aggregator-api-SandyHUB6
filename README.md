# News Aggregator API

A RESTful, personalized news aggregator backend application built with **Node.js** and **Express.js**. It features user account signup, password hashing, JWT-based authentication, user category preferences, in-memory query caching, and integration with an external News API provider.

---

## Features

- **User Account Registration**: Safe signup endpoint with automated validation checks.
- **Bcrypt Password Hashing**: Secure password processing using `bcryptjs` before storage.
- **JWT Authentication**: Secure login flow generating token credentials and endpoint protection middleware.
- **Preference Management**: Users can save and retrieve customized news search categories (e.g. movies, games).
- **Personalized News Retrieval**: Fetches top articles from an external News API tailored to the user's specific preferences.
- **In-Memory Caching**: Caches normalized news search queries with a configurable TTL (Time to Live) to minimize API cost and latency.
- **Robust Error Handling**: Centralized, clean, and safe error-handling middleware that redacts API secrets and formats responses consistently.
- **Input Validation**: Rejects invalid payloads or malformed credentials automatically.

---

## Tech Stack

- **Runtime**: Node.js (version 18+)
- **Web Framework**: Express.js
- **Cryptography & Security**: bcryptjs, jsonwebtoken (JWT)
- **Networking**: Native Fetch API (built-in)
- **Testing**: Tap, Supertest
- **Storage**: In-memory user collection, In-memory TTL cache

---

## Project Structure

```text
news-aggregator-api/
├── src/
│   ├── config/             # Configuration managers (JWT, Cache, News settings)
│   ├── controllers/        # Express request controllers (Health, User, News handlers)
│   ├── middleware/         # Custom middlewares (Authentication, Not Found, Centralized Error)
│   ├── models/             # In-memory database schemas (User representations)
│   ├── routes/             # API Router definitions (Health, User, News routers)
│   ├── services/           # Business logic layer (User account, Cache eviction, News fetchers)
│   └── utils/              # General helper/utility modules (JWT signing, Custom AppError class)
├── test/                   # Testing directories (Integration and unit test suites)
├── app.js                  # Express app loader and middleware chain config
├── server.js               # Entry point initiating HTTP listener
├── package.json            # Script definitions and package manifests
└── README.md               # Developer setup and API documentation
```

---

## Installation

To download packages and install dependencies:

```bash
npm install
```

---

## Environment Configuration

Configure environmental variables by copying the template file into a local `.env` file (which is ignored by Git to prevent secrets leakage):

```bash
# Create local configuration file
cp .env.example .env
```

### Supported Environment Variables

| Variable | Description | Default Fallback |
| :--- | :--- | :--- |
| `PORT` | Local server port to bind the HTTP listener | `3000` |
| `JWT_SECRET` | Secret key used for signing and validating JWT tokens | `dev_secret_key_news_aggregator_api_12345` |
| `NEWS_API_KEY` | Private access API Key for the external News provider | *None (triggers local sandbox mock fallback)* |
| `NEWS_API_URL` | Base endpoint URL for the top headlines external provider | `https://newsapi.org/v2/top-headlines` |
| `NEWS_CACHE_TTL` | Lifespan in seconds for in-memory news query cache entries | `300` (5 minutes) |

---

## Running the Application

To start the local Express web server:

```bash
node server.js
```
The server will boot up and print: `Server is listening on port 3000`.

---

## Running Tests

Automated tests are written using `tap` and `supertest`. To run the complete integration and unit tests:

```bash
npm test
```
The application test suite compiles and runs 100% successfully (25 passing assertions).

---

## API Documentation

### Authentication Requirements
Endpoints marked with **[Protected]** require the following header format:
```http
Authorization: Bearer <Your_JWT_Token>
```

---

### GET /health
- **Purpose**: Server health check endpoint.
- **Access**: Public
- **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "message": "API is running and healthy"
  }
  ```

---

### POST /users/signup
- **Purpose**: Registers a new user account.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Clark Kent",
    "email": "clark@superman.com",
    "password": "Krypt()n8",
    "preferences": ["movies", "comics"]
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": "usr_abc123",
    "name": "Clark Kent",
    "email": "clark@superman.com",
    "preferences": ["movies", "comics"]
  }
  ```
- **Validation/Error Behavior**:
  - Missing fields (`name`, `email`, `password`) returns `400 Bad Request`.
  - Malformed email formats returns `400 Bad Request`.
  - Registering an already registered email address returns `400 Bad Request`.

---

### POST /users/login
- **Purpose**: Authenticates a user and issues a JWT token.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "clark@superman.com",
    "password": "Krypt()n8"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Invalid Credentials Behavior**:
  - Missing parameters returns `400 Bad Request`.
  - Wrong password or unregistered email returns `401 Unauthorized`.

---

### GET /users/preferences
- **Purpose**: Retrieves current search category preferences for the authenticated user.
- **Access**: **[Protected]**
- **Success Response (`200 OK`)**:
  ```json
  {
    "preferences": ["movies", "comics"]
  }
  ```
- **Invalid Authorization Behavior**:
  - Missing or malformed Bearer Token returns `401 Unauthorized`.

---

### PUT /users/preferences
- **Purpose**: Overwrites the user's category preferences list.
- **Access**: **[Protected]**
- **Request Body**:
  ```json
  {
    "preferences": ["movies", "comics", "games"]
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "preferences": ["movies", "comics", "games"]
  }
  ```
- **Invalid Behavior**:
  - Passing anything other than an array to `preferences` returns `400 Bad Request`.

---

### GET /news
- **Purpose**: Fetches personalized top news articles matching the user's category preferences.
- **Access**: **[Protected]**
- **How Preferences Affect Requests**: The user's preferences are joined using the logical `OR` search parameter (e.g. `movies OR comics OR games`) and sent as the query string `q` to the external news provider. If preferences are empty, it defaults to querying the keyword `general`.
- **Success Response (`200 OK`)**:
  ```json
  {
    "news": [
      {
        "title": "Airtribe Launchpad Backend Project Kicked Off",
        "description": "The second launchpad assignment has successfully set up a News Aggregator API.",
        "url": "https://airtribe.com/launchpad/assignment-2",
        "image": "https://airtribe.com/assets/images/backend-hero.png",
        "source": "Airtribe Tech",
        "publishedAt": "2026-08-12T10:00:00Z"
      }
    ]
  }
  ```
- **Caching Behavior**: When called, the service checks the in-memory cache first. If a match is found and is not expired, it serves the cached data immediately. On cache miss, it calls the external API, normalizes, caches, and returns it.

---

## Caching

To optimize overhead, decrease response times, and avoid external API query throttling:
- **In-Memory Cache**: Stored in a lightweight key-value dictionary in server memory.
- **Cache Key Normalization**: Cache keys are generated deterministically by trimming, lowercasing, sorting alphabetically, and joining the user's preferences list (e.g. `pref_comics_movies`). This guarantees that different users with identical preferences share the cache resource efficiently.
- **Personalization Isolation**: Users with different search preferences get distinct cache keys (e.g. `pref_sports` vs `pref_comics_movies`), ensuring articles do not bleed across different profiles.
- **TTL Expiration**: Expired records are automatically evicted upon retrieval to ensure users always receive fresh news.

---

## Error Handling

The application maps operational issues to custom error structures (`AppError`) and returns a standardized JSON payload structure:

```json
{
  "error": {
    "message": "Access denied. Invalid or expired token.",
    "status": 401
  }
}
```

### Common HTTP Status Codes

- `400 Bad Request`: Validation errors, missing parameters, duplicate accounts, or malformed payloads.
- `401 Unauthorized`: Missing Bearer Token, expired JWT signature, or incorrect login credentials.
- `404 Not Found`: Unknown router endpoints or resource misses.
- `502 Bad Gateway`: External News API connection timeouts or provider failures.
- `500 Internal Server Error`: Generic system bugs.

---

## Security Notes

- **Password Cryptography**: Passwords are never stored or logged in plain text. They are hashed using `bcryptjs` with 10 salt rounds before saving.
- **API Key Secrecy**: The private `NEWS_API_KEY` is loaded strictly via environment config and never exposed.
- **Token Protection**: JWT secret is loaded from the environment config with development-only safe fallbacks.
- **No Data Leakage**: Password hashes are omitted from all signup, preferences, and login responses. Error messages redact raw query credentials or keys automatically.

---

## Assignment Submission Notes

Ensure all code passes the tests locally before submitting. 
1. Push your changes to your remote assignment repository's main branch (`master`).
2. Submit your work by opening the required feedback PR on GitHub Classroom as per instructions.
