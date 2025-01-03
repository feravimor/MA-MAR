import React, { useState } from "react";

function Treatments() {
  const [treatments, setTreatments] = useState([
    { name: "Root Canal", cost: 2000 },
    { name: "Teeth Cleaning", cost: 500 },
  ]);
  const [newTreatment, setNewTreatment] = useState({ name: "", cost: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTreatmentIndex, setCurrentTreatmentIndex] = useState(null);

  const addTreatment = () => {
    if (newTreatment.name && newTreatment.cost) {
      setTreatments([...treatments, newTreatment]);
      setNewTreatment({ name: "", cost: "" });
    } else {
      alert("Please fill out all fields");
    }
  };

  const deleteTreatment = (index) => {
    setTreatments(treatments.filter((_, i) => i !== index));
  };

  const editTreatment = (index) => {
    setIsEditing(true);
    setCurrentTreatmentIndex(index);
    setNewTreatment(treatments[index]);
  };

  const updateTreatment = () => {
    if (newTreatment.name && newTreatment.cost) {
      const updatedTreatments = treatments.map((treatment, index) =>
        index === currentTreatmentIndex ? newTreatment : treatment
      );
      setTreatments(updatedTreatments);
      setNewTreatment({ name: "", cost: "" });
      setIsEditing(false);
      setCurrentTreatmentIndex(null);
    } else {
      alert("Please fill out all fields");
    }
  };

  const totalCost = treatments.reduce((total, treatment) => total + parseFloat(treatment.cost), 0);

  return (
    <div className="treatments-container">
      <h1>Manage Treatments</h1>
      <ul>
        {treatments.map((treatment, index) => (
          <li key={index}></li>
            {treatment.name} - ${treatment.cost}
            <button onClick={() => deleteTreatment(index)}>Delete</button>
            <button onClick={() => editTreatment(index)}>Edit</button>
          </li>
        ))}
      </ul>
      <div className="add-treatment-form">
        <input
          type="text"
          placeholder="Treatment Name"
          value={newTreatment.name}
          onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Cost"
          value={newTreatment.cost}
          onChange={(e) => setNewTreatment({ ...newTreatment, cost: e.target.value })}
        />
        {isEditing ? (
          <button onClick={updateTreatment}>Update Treatment</button>
        ) : (
          <button onClick={addTreatment}>Add Treatment</button>
        )}
      </div>
      <h2>Total Cost: ${totalCost}</h2>
    </div>
  );
}

export default Treatments;
