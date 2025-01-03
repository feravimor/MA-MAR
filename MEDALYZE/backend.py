import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI
from fastapi.middleware.locale import LocaleMiddleware
from routers import translation_router  # Import the translation router

app = FastAPI()

# Add the LanguageMiddleware
app.add_middleware(LocaleMiddleware)

# Include the translation router
app.include_router(translation_router, prefix="/api")

def recommend_keywords(specialist_profile, keyword_search_data):
    specialist_text = f"{specialist_profile['category']} {specialist_profile['area']} {' '.join(specialist_profile['keywords'])}"
    corpus = keyword_search_data["keyword"].tolist() + [specialist_text]

    vectorizer = CountVectorizer().fit_transform(corpus)
    vectors = vectorizer.toarray()

    similarity_matrix = cosine_similarity(vectors)
    specialist_similarity = similarity_matrix[-1][:-1]

    keyword_search_data["similarity"] = specialist_similarity
    recommendations = keyword_search_data.sort_values(by="similarity", ascending=False).head(10)

    return recommendations["keyword"].tolist()
