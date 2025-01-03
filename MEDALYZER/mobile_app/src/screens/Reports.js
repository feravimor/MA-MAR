import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { fetchWithCache } from "../utils/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";

// mobile_app/src/screens/Reports.js

function Reports() {
    return (
        <View>
            <Text>Reports</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    reportCard: {
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    month: {
        fontSize: 18,
        fontWeight: "bold",
    },
    details: {
        fontSize: 14,
        color: "#666",
    },
});

export default Reports;