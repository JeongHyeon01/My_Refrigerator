# app/utils/alert_utils.py

from datetime import datetime, timedelta

def is_expiring_soon(expiration_date: datetime, days_before: int = 3) -> bool:
    """
    expiration_date: 유통기한(UTC datetime)
    days_before: 며칠 전부터 알림을 보낼지(기본값 3일 전)
    """
    now = datetime.now()
    return now <= expiration_date <= (now + timedelta(days=days_before))
