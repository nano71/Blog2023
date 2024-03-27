import React, {useContext} from "react";
import {PopupContext} from "./popup.jsx";
import {Icon} from "@iconify/react";
import {TipContext, useTip} from "./tip.jsx";

function Message() {
    const tip = useTip()
    return (
        <div className={"messageContainer container" + (tip.isHiding ? " hide" : "")}>
            <div className="title">
                <Icon icon="ri:information-fill"/>{tip.title()}
            </div>
            <a className="close" onClick={_ => tip.close("icon")}><Icon icon="ri:close-fill"/></a>
        </div>)
}

export default Message
