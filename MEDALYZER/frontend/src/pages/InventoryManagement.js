import React, { useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

function InventoryManagement() {
  const [inventory, setInventory] = useState([
    { name: "Anesthetic", quantity: 5, unitCost: 200, history: [] },
    { name: "Gloves", quantity: 100, unitCost: 50, history: [] },
  ]);

  const [newItem, setNewItem] = useState({ name: "", quantity: "", unitCost: "", history: [] });
  const [updateItem, setUpdateItem] = useState({ name: "", quantity: "" });

  const addItem = () => {
    if (newItem.name && newItem.quantity && newItem.unitCost) {
      setInventory([...inventory, newItem]);
      setNewItem({ name: "", quantity: "", unitCost: "", history: [] });
    } else {
      alert("Please fill out all fields.");
    }
  };

  const updateItemQuantity = () => {
    const index = inventory.findIndex(item => item.name === updateItem.name);
    if (index !== -1) {
      const updatedInventory = [...inventory];
      updatedInventory[index].quantity = updateItem.quantity;
      updatedInventory[index].history.push({
        action: "Updated Quantity",
        date: new Date().toLocaleString(),
      });
      setInventory(updatedInventory);
      setUpdateItem({ name: "", quantity: "" });
    } else {
      alert("Item not found.");
    }
  };

  const deleteItem = (index) => {
    const updatedInventory = [...inventory];
    updatedInventory[index].history.push({
      action: "Deleted",
      date: new Date().toLocaleString(),
    });
    setInventory(inventory.filter((_, i) => i !== index));
  };

  const exportInventoryCSV = () => {
    const csvContent = [
      ["Item Name", "Quantity", "Unit Cost"],
      ...inventory.map((item) => [item.name, item.quantity, item.unitCost]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "inventory.csv");
  };

  const exportInventoryPDF = () => {
    const doc = new jsPDF();
    doc.text("Inventory Report", 14, 10);
    doc.autoTable({
      head: [["Item Name", "Quantity", "Unit Cost"]],
      body: inventory.map((item) => [item.name, item.quantity, item.unitCost]),
    });
    doc.save("inventory.pdf");
  };

  const exportInventoryExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(inventory);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory.xlsx");
  };

  const importInventory = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json(sheet);

      setInventory([...inventory, ...importedData]);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="inventory-management-container">
      <h1>Inventory Management</h1>
      <div className="add-item-form">
        <h2>Add New Item</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <input
          type="number"
          placeholder="Unit Cost"
          value={newItem.unitCost}
          onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <div className="update-item-form">
        <h2>Update Item Quantity</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={updateItem.name}
          onChange={(e) => setUpdateItem({ ...updateItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="New Quantity"
          value={updateItem.quantity}
          onChange={(e) => setUpdateItem({ ...updateItem, quantity: e.target.value })}
        />
        <button onClick={updateItemQuantity}>Update Quantity</button>
      </div>
      <div className="inventory-list">
        <h2>Current Inventory</h2>
        <ul>
          {inventory.map((item, index) => (
            <li key={index}>
              {item.name} - Quantity: {item.quantity}, Unit Cost: ${item.unitCost}
              <button onClick={() => deleteItem(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="export-buttons">
        <h2>Export Inventory</h2>
        <button onClick={exportInventoryCSV}>Export CSV</button>
        <button onClick={exportInventoryPDF}>Export PDF</button>
        <button onClick={exportInventoryExcel}>Export Excel</button>
      </div>
      <div className="import-buttons">
        <h2>Import Inventory</h2>
        <input type="file" accept=".xlsx, .xls" onChange={importInventory} />
      </div>
    </div>
  );
}

export default InventoryManagement;
