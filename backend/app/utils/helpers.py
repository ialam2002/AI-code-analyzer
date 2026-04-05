"""Utility functions for the backend application."""

import logging
from typing import Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)


def log_request(method: str, path: str, status_code: int, duration_ms: float):
    """Log API request details."""
    logger.info(
        f"{method} {path} - {status_code} - {duration_ms:.2f}ms"
    )


def log_error(error_type: str, message: str, context: Dict[str, Any] = None):
    """Log errors with context."""
    logger.error(
        f"[{error_type}] {message}",
        extra=context or {}
    )


def format_timestamp(dt: datetime) -> str:
    """Format datetime for API responses."""
    return dt.isoformat()


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal."""
    # Remove path separators and special characters
    dangerous_chars = ['/', '\\', '..', '\x00']
    for char in dangerous_chars:
        filename = filename.replace(char, '')
    return filename


def estimate_code_complexity(lines_of_code: int) -> str:
    """Estimate code complexity based on lines of code."""
    if lines_of_code < 100:
        return "low"
    elif lines_of_code < 500:
        return "medium"
    elif lines_of_code < 1000:
        return "high"
    else:
        return "very_high"


def format_file_size(size_bytes: int) -> str:
    """Convert bytes to human-readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f}{unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f}TB"

