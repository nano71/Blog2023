import React, {useContext, useRef} from "react";
import {PopupContext} from "./popup.jsx";
import {Icon} from "@iconify/react";
import {useNavigate} from "react-router-dom";

/**
 * @return {PopupComponent}
 */
function Validate({target}) {
    const popup = useContext(PopupContext)
    const authenticationCode = useRef(null)
    const navigate = useNavigate()

    function confirm() {
        sessionStorage.setItem("authenticationCode", authenticationCode.current.value)
        navigate("/" + target)
    }

    return (
        <div className={"validateContainer container" + (popup.isHiding ? " hide" : "")}>
            <div className="top">
                <div className="subtitle">
                    Two-factor authentication
                </div>
                <a className="close" onClick={_ => popup.close()}><Icon icon="ri:close-fill"/></a>
            </div>
            <div className="inputArea">
                <h1>Authentication</h1>
                <input type="text" ref={authenticationCode} placeholder="XXXXXX" className="dateTime"/>
                <div className="tip">
                    Open your two-factor authenticator (TOTP) app or browser extension to view your authentication code.
                </div>
                <div className="buttons">
                    <div className="confirm button" onClick={confirm}>confirm</div>
                </div>
            </div>
        </div>)
}

export default Validate
