from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title="Airbnb Clone API",
    description="Backend API for the Airbnb Clone application",
    version="1.0.0",
)

# CORS middleware — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify the API is running."""
    return {"status": "healthy", "message": "Airbnb Clone API is running"}


# Register Routers
from app.routes import listings

app.include_router(listings.router, prefix="/api/listings", tags=["Listings"])

if __name__ == "__main__":
    import uvicorn
    import sys
    import os

    # Ensure the backend/ directory is on the Python path
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG,
    )
