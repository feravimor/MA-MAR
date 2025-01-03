import React, { useState } from "react";
import axios from "axios";

const SearchStartPage = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = async (e) => {
        setQuery(e.target.value);

        try {
            const response = await axios.get(`http://localhost:8000/search/suggestions?query=${e.target.value}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div className="search-start-page">
            <h1>Find the Specialist You Need</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter a keyword, condition, or specialist name..."
                    value={query}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => setQuery(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
            <div className="filters">
                <button>Specialty</button>
                <button>Location</button>
                <button>Availability</button>
            </div>
        </div>
    );
};

export default SearchStartPage;
