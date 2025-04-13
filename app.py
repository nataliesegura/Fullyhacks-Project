from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
db = SQLAlchemy(app)

@app.route("/")
def landingpage():
    return render_template('landingpage.html')

@app.route("/Register")
def Register():
    return render_template('home.html')

@app.route("/Login")
def Login():
    return render_template('home.html')

@app.route("/Contacts")
def Contacts():
    return render_template('home.html')

@app.route("/Results")
def Results():
    return render_template('home.html')

if __name__ == 'main':
    app.run(debug=True)

