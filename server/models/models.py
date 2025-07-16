class MealOption(db.Model):
    __tablename__ = 'meal_options'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable = False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    caterer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable= False)

    caterer = db.relationship("User", backref="meal_options")