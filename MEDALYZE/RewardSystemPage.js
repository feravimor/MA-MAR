import React, { useState, useEffect } from "react";
import axios from "axios";

const RewardSystemPage = ({ userId }) => {
    const [rewards, setRewards] = useState({ points: 0, redeemableItems: [] });
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${userId}/rewards`);
                setRewards(response.data);
            } catch (error) {
                console.error("Error fetching rewards:", error);
            }
        };

        fetchRewards();
    }, [userId]);

    const handleRedeem = async () => {
        if (!selectedItem) return;

        try {
            const response = await axios.post(`http://localhost:8000/rewards/redeem`, {
                userId,
                itemId: selectedItem.id,
            });
            alert("Item redeemed successfully!");
            setRewards(response.data.updatedRewards);
            setSelectedItem(null);
        } catch (error) {
            console.error("Error redeeming item:", error);
            alert("Failed to redeem the item.");
        }
    };

    return (
        <div>
            <h1>Reward System</h1>
            <p>Your Points: {rewards.points}</p>

            <h2>Redeemable Items</h2>
            <ul>
                {rewards.redeemableItems.map((item) => (
                    <li key={item.id}>
                        <p>{item.name}</p>
                        <p>Points Required: {item.pointsRequired}</p>
                        <button onClick={() => setSelectedItem(item)}>Select</button>
                    </li>
                ))}
            </ul>

            {selectedItem && (
                <div>
                    <h3>Selected Item</h3>
                    <p>{selectedItem.name}</p>
                    <button onClick={handleRedeem}>Redeem</button>
                </div>
            )}
        </div>
    );
};

export default RewardSystemPage;
