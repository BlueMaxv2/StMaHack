from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql+asyncpg://postgres:123123@localhost/myproject"

# создаем движок
engine = create_async_engine(DATABASE_URL, echo=True)

# сессии для работы с БД
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# базовый класс для моделей
Base = declarative_base()
