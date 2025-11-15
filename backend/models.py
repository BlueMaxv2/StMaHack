from sqlalchemy import (
    Column, Integer, String, Text, DECIMAL, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    password_clear = Column(Text, nullable=False)

    apps = relationship("App", secondary="users_apps", back_populates="users")


class App(Base):
    __tablename__ = "apps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    rating = Column(DECIMAL(2, 1))

    users = relationship("User", secondary="users_apps", back_populates="apps")
    tags = relationship("Tag", secondary="apps_tags", back_populates="apps")
    images = relationship("AppImage", back_populates="app", cascade="all, delete-orphan")


class UserApp(Base):
    __tablename__ = "users_apps"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    app_id = Column(Integer, ForeignKey("apps.id", ondelete="CASCADE"), primary_key=True)


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

    apps = relationship("App", secondary="apps_tags", back_populates="tags")


class AppTag(Base):
    __tablename__ = "apps_tags"
    app_id = Column(Integer, ForeignKey("apps.id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)


class AppImage(Base):
    __tablename__ = "apps_images"
    id = Column(Integer, primary_key=True, index=True)
    app_id = Column(Integer, ForeignKey("apps.id", ondelete="CASCADE"), nullable=False)
    image_index = Column(Integer, nullable=False)
    image_path = Column(String(255), nullable=False)

    __table_args__ = (UniqueConstraint("app_id", "image_index"),)

    app = relationship("App", back_populates="images")
