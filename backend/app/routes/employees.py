from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/employees", tags=["employees"])

@router.post("/", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.employee_id == employee.employee_id).first()
    if db_employee:
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    
    db_employee = db.query(models.Employee).filter(models.Employee.email == employee.email).first()
    if db_employee:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.get("/", response_model=list[schemas.Employee])
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(db_employee)
    db.commit()
    return {"message": "Employee deleted successfully"}

@router.put("/{employee_id}", response_model=schemas.Employee)
def update_employee(employee_id: int, employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if new employee_id conflicts with another employee
    if employee.employee_id != db_employee.employee_id:
        existing = db.query(models.Employee).filter(
            models.Employee.employee_id == employee.employee_id,
            models.Employee.id != employee_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Employee ID already exists")
    
    # Check if new email conflicts with another employee
    if employee.email != db_employee.email:
        existing = db.query(models.Employee).filter(
            models.Employee.email == employee.email,
            models.Employee.id != employee_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")
    
    db_employee.employee_id = employee.employee_id
    db_employee.full_name = employee.full_name
    db_employee.email = employee.email
    db_employee.department = employee.department
    
    db.commit()
    db.refresh(db_employee)
    return db_employee