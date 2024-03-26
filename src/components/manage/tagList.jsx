import "/src/stylesheets/manage/tagList.less"
import React, {useContext} from "react";
import {TagListObjectContextForManage} from "../../pages/manage.jsx";
import Loading from "../content/loading.jsx";
import {Icon} from "@iconify/react";
import {PopupContext} from "../popup/popup.jsx";
import AddCategoryPopup from "../popup/addCategoryPopup.jsx";

export default function TagListForManage() {
    const tagListObject = useContext(TagListObjectContextForManage)
    const popup = useContext(PopupContext)

    function addCategory() {
        popup.loadTemporaryComponent(<AddCategoryPopup/>).show()
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
                            <Icon icon="ri:edit-line" className={"edit"}/>
                            <Icon icon="ri:delete-bin-3-line" className={"delete"}/>
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
