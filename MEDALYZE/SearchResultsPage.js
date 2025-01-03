import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchResultsPage = ({ query }) => {
    const [results, setResults] = useState([]);
    const [filters, setFilters] = useState({ specialty: "", location: "", availability: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:8000/search?query=${query}`, { params: filters });
                setResults(response.data);
            } catch (error) {
                setError("Error fetching search results. Please try again later.");
                console.error("Error fetching search results:", error);
            }
            setLoading(false);
        };
        fetchResults();
    }, [query, filters]);

    return (
        <div className="search-results-page">
            <h1>Search Results</h1>
            <div className="filters">
                <select onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}>
                    <option value="">All Specialties</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Cardiology">Cardiology</option>
                    {/* More specialties */}
                </select>
                <select onChange={(e) => setFilters({ ...filters, location: e.target.value })}>
                    <option value="">All Locations</option>
                    <option value="City A">City A</option>
                    <option value="City B">City B</option>
                </select>
                <select onChange={(e) => setFilters({ ...filters, availability: e.target.value })}>
                    <option value="">Any Availability</option>
                    <option value="Now">Now</option>
                    <option value="Tomorrow">Tomorrow</option>
                </select>
            </div>
            <div className="results">
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && results.length === 0 && <p>No results found.</p>}
                {results.map((specialist) => (
                    <div key={specialist.id} className="specialist-card">
                        <h2>{specialist.name}</h2>
                        <p>{specialist.specialty}</p>
                        <p>{specialist.location}</p>
                        <p>Rating: {specialist.rating} / 5</p>
                        <button>View Profile</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResultsPage;
