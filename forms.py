from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired
from run import db, app

class RegistrationForm(FlaskForm):
    id == db.Column(db.Integer, primary_key=True)