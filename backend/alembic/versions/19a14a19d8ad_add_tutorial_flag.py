"""Add tutorial flag

Revision ID: 19a14a19d8ad
Revises: b4c9b485e65e
Create Date: 2026-06-30 18:22:27.251029

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "19a14a19d8ad"
down_revision: str | Sequence[str] | None = "b4c9b485e65e"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "users",
        sa.Column(
            "is_introduced",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users", "is_introduced")
