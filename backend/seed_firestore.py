import os
import json
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent
ENV_PATH = BACKEND_DIR / ".env"
SEED_FILE_PATH = PROJECT_ROOT / "data" / "providers_seed.json"

# Load backend/.env regardless of the current working directory.
load_dotenv(dotenv_path=ENV_PATH)


def initialize_firestore():
    """Initialize Firebase Admin using GOOGLE_APPLICATION_CREDENTIALS."""
    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not credentials_path:
        raise RuntimeError(
            f"GOOGLE_APPLICATION_CREDENTIALS is not set. Add it to {ENV_PATH}."
        )

    credentials_file = Path(credentials_path).expanduser()
    if not credentials_file.exists():
        raise RuntimeError(
            f"GOOGLE_APPLICATION_CREDENTIALS points to a missing file: {credentials_file}"
        )

    if not firebase_admin._apps:
        options = {}
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        if project_id:
            options["projectId"] = project_id

        cred = credentials.Certificate(str(credentials_file))
        firebase_admin.initialize_app(cred, options or None)

    return firestore.client()


def main():
    print("Initializing Firebase SDK...")
    db = initialize_firestore()

    print("Loading mock data...")
    with SEED_FILE_PATH.open('r', encoding='utf-8') as f:
        providers = json.load(f)

    print(f"Uploading {len(providers)} providers to Firestore...")
    batch = db.batch()
    for provider in providers:
        doc_ref = db.collection('providers').document(provider['id'])
        batch.set(doc_ref, provider)
    
    batch.commit()
    print("Successfully uploaded providers.")

    print("Creating placeholder documents for empty collections...")
    placeholder = {"_placeholder": True, "note": "Created by init script"}
    
    db.collection('bookings').document('placeholder_booking').set(placeholder)
    db.collection('notifications').document('placeholder_notification').set(placeholder)
    db.collection('disputes').document('placeholder_dispute').set(placeholder)
    
    print("Successfully created placeholder documents.")
    print("Database seeding completed.")


if __name__ == '__main__':
    main()
