import React, {useContext} from "react";
import {PopupContext} from "./popup.jsx";
import {Icon} from "@iconify/react";

function Message() {
    const popup = useContext(PopupContext)
    return (
        <div className={"messageContainer container" + (popup.isHiding ? " hide" : "")}>
            <div className="subtitle">
                <Icon icon="ri:information-fill"/>{popup.title()}
            </div>
            <a className="close" onClick={_ => popup.close("icon")}><Icon icon="ri:close-fill"/></a>
        </div>)
}

export default Message
