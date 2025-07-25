import click
from flask.cli import with_appcontext
from server.extensions import db
from server.models.user import User

@click.group()
def seed():
    """Database seeding commands."""
    pass

@seed.command()
@click.option('--email', default='admin@mealy.com', help='Email for the default admin user.')
@click.option('--password', default='adminpassword', help='Password for the default admin user.')
@with_appcontext
def create_admin(email, password):
    """Creates a default admin user."""
    user = User.query.filter_by(email=email).first()
    if user:
        click.echo(f"Admin user with email '{email}' already exists.")
        return

    new_admin = User(email=email, name="Admin User", role='admin') 
    new_admin.set_password(password)
    db.session.add(new_admin)
    db.session.commit()
    click.echo(f"Admin user '{email}' created successfully with password '{password}'.")

