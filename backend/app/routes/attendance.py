from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from datetime import date as date_type

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.post("/", response_model=schemas.Attendance)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # Validate employee exists
    employee = db.query(models.Employee).filter(models.Employee.id == attendance.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Validate status
    if attendance.status not in ["Present", "Absent"]:
        raise HTTPException(status_code=400, detail="Status must be Present or Absent")
    
    # Check if attendance already marked for this date
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()
    
    if existing:
        # Update existing record
        existing.status = attendance.status
        db.commit()
        db.refresh(existing)
        return existing
    
    # Create new record
    db_attendance = models.Attendance(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@router.get("/{employee_id}", response_model=list[schemas.Attendance])
def get_attendance(employee_id: int, db: Session = Depends(get_db)):
    return db.query(models.Attendance).filter(models.Attendance.employee_id == employee_id).all()

@router.get("/date/{date}")
def get_attendance_by_date(date: date_type, db: Session = Depends(get_db)):
    records = db.query(models.Attendance).filter(models.Attendance.date == date).all()
    
    # Join with employee data
    result = []
    for record in records:
        employee = db.query(models.Employee).filter(models.Employee.id == record.employee_id).first()
        if employee:
            result.append({
                "id": record.id,
                "employee_id": record.employee_id,
                "employee_name": employee.full_name,
                "employee_code": employee.employee_id,
                "department": employee.department,
                "date": record.date,
                "status": record.status
            })
    
    return result

@router.get("/all/records")
def get_all_attendance(db: Session = Depends(get_db)):
    return db.query(models.Attendance).all()