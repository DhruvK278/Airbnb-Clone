from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Check if we are using SQLite
is_sqlite = settings.get_database_url.startswith("sqlite")

# Create engine
connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(
    settings.get_database_url,
    connect_args=connect_args,
    echo=settings.DEBUG,
)

# Enable SQLite foreign key enforcement
if is_sqlite:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys = ON")
        cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency that provides a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Called on startup."""
    Base.metadata.create_all(bind=engine)
