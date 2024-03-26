import React, {useContext, useRef} from "react";
import {PopupContext} from "./popup.jsx";
import {useNavigate} from "react-router-dom";
import {Icon} from "@iconify/react";

function AddCategory({target}) {
    const popup = useContext(PopupContext)
    const description = useRef(null)
    const name = useRef(null)

    function confirm() {

    }

    return (
        <div className={"addCategoryContainer container" + (popup.isHiding ? " hide" : "")}>
            <div className="top">
                <div className="subtitle">
                    Add more data
                </div>
                <a className="close" onClick={_ => popup.close()}><Icon icon="ri:close-fill"/></a>
            </div>
            <div className="inputArea">
                <h1>New category</h1>
                <div className="inputItem">
                    <div className="label">Name</div>
                    <input type="text" ref={name} placeholder="标签名称"/>
                </div>
                <div className="inputItem">
                    <div className="label">Description</div>
                    <textarea maxLength={255} ref={description} placeholder="标签介绍"/>
                </div>
                <div className="tip">
                    Open your two-factor authenticator (TOTP) app or browser extension to view your authentication code.
                </div>
                <div className="buttons">
                    <div className="confirm button" onClick={confirm}>confirm</div>
                </div>
            </div>
        </div>)
}

export default AddCategory
