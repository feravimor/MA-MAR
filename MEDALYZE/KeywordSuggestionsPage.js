import React, { useState, useEffect } from "react";
import axios from "axios";

const KeywordSuggestionsPage = ({ specialistId }) => {
    const [currentKeywords, setCurrentKeywords] = useState([]);
    const [recommendedKeywords, setRecommendedKeywords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/specialists/${specialistId}`);
                setCurrentKeywords(response.data.keywords);
            } catch (error) {
                setError("Error fetching specialist keywords");
                console.error("Error fetching specialist keywords:", error);
            }
        };

        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/keywords/${specialistId}/recommendations`);
                setRecommendedKeywords(response.data.recommendations);
            } catch (error) {
                setError("Error fetching recommendations");
                console.error("Error fetching recommendations:", error);
            }
        };

        const fetchData = async () => {
            await fetchKeywords();
            await fetchRecommendations();
            setLoading(false);
        };

        fetchData();
    }, [specialistId]);

    const handleAddKeyword = async (keyword) => {
        try {
            await axios.post("http://localhost:8000/keywords/assign", {
                specialist_id: specialistId,
                keyword: keyword,
            });
            setCurrentKeywords([...currentKeywords, keyword]);
        } catch (error) {
            setError("Error adding keyword");
            console.error("Error adding keyword:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Keyword Suggestions</h1>
            <h2>Current Keywords</h2>
            <ul>
                {currentKeywords.map((keyword) => (
                    <li key={keyword}>{keyword}</li>
                ))}
            </ul>
            <h2>Recommended Keywords</h2>
            <ul>
                {recommendedKeywords.map((keyword) => (
                    <li key={keyword}>
                        {keyword} <button onClick={() => handleAddKeyword(keyword)}>Add</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default KeywordSuggestionsPage;
