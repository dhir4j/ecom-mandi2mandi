# Mandi2Mandi Flask Backend

This is the backend API for the Mandi2Mandi application, built with Flask. It handles user authentication (signup, login, logout) and roles.

## Features

- **Framework**: Flask
- **Database**: PostgreSQL
- **ORM**: Flask-SQLAlchemy
- **Authentication**: Session-based authentication with Flask-Login
- **Password Hashing**: Flask-Bcrypt
- **CORS**: Handles cross-origin requests from the Next.js frontend.

## Project Setup

Follow these instructions to get the backend server running locally.

### 1. Set up a Python Virtual Environment

It is highly recommended to use a virtual environment to manage project dependencies.

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS and Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

Install all the required Python packages using pip.

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

The application uses a `.env` file to manage sensitive configurations like database credentials and secret keys. A `.env` file has been provided with the required credentials. No changes are needed to run the application.

### 4. Run the Application

Once the setup is complete, you can start the Flask development server.

```bash
python run.py
```

The server will start on `http://127.0.0.1:5000`. The first time you run it, it will automatically create the necessary database tables in your PostgreSQL database.

## API Endpoints

All endpoints are prefixed with `/api/auth`.

### `POST /signup`

Creates a new user account.

- **URL:** `/api/auth/signup`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
      "name": "Test User",
      "email": "test@example.com",
      "password": "yourpassword",
      "role": "buyer"
  }
  ```
- **Success Response (201):**
  ```json
  {
      "message": "User created successfully."
  }
  ```

### `POST /login`

Logs in a user and creates a session.

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
      "email": "test@example.com",
      "password": "yourpassword"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com",
      "role": "buyer"
    }
  }
  ```

### `POST /logout`

Logs out the currently authenticated user and clears the session.

- **URL:** `/api/auth/logout`
- **Method:** `POST`
- **Success Response (200):**
  ```json
  {
      "message": "Successfully logged out."
  }
  ```

### `GET /status`

Checks if a user is currently authenticated in the session.

- **URL:** `/api/auth/status`
- **Method:** `GET`
- **Success Response (Authenticated):**
  ```json
  {
      "logged_in": true,
      "user": {
          "id": 1,
          "name": "Test User",
          "email": "test@example.com",
          "role": "buyer"
      }
  }
  ```
- **Success Response (Not Authenticated):**
    ```json
    {
        "logged_in": false
    }
    ```
