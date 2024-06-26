import React, {useContext} from "react";
import {PopupContext, usePopup} from "./popup.jsx";
import {Icon} from "@iconify/react";

function Modal() {
    const popup = usePopup()
    return (
        <div className={"modalContainer container" + (popup.isHiding ? " hide" : "")}>
            <div className="message">
                <Icon icon="ri:information-fill"/>{popup.title()}
            </div>
            {/*<a className="close" onClick={_ => popup.close("icon")}><Icon icon="ri:close-fill"/></a>*/}
        </div>)
}

export default Modal
