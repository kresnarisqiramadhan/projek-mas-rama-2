"""
BUS TICKET ONLINE - ROUTES.PY
File utama yang menangani semua URL dan logika aplikasi.
"""

from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from app import db
from app.models import Pembeli, Admin, Agen

# =========================================================
# BLUEPRINT
# =========================================================
main = Blueprint('main', __name__)

# =========================================================
# LANDING & GLOBAL
# =========================================================
@main.route('/')
@main.route('/index')
@main.route('/home')
def index():
    return render_template('index.html')


@main.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Anda telah berhasil logout.', 'info')
    return redirect(url_for('main.index'))

# =========================================================
# AUTENTIKASI UNIVERSAL (ADMIN, AGEN, PEMBELI)
# =========================================================
from flask import redirect, url_for, flash
from flask_login import login_user

def authenticate_user(
    model,
    identifier_field,
    identifier_value,
    password,
    dashboard_endpoint,
    remember=False,
    success_message=None,
    error_message='Email/Username atau password salah!'
):
    """
    Fungsi autentikasi universal untuk sistem Bus Ticket Online
    - Konsisten dengan arsitektur lama (multi model: Admin, Agen, Pembeli)
    - Menggunakan Flask-Login
    - Auto redirect ke dashboard sesuai aktor
    """

    # Cari user berdasarkan identifier (email / username)
    user = model.query.filter(
        getattr(model, identifier_field) == identifier_value
    ).first()

    # Validasi user & password
    if user and user.check_password(password):
        login_user(user, remember=remember)

        if success_message:
            flash(success_message, 'success')

        return redirect(url_for(dashboard_endpoint))

    flash(error_message, 'error')
    return None

# =========================================================
# PEMBELI
# =========================================================
@main.route('/pembeli/login', methods=['GET', 'POST'])
def pembeli_login():
    # Jika sudah login, langsung ke dashboard
    if current_user.is_authenticated:
        return redirect(url_for('main.pembeli_dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').lower().strip()
        password = request.form.get('password', '')
        remember = bool(request.form.get('remember'))

        if not email or not password:
            flash('Harap isi email dan password!', 'error')
            return render_template('pembeli_login.html')

        pembeli = Pembeli.query.filter_by(email=email).first()

        if pembeli and pembeli.check_password(password):
            login_user(pembeli, remember=remember)
            flash(f'Login berhasil! Selamat datang {pembeli.nama}.', 'success')

            return redirect(url_for('main.pembeli_dashboard'))

        flash('Email atau password salah!', 'error')

    return render_template('pembeli_login.html')


@main.route('/pembeli/register', methods=['GET', 'POST'])
def pembeli_register():
    if request.method == 'POST':
        nama = request.form.get('nama', '').strip()
        email = request.form.get('email', '').lower().strip()
        password = request.form.get('password', '')

        if not nama or not email or not password:
            flash('Harap lengkapi semua field!', 'error')
            return render_template('pembeli_register.html')

        if Pembeli.query.filter_by(email=email).first():
            flash('Email sudah terdaftar!', 'error')
            return render_template('pembeli_register.html')

        pembeli = Pembeli(nama=nama, email=email)
        pembeli.set_password(password)

        try:
            db.session.add(pembeli)
            db.session.commit()
            flash('Registrasi berhasil! Silakan login.', 'success')
            return redirect(url_for('main.pembeli_login'))
        except Exception as e:
            db.session.rollback()
            flash('Terjadi kesalahan sistem.', 'error')

    return render_template('pembeli_register.html')


@main.route('/pembeli/dashboard')
@login_required
def pembeli_dashboard():
    if not isinstance(current_user, Pembeli):
        flash('Akses ditolak!', 'error')
        return redirect(url_for('main.index'))

    return render_template(
        'pembeli_dashboard.html',
        nama=current_user.nama,
        email=current_user.email,
        join_date=current_user.created_at.strftime('%d %B %Y')
    )


@main.route('/pembeli/cari')
@login_required
def pembeli_caritiket():
    return render_template('pembeli_caritiket.html')


@main.route('/pembeli/hasil')
@login_required
def pembeli_hasilnya():
    return render_template('pembeli_hasilnya.html')


@main.route('/pembeli/kursi')
@login_required
def pembeli_pilihkursi():
    schedule_id = request.args.get('schedule')

    if not schedule_id:
        flash('Silakan pilih jadwal terlebih dahulu', 'error')
        return redirect(url_for('main.pembeli_caritiket'))

    return render_template('pembeli_pilihkursi.html', schedule_id=schedule_id)

@main.route('/pembeli/pemesanan')
@login_required
def pembeli_pemesanan():
    return render_template('pembeli_pemesanan.html')


@main.route('/pembeli/bayar')
@login_required
def pembeli_bayar():
    return render_template('pembeli_bayar.html')


@main.route('/pembeli/e-tiket')
@login_required
def pembeli_etiket():
    return render_template('pembeli_e-tiket.html')


# =========================================================
# ADMIN
# =========================================================
@main.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for('main.admin_dashboard'))

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')

        admin = Admin.query.filter_by(username=username).first()

        if admin and admin.check_password(password):
            login_user(admin)
            flash('Login admin berhasil!', 'success')
            return redirect(url_for('main.admin_dashboard'))

        flash('Username atau password admin salah!', 'error')

    return render_template('admin_login.html')


@main.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if not isinstance(current_user, Admin):
        flash('Akses admin ditolak!', 'error')
        return redirect(url_for('main.index'))

    return render_template('admin_dashboard.html')

@main.route('/admin/jadwal')
@login_required
def admin_jadwal():
    if not isinstance(current_user, Admin):
        return redirect(url_for('main.index'))
    return "<h2>Halaman Kelola Jadwal</h2>"


@main.route('/admin/pengguna')
@login_required
def admin_pengguna():
    if not isinstance(current_user, Admin):
        return redirect(url_for('main.index'))
    return "<h2>Halaman Kelola Pengguna</h2>"


@main.route('/admin/laporan')
@login_required
def admin_laporan():
    if not isinstance(current_user, Admin):
        return redirect(url_for('main.index'))
    return "<h2>Halaman Laporan</h2>"



# =========================================================
# AGEN
# =========================================================
@main.route('/agen/login', methods=['GET', 'POST'])
def agen_login():
    if current_user.is_authenticated:
        return redirect(url_for('main.agen_dashboard'))

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')

        agen = Agen.query.filter_by(username=username).first()

        if agen and agen.check_password(password):
            login_user(agen)
            flash('Login agen berhasil!', 'success')
            return redirect(url_for('main.agen_dashboard'))

        flash('Username atau password agen salah!', 'error')

    return render_template('agen_login.html')


@main.route('/agen/dashboard')
@login_required
def agen_dashboard():
    if not isinstance(current_user, Agen):
        flash('Akses ditolak!', 'error')
        return redirect(url_for('main.index'))

    return render_template('agen_dashboard.html')

# =========================================================
# API
# =========================================================
@main.route('/api/check_email', methods=['POST'])
def check_email():
    data = request.get_json() or {}
    email = data.get('email', '').lower().strip()

    return jsonify({
        'exists': Pembeli.query.filter_by(email=email).first() is not None
    })


@main.route('/api/user_info')
@login_required
def user_info():
    role = (
        'pembeli' if isinstance(current_user, Pembeli)
        else 'admin' if isinstance(current_user, Admin)
        else 'agen'
    )

    return jsonify({
        'nama': current_user.nama,
        'email': getattr(current_user, 'email', ''),
        'role': role
    })

# =========================================================
# ERROR HANDLER
# =========================================================
@main.app_errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404


@main.app_errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

