class Config:
    SECRET_KEY = "bus-ticket-secret"
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://flask:flask123@localhost/db_bus_ticket"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
