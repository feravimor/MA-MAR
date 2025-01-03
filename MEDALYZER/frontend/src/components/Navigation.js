import React from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext"; // Updated import path

function Navigation() {
    const { t } = useLanguage();

    return (
        <nav className="navigation-bar">
            <ul>
                <li>
                    <NavLink to="/dashboard" activeClassName="active">
                        {t("dashboard")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/financial-reports" activeClassName="active">
                        {t("financialReports")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/inventory-management" activeClassName="active">
                        {t("inventoryManagement")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/treatment-management" activeClassName="active">
                        {t("treatmentManagement")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/predictive-analysis" activeClassName="active">
                        {t("predictiveAnalysis")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/settings" activeClassName="active">
                        {t("settings")}
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;