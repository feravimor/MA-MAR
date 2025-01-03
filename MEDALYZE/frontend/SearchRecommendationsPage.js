import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchRecommendationsPage = ({ specialistId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [trendingKeywords, setTrendingKeywords] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/search/recommendations/${specialistId}`);
                setRecommendations(response.data.recommendations);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        const fetchTrendingKeywords = async () => {
            try {
                const response = await axios.get("http://localhost:8000/search/trending");
                setTrendingKeywords(response.data);
            } catch (error) {
                console.error("Error fetching trending keywords:", error);
            }
        };

        fetchRecommendations();
        fetchTrendingKeywords();
    }, [specialistId]);

    return (
        <div>
            <h1>Search Recommendations</h1>
            <h2>Personalized Recommendations</h2>
            <ul>
                {recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                ))}
            </ul>

            <h2>Trending Keywords</h2>
            <ul>
                {trendingKeywords.map((keyword, index) => (
                    <li key={index}>
                        {keyword.keyword} ({keyword.search_count} searches)
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchRecommendationsPage;
