import React, {useContext, useRef} from "react";
import {PopupContext, usePopup} from "./popup.jsx";
import {Icon} from "@iconify/react";

/**
 * @return {PopupComponent}
 */
function Confirm({tip,confirmFn}) {
    const popup = usePopup()

    return (
        <div className={"confirmContainer container" + (popup.isHiding ? " hide" : "")}>
            <div className="top">
                <div className="subtitle">
                    Please confirm
                </div>
                <a className="close" onClick={_ => popup.close()}><Icon icon="ri:close-fill"/></a>
            </div>
            <div className="body">
                <div className="tip">
                    {tip}
                </div>
                <div className="buttons">
                    <div className="cancel" onClick={_ => popup.close()}>cancel</div>
                    <div className="confirm" onClick={confirmFn}>confirm</div>
                </div>
            </div>
        </div>)
}

export default Confirm
