from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# Create a Flask application
app = Flask(__name__)

# Configure the SQLAlchemy database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'  # Use SQLite for this example
db = SQLAlchemy(app)

# Configure the Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

# Load the user from user_id
# You need to define the User model and the load_user function
# For this example, let's assume the User model is defined in models.py
from models import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Start the Flask application
if __name__ == '__main__':
    app.run()