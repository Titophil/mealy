"""Merge multiple migration heads

Revision ID: 7a4990487680
Revises: 436a7ae0b967, ab3c48e5cd74
Create Date: 2025-07-23 10:50:43.563240

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7a4990487680'
down_revision = ('436a7ae0b967', 'ab3c48e5cd74')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
