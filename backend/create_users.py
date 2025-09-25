#!/usr/bin/env python3
from __future__ import annotations

from werkzeug.security import generate_password_hash
import json

from app import create_app, db
from app.models import CHWUser, DoctorUser, Patient

app = create_app()

def create_test_users():
    with app.app_context():
        # Define test users with different roles
        test_users = [
            # CHW Users
            {
                "email": "chw1@test.com",
                "password": "password123",
                "name": "Maria Gonzalez",
                "role": "chw",
                "model": CHWUser
            },
            {
                "email": "chw2@test.com",
                "password": "password123",
                "name": "Carlos Rodriguez",
                "role": "chw",
                "model": CHWUser
            },
            {
                "email": "chw3@test.com",
                "password": "password123",
                "name": "Ana Martinez",
                "role": "chw",
                "model": CHWUser
            },
            # Doctor Users
            {
                "email": "doctor1@test.com",
                "password": "password123",
                "name": "Dr. Sofia Hernandez",
                "role": "doctor",
                "model": DoctorUser
            },
            {
                "email": "doctor2@test.com",
                "password": "password123",
                "name": "Dr. Miguel Lopez",
                "role": "doctor",
                "model": DoctorUser
            },
            {
                "email": "doctor3@test.com",
                "password": "password123",
                "name": "Dr. Isabella Torres",
                "role": "doctor",
                "model": DoctorUser
            }
        ]

        chw_ids = []
        doctor_ids = []

        for user_data in test_users:
            # Check if user already exists
            existing_user = user_data["model"].query.filter_by(email=user_data["email"]).first()

            if existing_user:
                print(f"{user_data['role'].upper()} user {user_data['email']} already exists")
                user_id = existing_user.id
            else:
                # Create new user
                user = user_data["model"](
                    email=user_data["email"],
                    password_hash=generate_password_hash(user_data["password"]),
                    name=user_data["name"]
                )
                db.session.add(user)
                db.session.commit()
                user_id = user.id
                print(f"{user_data['role'].upper()} user {user_data['email']} created")

            # Track IDs by role
            if user_data["role"] == "chw":
                chw_ids.append(user_id)
            else:
                doctor_ids.append(user_id)

        print("\nTest users ready:")
        print("=== CHW Users ===")
        for i, user_data in enumerate(test_users[:3], 1):
            print(f"CHW{i}: {user_data['email']} / {user_data['password']} - {user_data['name']}")

        print("\n=== Doctor Users ===")
        for i, user_data in enumerate(test_users[3:], 1):
            print(f"Doctor{i}: {user_data['email']} / {user_data['password']} - {user_data['name']}")

        return chw_ids, doctor_ids

def create_dummy_patients(chw_ids):
    with app.app_context():
        # Check if patients already exist
        total_existing_patients = sum(Patient.query.filter_by(chw_id=chw_id).count() for chw_id in chw_ids)

        target_patients_per_chw = 3  # 3 patients per CHW
        target_total_patients = len(chw_ids) * target_patients_per_chw

        if total_existing_patients >= target_total_patients:
            print(f"Enough patients already exist ({total_existing_patients} found)")
            return [Patient.query.filter_by(chw_id=chw_id).all() for chw_id in chw_ids]

        # Patient data templates
        patient_templates = [
            {
                "demographics": json.dumps({
                    "name": "Maria Rodriguez",
                    "age": 34,
                    "gender": "Female",
                    "phone": "+1-555-0123",
                    "address": "123 Main St, Rural District",
                    "emergency_contact": "Juan Rodriguez (+1-555-0124)"
                })
            },
            {
                "demographics": json.dumps({
                    "name": "Carlos Mendoza",
                    "age": 28,
                    "gender": "Male",
                    "phone": "+1-555-0125",
                    "address": "456 Oak Ave, Village Center",
                    "emergency_contact": "Ana Mendoza (+1-555-0126)"
                })
            },
            {
                "demographics": json.dumps({
                    "name": "Isabella Santos",
                    "age": 42,
                    "gender": "Female",
                    "phone": "+1-555-0127",
                    "address": "789 Pine Rd, Coastal Area",
                    "emergency_contact": "Pedro Santos (+1-555-0128)"
                })
            },
            {
                "demographics": json.dumps({
                    "name": "Miguel Torres",
                    "age": 19,
                    "gender": "Male",
                    "phone": "+1-555-0129",
                    "address": "321 Elm St, Mountain Region",
                    "emergency_contact": "Rosa Torres (+1-555-0130)"
                })
            },
            {
                "demographics": json.dumps({
                    "name": "Sofia Ramirez",
                    "age": 56,
                    "gender": "Female",
                    "phone": "+1-555-0131",
                    "address": "654 Cedar Ln, Urban District",
                    "emergency_contact": "Luis Ramirez (+1-555-0132)"
                })
            },
            {
                "demographics": json.dumps({
                    "name": "Diego Fernandez",
                    "age": 31,
                    "gender": "Male",
                    "phone": "+1-555-0133",
                    "address": "987 Birch Dr, Suburban Area",
                    "emergency_contact": "Carmen Fernandez (+1-555-0134)"
                })
            },
            {
                "demographics": json.dumps({
                    "name": "Valentina Lopez",
                    "age": 23,
                    "gender": "Female",
                    "phone": "+1-555-0135",
                    "address": "147 Maple St, Rural Outskirts",
                    "emergency_contact": "Antonio Lopez (+1-555-0136)"
                })
            },
            {
                "demographics": json.dumps({
                    "name": "Javier Morales",
                    "age": 67,
                    "gender": "Male",
                    "phone": "+1-555-0137",
                    "address": "258 Willow Ave, Elderly Community",
                    "emergency_contact": "Elena Morales (+1-555-0138)"
                })
            },
            {
                "demographics": json.dumps({
                    "name": "Carmen Diaz",
                    "age": 45,
                    "gender": "Female",
                    "phone": "+1-555-0139",
                    "address": "369 Spruce St, Downtown Area",
                    "emergency_contact": "Roberto Diaz (+1-555-0140)"
                })
            }
        ]

        all_patients = []

        # Distribute patients among CHWs
        for i, chw_id in enumerate(chw_ids):
            existing_patients = Patient.query.filter_by(chw_id=chw_id).all()
            patients_for_chw = list(existing_patients)

            # Calculate how many more patients this CHW needs
            needed_patients = target_patients_per_chw - len(existing_patients)

            if needed_patients > 0:
                # Get patient templates for this CHW (different templates for each CHW)
                start_idx = (i * target_patients_per_chw) % len(patient_templates)
                chw_templates = patient_templates[start_idx:start_idx + needed_patients]
                if len(chw_templates) < needed_patients:
                    # Wrap around if we need more templates
                    chw_templates.extend(patient_templates[:needed_patients - len(chw_templates)])

                for template in chw_templates:
                    patient = Patient(
                        chw_id=chw_id,
                        demographics=template["demographics"],
                        sync_status="synced"
                    )
                    patients_for_chw.append(patient)
                    db.session.add(patient)

            all_patients.append(patients_for_chw)

        db.session.commit()

        total_created = sum(len(patients) for patients in all_patients)
        print(f"Created additional patients. Total patients across all CHWs: {total_created}")

        return all_patients

if __name__ == "__main__":
    chw_ids, doctor_ids = create_test_users()
    patients_list = create_dummy_patients(chw_ids)
    print("\nDummy data creation complete!")
    print(f"Total CHWs created: {len(chw_ids)}")
    print(f"Total Doctors created: {len(doctor_ids)}")
    print(f"Total patients created: {sum(len(patients) for patients in patients_list)}")