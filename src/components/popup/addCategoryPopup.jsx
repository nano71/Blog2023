import React, {useContext, useRef} from "react";
import {PopupContext} from "./popup.jsx";
import {Icon} from "@iconify/react";

function AddCategory({target}) {
    const popup = useContext(PopupContext)
    const content = useRef(null)
    const name = useRef(null)
    const errorMessage = ""

    function submit() {
        let data = {
            content: content.current.value,
            name: name.current.value
        }
        popup.tip("内容不完整")
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
                    <textarea maxLength={255} ref={content} placeholder="标签介绍"/>
                </div>
                <div className="tip">
                    A short description, recommended 150 characters or less.
                </div>
                <div className="warring">

                </div>
                <div className="buttons">
                    <div className="confirm button" onClick={submit}>Submit</div>
                </div>
            </div>
        </div>)
}

export default AddCategory
