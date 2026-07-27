import os
import logging
import requests

logger = logging.getLogger(__name__)

# Same shared-secret pattern used for the Go -> Django internal endpoints,
# just sent in the other direction here (Django -> Go).
GO_ENGINE_URL = os.getenv("GO_ENGINE_URL", "").rstrip("/")
GO_ENGINE_SECRET = os.getenv("INTERNAL_AUTH_SECRET")
GO_ENGINE_TIMEOUT_SECONDS = float(os.getenv("GO_ENGINE_TIMEOUT_SECONDS", "5"))


class DecompositionTriggerError(Exception):
    """Raised when Django fails to hand a goal off to the Go engine."""


def trigger_decomposition(goal):
    """
    Notifies the Go engine that a new goal is ready for decomposition.

    This is a fire-and-forget *trigger*, not the decomposition itself —
    Go does the actual work asynchronously and reports results back via
    InternalBulkTaskIngestionView / InternalGoalFailureView. We keep the
    HTTP call itself short (small timeout) so a slow/unreachable Go engine
    doesn't block the user's request for long; the caller is responsible
    for marking the goal FAILED if this raises.
    """
    if not GO_ENGINE_URL:
        raise DecompositionTriggerError("GO_ENGINE_URL is not configured.")
    if not GO_ENGINE_SECRET:
        raise DecompositionTriggerError("INTERNAL_AUTH_SECRET is not configured.")

    payload = {
        "goal_id": str(goal.id),
        "user_id": str(goal.user_id),
        "raw_input": goal.raw_input,
        "due_date": goal.due_date.isoformat() if goal.due_date else None,
    }

    try:
        response = requests.post(
            f"{GO_ENGINE_URL}/v1/decompose",
            json=payload,
            headers={"X-Internal-Secret": GO_ENGINE_SECRET},
            timeout=GO_ENGINE_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        logger.error("Failed to trigger decomposition for goal %s: %s", goal.id, exc)
        raise DecompositionTriggerError(str(exc)) from exc

    return response
