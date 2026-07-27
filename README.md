# Airbnb Clone

A full-stack, feature-rich Airbnb clone built with modern web technologies. This project perfectly replicates the core Airbnb user experience, including searching for properties, viewing listing details, mocking checkout/booking flows, managing a host dashboard, and curating a wishlist.

## Tech Stack
**Frontend:**
- [Next.js (App Router)](https://nextjs.org/) - React framework for UI, routing, and SSR.
- [React Query](https://tanstack.com/query/latest) - Asynchronous state management and data fetching.
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling for matching Airbnb's sleek design system.
- [Axios](https://axios-http.com/) - HTTP client.
- [Lucide React](https://lucide.dev/) - Consistent iconography.

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) - High-performance Python web framework for REST APIs.
- [SQLAlchemy](https://www.sqlalchemy.org/) - ORM for database interactions.
- [SQLite](https://www.sqlite.org/) - Lightweight local database.
- [Uvicorn](https://www.uvicorn.org/) - ASGI web server.

---

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Initialize the database and seed it with realistic mock data:
   ```bash
   python -m app.seed_database
   ```
5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API will now be running at `http://localhost:8000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will now be running at `http://localhost:3000`.

---

## Architecture Overview
The application follows a standard decoupled Client-Server architecture:
- **Client (Frontend)**: Next.js handles all routing, rendering, and UI state. It communicates with the backend exclusively via REST API calls using Axios and React Query for caching. The UI is built using highly modular, reusable components (e.g., `ListingCard`, `Navbar`, `PhotoGallery`).
- **Server (Backend)**: FastAPI provides stateless RESTful endpoints. The backend architecture enforces a clear separation of concerns:
  - `routes/`: Defines API endpoints and HTTP methods.
  - `services/`: Contains the core business logic (e.g., validating overlapping booking dates).
  - `models/`: Defines the SQLAlchemy database models.
  - `schemas/`: Defines Pydantic models for request validation and response serialization.
- **Database**: SQLite acts as the persistence layer, accessed securely via the SQLAlchemy ORM.

---

## Database Schema
The database uses a custom relational schema designed for this project:

- **Users (`users`)**: Stores user profiles, distinguishing between guests and hosts via an `is_host` boolean.
- **Listings (`listings`)**: Stores property details (title, description, location, price, capacity, bedrooms). Linked to `users` via `host_id`.
- **Images (`listing_images`)**: One-to-many relationship with listings. Stores image URLs and display ordering.
- **Amenities (`amenities`)**: Lookup table for available amenities (Wifi, Pool, etc.).
- **Listing Amenities (`listing_amenities`)**: Many-to-many join table connecting listings and amenities.
- **Bookings (`bookings`)**: Tracks reservations. Enforces no-double-booking through strict check-in/check-out date checks. Linked to both a `guest_id` and a `listing_id`.
- **Reviews (`reviews`)**: Stores ratings and comments. Linked to specific bookings and users.
- **Favorites / Wishlist (`favorites`)**: Join table linking a `user_id` to a `listing_id` for curating wishlists.

---

## API Overview
The backend provides a clean, RESTful API. You can view the fully interactive Swagger/OpenAPI documentation by running the backend and visiting **`http://localhost:8000/docs`**.

**Key Endpoints:**
- **Listings:**
  - `GET /api/listings` - Search and filter listings (pagination, location, dates, price).
  - `GET /api/listings/{id}` - Fetch details for a specific listing.
  - `GET /api/listings/{id}/availability` - Fetch blocked/booked dates for calendar rendering.
  - `POST /api/listings` - Create a new listing (Host).
  - `PUT /api/listings/{id}` - Update a listing (Host, ownership validated).
  - `DELETE /api/listings/{id}` - Delete a listing (Host, ownership validated).
- **Bookings:**
  - `POST /api/bookings` - Create a new reservation (Guest).
  - `GET /api/bookings` - View current user's trips (Guest).
  - `GET /api/bookings/host` - View upcoming reservations for properties owned by the user (Host).
- **Favorites:**
  - `GET /api/favorites` - Fetch user's wishlist.
  - `POST /api/favorites` - Add to wishlist.
  - `DELETE /api/favorites/{listing_id}` - Remove from wishlist.

---

## Assumptions & Simplifications
To focus on core functionality and UI/UX, the following simplifications were made:
- **Mocked Authentication**: There is no real JWT or session-based authentication flow. The application hardcodes user context dynamically. For example, it behaves as if User #6 is the logged-in guest (for making bookings and wishlisting) and User #2 is the logged-in host (for the Host Dashboard).
- **Mocked Payments**: The checkout flow is mocked. There is no Stripe or real payment gateway integration. Clicking "Confirm and Pay" immediately registers a confirmed booking.
- **Image Uploads**: Since there is no cloud storage integration (like AWS S3) implemented for this mock project, creating a listing on the Host Dashboard requires pasting a direct Image URL (e.g., from Unsplash) rather than uploading a local file.
- **Placeholders**: Advanced features like real-time interactive maps, host messaging, and identity verification are represented with static placeholders or "Coming Soon" badges to maintain visual fidelity without over-engineering backend dependencies.