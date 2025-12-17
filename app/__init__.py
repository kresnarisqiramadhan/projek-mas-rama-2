from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os

db = SQLAlchemy()
login_manager = LoginManager()

# =========================
# USER LOADER (DI LUAR)
# =========================
from app.models import Pembeli, Admin, Agen

@login_manager.user_loader
def load_user(user_id):
    user = Pembeli.query.get(int(user_id))
    if user:
        return user

    user = Admin.query.get(int(user_id))
    if user:
        return user

    user = Agen.query.get(int(user_id))
    if user:
        return user

    return None


# =========================
# CREATE APP
# =========================
def create_app():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)

    template_path = os.path.join(project_root, 'templates')
    static_path = os.path.join(project_root, 'static')

    app = Flask(
        __name__,
        template_folder=template_path,
        static_folder=static_path
    )

    app.config['SECRET_KEY'] = 'bus-ticket-online-secret-key-2024'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///busticket.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # init extensions
    db.init_app(app)
    login_manager.init_app(app)

    # login config
    login_manager.login_view = 'main.pembeli_login'
    login_manager.login_message_category = 'info'

    # register blueprint
    from app.routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    # db init
    with app.app_context():
        db.create_all()
        create_default_users()

    return app


# =========================
# DEFAULT USERS
# =========================
def create_default_users():
    from app.models import Admin, Agen, Pembeli

    try:
        if not Admin.query.filter_by(username='admin').first():
            admin = Admin(
                username='admin',
                email='admin@busticket.com',
                nama='Administrator'
            )
            admin.set_password('admin123')
            db.session.add(admin)

        if not Agen.query.filter_by(username='agen').first():
            agen = Agen(
                username='agen',
                email='agen@busticket.com',
                nama='Agen Bus',
                perusahaan='BusTicket Partner'
            )
            agen.set_password('agen123')
            db.session.add(agen)

        if not Pembeli.query.filter_by(email='demo@busticket.com').first():
            pembeli = Pembeli(
                nama='Demo User',
                email='demo@busticket.com'
            )
            pembeli.set_password('demo123')
            db.session.add(pembeli)

        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print("[SYSTEM ERROR]", e)
