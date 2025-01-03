from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="professional")

class Treatment(Base):
    __tablename__ = "treatments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    base_cost = Column(Float)
    sale_price = Column(Float)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    month = Column(String)
    income = Column(Float)
    expenses = Column(Float)
    profit = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"))

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(Integer)
    owner_id = Column(Integer, ForeignKey("users.id"))

# ...existing code...
