import "/src/stylesheets/manage/tagList.less"
import React, {useContext} from "react";
import {ManagementConsoleUpdateContext, TagListObjectContextForManage} from "../../pages/manage.jsx";
import Loading from "../content/loading.jsx";
import {Icon} from "@iconify/react";
import {usePopup} from "../popup/popup.jsx";
import EditCategory from "../popup/addCategoryPopup.jsx";
import * as http from "../../utils/http.js";
import {useTip} from "../popup/tip.jsx";

export default function TagListForManage() {
    const tagListObject = useContext(TagListObjectContextForManage)
    const managementConsole = useContext(ManagementConsoleUpdateContext)

    const popup = usePopup()
    const tip = useTip()

    function addCategory() {
        popup.loadTemporaryComponent(<EditCategory isAddMode={true}/>).show()
    }

    function editCategory(value) {
        sessionStorage.setItem("category", JSON.stringify(value))
        popup.loadTemporaryComponent(<EditCategory/>).show()
    }

    function deleteCategory(tagName) {
        popup.confirm("Your action will delete this category, Are you sure?",
            async () => {
                popup.close()
                let result = await http.deleteCategory(tagName)
                if (result) {
                    tip.show("删除成功")
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
                            <Icon icon="ri:delete-bin-3-line" className={"delete"} onClick={_ => deleteCategory(value.name)}/>
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
