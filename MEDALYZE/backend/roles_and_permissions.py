from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, Role

router = APIRouter()

# Middleware for role-based access control
def role_required(required_role: str):
    def decorator(function):
        def wrapper(*args, **kwargs):
            user: User = kwargs.get("current_user")
            if user.role != required_role:
                raise HTTPException(status_code=403, detail="Access forbidden: insufficient permissions")
            return function(*args, **kwargs)
        return wrapper
    return decorator

# Endpoint to assign a role to a user
@router.post("/assign-role/{user_id}")
def assign_role(user_id: int, role: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    valid_roles = ["admin", "specialist", "patient"]
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Valid roles are: {', '.join(valid_roles)}")

    user.role = role
    db.commit()
    return {"message": f"Role {role} assigned to user {user.username}"}

# Protected endpoint example
@router.get("/admin-only")
@role_required("admin")
def admin_only_endpoint(current_user: User = Depends(get_db)):
    return {"message": "Welcome, admin!"}

# Endpoint to fetch roles
@router.get("/roles")
def get_roles():
    return {"roles": ["admin", "specialist", "patient"]}

# Endpoint to create a new role
@router.post("/create-role")
def create_role(role: str, db: Session = Depends(get_db)):
    if db.query(Role).filter(Role.name == role).first():
        raise HTTPException(status_code=400, detail="Role already exists")
    new_role = Role(name=role)
    db.add(new_role)
    db.commit()
    return {"message": f"Role {role} created successfully"}

# Endpoint to delete a role
@router.delete("/delete-role/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    db.delete(role)
    db.commit()
    return {"message": "Role deleted successfully"}

# Endpoint to list users by role
@router.get("/users-by-role/{role}")
def get_users_by_role(role: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.role == role).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found with this role")
    return {"users": [user.username for user in users]}
