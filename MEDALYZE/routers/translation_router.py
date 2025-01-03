from fastapi import APIRouter, Request

router = APIRouter()

# Language dictionary
LANGUAGES = {
    "en": {
        "greeting": "Hello",
        "appointment_reminder": "You have an appointment tomorrow.",
    },
    "es": {
        "greeting": "Hola",
        "appointment_reminder": "Tienes una cita mañana.",
    },
    "fr": {
        "greeting": "Bonjour",
        "appointment_reminder": "Vous avez un rendez-vous demain.",
    },
}

# Endpoint to get a translated message
@router.get("/translate/{key}")
def get_translation(key: str, request: Request):
    lang = request.state.language[:2]  # Get language prefix, e.g., "en" from "en-US"
    translations = LANGUAGES.get(lang, LANGUAGES["en"])
    return {"message": translations.get(key, key)}

# Endpoint to fetch supported languages
@router.get("/languages")
def get_supported_languages():
    return {"supported_languages": list(LANGUAGES.keys())}
