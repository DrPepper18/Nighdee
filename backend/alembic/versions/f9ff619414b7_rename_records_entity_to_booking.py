"""Rename records entity to booking

Revision ID: f9ff619414b7
Revises: d4475ae25cb6
Create Date: 2026-01-20 18:20:12.432549

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "f9ff619414b7"
down_revision: str | Sequence[str] | None = "d4475ae25cb6"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.rename_table("records", "bookings")


def downgrade() -> None:
    """Downgrade schema."""
    op.rename_table("bookings", "records")
