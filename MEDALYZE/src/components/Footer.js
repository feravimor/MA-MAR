import React, { useContext } from "react";
import { LanguageContext } from "../MultiLanguageProvider";

const Footer = () => {
    const { translate } = useContext(LanguageContext);
    return (
        <footer>
            <p>{translate("footer.text")}</p>
            {/* ...existing code... */}
        </footer>
    );
};

export default Footer;
