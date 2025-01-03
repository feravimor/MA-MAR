import React, { useContext } from "react";
import { LanguageContext } from "../MultiLanguageProvider";
// ...existing code...

const AppointmentForm = () => {
    const { translate } = useContext(LanguageContext);
    return (
        <form>
            <label>{translate("appointmentForm.nameLabel")}</label>
            <input type="text" name="name" />
            {/* ...existing code... */}
        </form>
    );
};

export default AppointmentForm;
