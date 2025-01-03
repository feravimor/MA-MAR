import React, { useState, useEffect } from "react";
import axios from "axios";

const KeywordManagementPage = ({ specialistId }) => {
    const [availableKeywords, setAvailableKeywords] = useState([]);
    const [assignedKeywords, setAssignedKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState("");

    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const response = await axios.get("http://localhost:8000/keywords");
                setAvailableKeywords(response.data);

                const assignedResponse = await axios.get(
                    `http://localhost:8000/specialists/${specialistId}/keywords`
                );
                setAssignedKeywords(assignedResponse.data);
            } catch (error) {
                console.error("Error fetching keywords:", error);
            }
        };
        fetchKeywords();
    }, [specialistId]);

    const handleAddKeyword = async () => {
        try {
            const response = await axios.post("http://localhost:8000/keywords", { keyword: newKeyword });
            setAvailableKeywords([...availableKeywords, response.data]);
            setNewKeyword("");
        } catch (error) {
            console.error("Error adding new keyword:", error);
        }
    };

    const handleAssignKeyword = async (keywordId) => {
        try {
            await axios.post("http://localhost:8000/keywords/assign", {
                specialist_id: specialistId,
                keyword_id: keywordId,
            });
            const keyword = availableKeywords.find((kw) => kw.id === keywordId);
            setAssignedKeywords([...assignedKeywords, keyword]);
        } catch (error) {
            console.error("Error assigning keyword:", error);
        }
    };

    const handleUnassignKeyword = async (keywordId) => {
        try {
            await axios.delete(`http://localhost:8000/keywords/unassign/${specialistId}/${keywordId}`);
            setAssignedKeywords(assignedKeywords.filter((kw) => kw.id !== keywordId));
        } catch (error) {
            console.error("Error unassigning keyword:", error);
        }
    };

    return (
        <div>
            <h1>Keyword Management</h1>
            <h2>Assigned Keywords</h2>
            <ul>
                {assignedKeywords.map((keyword) => (
                    <li key={keyword.id}>
                        {keyword.keyword}
                        <button onClick={() => handleUnassignKeyword(keyword.id)}>Unassign</button>
                    </li>
                ))}
            </ul>
            <h2>Available Keywords</h2>
            <ul>
                {availableKeywords.map((keyword) => (
                    <li key={keyword.id}>
                        {keyword.keyword}
                        <button onClick={() => handleAssignKeyword(keyword.id)}>Assign</button>
                    </li>
                ))}
            </ul>
            <h2>Add New Keyword</h2>
            <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Enter a new keyword"
            />
            <button onClick={handleAddKeyword}>Add Keyword</button>
        </div>
    );
};

export default KeywordManagementPage;
