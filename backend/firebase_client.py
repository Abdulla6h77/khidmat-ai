import os
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent
ENV_PATH = BACKEND_DIR / ".env"

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


db = initialize_firestore()


def get_providers(service_type=None, area=None):
    """Fetch providers, optionally filtered by service_type and area."""
    query = db.collection('providers')
    
    if service_type:
        query = query.where('service_types', 'array_contains', service_type)
    
    docs = query.stream()
    
    providers = []
    for doc in docs:
        data = doc.to_dict()
        data['doc_id'] = doc.id
        if area:
            if area in data.get('areas', []):
                providers.append(data)
        else:
            providers.append(data)
            
    return providers


def get_provider_by_id(provider_id):
    """Fetch a specific provider by their custom ID (e.g., P001)."""
    docs = db.collection('providers').where('id', '==', provider_id).stream()
    for doc in docs:
        data = doc.to_dict()
        data['doc_id'] = doc.id
        return data
    return None


def create_booking(booking_data):
    """Create a new booking document."""
    doc_ref = db.collection('bookings').document()
    doc_ref.set(booking_data)
    return doc_ref.id


def update_booking(booking_id, updates):
    """Update an existing booking document."""
    doc_ref = db.collection('bookings').document(booking_id)
    try:
        doc_ref.update(updates)
        return True
    except Exception:
        docs = db.collection('bookings').where('booking_id', '==', booking_id).limit(1).stream()
        for doc in docs:
            doc.reference.update(updates)
            return True
        raise


def get_booking_by_id(booking_id):
    """Fetch a booking by document ID or booking_id field."""
    doc = db.collection('bookings').document(booking_id).get()
    if doc.exists:
        data = doc.to_dict()
        data['doc_id'] = doc.id
        return data
    docs = db.collection('bookings').where('booking_id', '==', booking_id).limit(1).stream()
    for booking_doc in docs:
        data = booking_doc.to_dict()
        data['doc_id'] = booking_doc.id
        return data
    return None


def create_notification(notification_data):
    """Create a new notification document."""
    doc_ref = db.collection('notifications').document()
    doc_ref.set(notification_data)
    return doc_ref.id


def create_dispute(dispute_data):
    """Create a new dispute document."""
    doc_ref = db.collection('disputes').document()
    doc_ref.set(dispute_data)
    return doc_ref.id


def clear_test_documents(collection_name):
    """Delete test documents for demo_user_001 and anonymous users."""
    deleted = 0
    deleted_ids = set()
    for test_user_id in ("demo_user_001", "anonymous"):
        docs = db.collection(collection_name).where("user_id", "==", test_user_id).stream()
        for doc in docs:
            if doc.id in deleted_ids:
                continue
            doc.reference.delete()
            deleted_ids.add(doc.id)
            deleted += 1
    return {"collection": collection_name, "deleted": deleted}
