from app.routes.meal_routes import meal_bp
app.register_blueprint(meal_bp, url_prefix='/api/meals')
