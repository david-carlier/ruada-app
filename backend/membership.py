"""Membership verification module.

Verifies that authenticated users are registered members of the
music group via Auth0 tenant membership.
"""

from dataclasses import dataclass


@dataclass
class MembershipResult:
    """Result of membership verification."""

    is_member: bool
    user_id: str
    email: str


def check_membership(config, user_id: str) -> MembershipResult:
    """Verify that a user is a registered member of the music group.

    Checks Auth0 tenant to confirm the user_id exists as a valid member.

    Args:
        config: LambdaConfig with Auth0 settings.
        user_id: The Auth0 sub claim identifying the user.

    Returns:
        MembershipResult indicating whether the user is a member.
    """
    raise NotImplementedError("Implemented in task 6.2")
