import {useContext} from "react";
import {Icon} from "@iconify/react";
import {PopupContext} from "./popup.jsx";

/**
 *
 * @param {Element} children
 * @returns {PopupComponent}
 */
function Window({children}) {
    const popup = useContext(PopupContext)

    const titles = {
        "article": "Article details",
        "write": "Preview article",
        "manage": "Article management"
    }

    return <div className={"windowContainer container" + (popup.isHiding ? " hide" : "")}>
        <div className="top">
            <div className="subtitle">
                {popup.title() || titles[Object.keys(titles).find(value => location.hash.includes(value))]}
            </div>
            <a className="close" onClick={_ => popup.close()}><Icon icon="ri:close-fill"/></a>
        </div>
        {children}
    </div>
}

export default Window
