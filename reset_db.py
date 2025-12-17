from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    users = [
        # ADMIN
        User(
            name="Super Admin",
            email="admin@bus.com",
            password=generate_password_hash("admin123"),
            role="admin"
        ),

        # AGEN
        User(
            name="Agen Jakarta",
            email="agen@bus.com",
            password=generate_password_hash("agen123"),
            role="agen"
        ),

        # PENUMPANG
        User(
            name="Budi Penumpang",
            email="user@bus.com",
            password=generate_password_hash("user123"),
            role="penumpang"
        ),
    ]

    db.session.add_all(users)
    db.session.commit()

    print("✅ Dummy users berhasil dibuat")
