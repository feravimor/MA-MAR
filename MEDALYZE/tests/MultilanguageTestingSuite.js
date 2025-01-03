import React from 'react';
import { render, screen } from '@testing-library/react';
import { LanguageContext } from '../utils/MultiLanguageProvider';
import { InvoiceManagement, RewardsSystem } from '../components/MultilanguageIntegration';
import PatientDashboard from '../PatientDashboard'; // Import PatientDashboard

const translations = {
    en: {
        patient_dashboard_title: "Patient Dashboard",
        upcoming_appointments_title: "Upcoming Appointments",
        cancel_button: "Cancel",
        recommendations_title: "Recommendations for You",
        invoice_management_title: "Invoice Management",
        date_label: "Date",
        amount_label: "Amount",
        download_button: "Download Invoice",
        no_invoices_message: "No invoices available.",
        rewards_system_title: "Rewards System",
        your_points_label: "Your Points",
        available_rewards_label: "Available Rewards",
        points_label: "points",
        redeem_button: "Redeem",
        redeem_reward_title: "Redeem Reward",
        points_required_label: "Points Required",
        confirm_button: "Confirm",
        cancel_button: "Cancel",
    },
    es: {
        patient_dashboard_title: "Panel del Paciente",
        upcoming_appointments_title: "Próximas Citas",
        cancel_button: "Cancelar",
        recommendations_title: "Recomendaciones para Ti",
        invoice_management_title: "Gestión de Facturas",
        date_label: "Fecha",
        amount_label: "Monto",
        download_button: "Descargar Factura",
        no_invoices_message: "No hay facturas disponibles.",
        rewards_system_title: "Sistema de Recompensas",
        your_points_label: "Tus Puntos",
        available_rewards_label: "Recompensas Disponibles",
        points_label: "puntos",
        redeem_button: "Canjear",
        redeem_reward_title: "Canjear Recompensa",
        points_required_label: "Puntos Requeridos",
        confirm_button: "Confirmar",
        cancel_button: "Cancelar",
    },
};

const renderWithLanguage = (component, language) => {
    return render(
        <LanguageContext.Provider
            value={{ translate: (key) => translations[language][key] || key }}
        >
            {component}
        </LanguageContext.Provider>
    );
};

// Invoice Management Tests
test("renders Invoice Management in English", () => {
    renderWithLanguage(<InvoiceManagement />, "en");
    expect(screen.getByText(/Invoice Management/i)).toBeInTheDocument();
    expect(screen.getByText(/No invoices available/i)).toBeInTheDocument();
});

test("renders Invoice Management in Spanish", () => {
    renderWithLanguage(<InvoiceManagement />, "es");
    expect(screen.getByText(/Gestión de Facturas/i)).toBeInTheDocument();
    expect(screen.getByText(/No hay facturas disponibles/i)).toBeInTheDocument();
});

// Rewards System Tests
test("renders Rewards System in English", () => {
    renderWithLanguage(<RewardsSystem />, "en");
    expect(screen.getByText(/Rewards System/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Points/i)).toBeInTheDocument();
});

test("renders Rewards System in Spanish", () => {
    renderWithLanguage(<RewardsSystem />, "es");
    expect(screen.getByText(/Sistema de Recompensas/i)).toBeInTheDocument();
    expect(screen.getByText(/Tus Puntos/i)).toBeInTheDocument();
});

// Patient Dashboard Tests
test("renders Patient Dashboard in English", () => {
    renderWithLanguage(<PatientDashboard />, "en");
    expect(screen.getByText(/Patient Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Appointments/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommendations for You/i)).toBeInTheDocument();
});

test("renders Patient Dashboard in Spanish", () => {
    renderWithLanguage(<PatientDashboard />, "es");
    expect(screen.getByText(/Panel del Paciente/i)).toBeInTheDocument();
    expect(screen.getByText(/Próximas Citas/i)).toBeInTheDocument();
    expect(screen.getByText(/Recomendaciones para Ti/i)).toBeInTheDocument();
});
