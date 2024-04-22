import React, {useContext, useEffect, useRef} from "react";
import {usePopup} from "./popup.jsx";
import {Icon} from "@iconify/react";
import {addCategory, updateCategory} from "../../utils/http.js";
import {useTip} from "./tip.jsx";

import EventBus from "../../utils/bus.js";

export default function EditCategory({isAddMode = false}) {
    const popup = usePopup()
    const tip = useTip()
    const content = useRef(null)
    const name = useRef(null)

    useEffect(() => {
        if (!isAddMode) {
            let category = JSON.parse(sessionStorage.getItem("category"))
            console.log(category);
            content.current.value = category.content
            name.current.value = category.name
            sessionStorage.removeItem("category")
        }
    }, [])

    async function submit() {
        let data = {
            content: content.current.value,
            name: name.current.value
        }
        if (!data.name || !data.content) {
            tip.show("内容不完整!")
            return
        }
        let result
        if (isAddMode)
            result = await addCategory(data)
        else
            result = await updateCategory(data)
        if (result) {
            await popup.close()
            tip.show(isAddMode ? "标签已添加" : "标签已更新")
            EventBus.emit("update", "tagList")
        } else {
            tip.show(isAddMode ? "标签添加失败" : "标签更新失败")
        }
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


