import resend
from app.config import settings

resend.api_key = settings.resend_api_key

def send_verification_email(to_email: str, code: str):
    resend.Emails.send({
        "from": "Lokaltorget <onboarding@resend.dev>",
        "to": [to_email],
        "subject": "Verifiera din e-postadress",
        "html": f"""
            <h2>Välkommen till Lokaltorget!</h2>
            <p>Din verifieringskod är:</p>
            <h1 style="letter-spacing: 4px;">{code}</h1>
            <p>Koden är giltig i 15 minuter.</p>
        """,
    })