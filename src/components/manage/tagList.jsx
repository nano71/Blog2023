import "/src/stylesheets/manage/tagList.less"
import React, {useContext} from "react";
import {TagListObjectContextForManage} from "../../pages/manage.jsx";
import Loading from "../content/loading.jsx";
import {Icon} from "@iconify/react";
import {usePopup} from "../popup/popup.jsx";
import EditCategory from "../popup/addCategoryPopup.jsx";
import * as http from "../../utils/http.js";
import {useTip} from "../popup/tip.jsx";
import EventBus from "../../utils/bus.js";

export default function TagListForManage() {
    const tagListObject = useContext(TagListObjectContextForManage)
    const popup = usePopup()
    const tip = useTip()

    function addCategory() {
        popup.loadTemporaryComponent(<EditCategory isAddMode={true}/>).show()
    }

    function editCategory(value) {
        sessionStorage.setItem("category", JSON.stringify(value))
        popup.loadTemporaryComponent(<EditCategory/>).show()
    }

    function deleteCategory(target) {
        popup.confirm({
                name: target.name,
                content: target.content
            }, `Your action will delete this category, Are you sure?`,
            async () => {
                popup.close().then()
                let result = await http.deleteCategory(target.name)
                if (result) {
                    tip.show("删除成功")
                    EventBus.emit("update", "tagList")
                } else {
                    tip.show("删除失败")
                }
            })
    }

    return <div className="tagList">
        <div className="head">
            <div className="label id">No</div>
            <div className="label name">Name</div>
            <div className="label content">Content</div>
            <div className="placeholder"></div>
            <div className="label operation">Operation</div>
        </div>
        {tagListObject.isLoading
            ? <Loading/>
            : <div className="list">
                {tagListObject.list.map((value, index) =>
                    <div className="item" key={index}>
                        <div className="id">#{index}</div>
                        <div className="name">{value.name}</div>
                        <div className="content">{value.content}</div>
                        <div className="operation">
                            <Icon icon="ri:eye-off-line"/>
                            <Icon icon="ri:edit-line" className={"edit"} onClick={_ => editCategory(value)}/>
                            <Icon icon="ri:delete-bin-3-line" className={"delete"} onClick={_ => deleteCategory(value)}/>
                        </div>
                    </div>
                )}
                <div className="placeholder"></div>

            </div>
        }
        <div className="bottomBar">
            <div className="total">Total: {tagListObject.total}</div>
            <div className="add" onClick={addCategory}><Icon icon="ri:apps-2-add-line"/>Add</div>
        </div>
    </div>
}
