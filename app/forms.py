from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField

class BookingForm(FlaskForm):
    passenger_name = StringField("Passenger Name")
    submit = SubmitField("Book Ticket")
