import React, { useState, useEffect } from "react";
import axios from "axios";

const AdvancedSearchPage = () => {
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState({
        priceRange: [0, 1000],
        distance: 50,
        languages: [],
    });
    const [results, setResults] = useState([]);
    const [availableLanguages, setAvailableLanguages] = useState([]);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await axios.get("http://localhost:8000/search/languages");
                setAvailableLanguages(response.data);
            } catch (error) {
                console.error("Error fetching languages:", error);
            }
        };

        fetchLanguages();
    }, []);

    const handleSearch = async () => {
        try {
            const response = await axios.post("http://localhost:8000/search/advanced", { query, filters });
            setResults(response.data);
        } catch (error) {
            console.error("Error performing advanced search:", error);
        }
    };

    return (
        <div>
            <h1>Advanced Search</h1>
            <label>
                Query:
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </label>

            <h2>Filters</h2>
            <label>
                Price Range:
                <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                />
                <span>{`$0 - $${filters.priceRange[1]}`}</span>
            </label>

            <label>
                Distance (km):
                <input
                    type="number"
                    value={filters.distance}
                    onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                />
            </label>

            <label>
                Languages:
                <select
                    multiple
                    value={filters.languages}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            languages: Array.from(e.target.selectedOptions, (option) => option.value),
                        })
                    }
                >
                    {availableLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
            </label>

            <button onClick={handleSearch}>Search</button>

            <h2>Results</h2>
            <ul>
                {results.map((result) => (
                    <li key={result.id}>
                        <p>Name: {result.name}</p>
                        <p>Specialty: {result.specialty}</p>
                        <p>Price: ${result.price}</p>
                        <p>Distance: {result.distance} km</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdvancedSearchPage;
