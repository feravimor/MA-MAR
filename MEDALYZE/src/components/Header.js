import React, { useContext } from "react";
import { LanguageContext } from "../MultiLanguageProvider";
// ...existing code...

const Header = () => {
    const { translate } = useContext(LanguageContext);
    return (
        <header>
            <h1>{translate("header.title")}</h1>
            {/* ...existing code... */}
        </header>
    );
};

export default Header;
