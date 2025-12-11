# __init__.py
from flask import Flask, render_template  # <--- Added render_template here
from .module1.routes import module1
from .module2.routes import module2
from .module3.routes import module3
from .module4.routes import module4

def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.register_blueprint(module1)
    app.register_blueprint(module2)
    app.register_blueprint(module3)
    app.register_blueprint(module4)
    
    @app.route('/')
    def index():
        return render_template('index.html')
    
    return app

# <--- Add this line at the very bottom!
app = create_app()