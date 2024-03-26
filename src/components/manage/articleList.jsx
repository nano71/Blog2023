import "/src/stylesheets/manage/artileList.less"
import {Icon} from "@iconify/react";
import React, {useContext} from "react";
import {ArticleListObjectContextForManage} from "../../pages/manage.jsx";
import Loading from "../content/loading.jsx";
import {PopupContext} from "../popup/popup.jsx";
import Editor from "../write/editor.jsx";
import Window from "../popup/window.jsx";
import {getArticleContent} from "../../utils/http.js";
import Modal from "../popup/modal.jsx";
import {formatDatetime, SEOTools, sleep} from "../../utils/tools.js";
import ArticleDetails from "../recent/articleDetails.jsx";

export default function ArticleListForManage() {
    const articleListObject = useContext(ArticleListObjectContextForManage)
    const popup = useContext(PopupContext)

    async function editArticle(id) {
        popup.loadTemporaryComponent(<Modal/>).title("数据获取中, 请稍等...").show({lockMask: true})
        let result = await getArticleContent(id)
        await sleep(1000)
        if (result) {
            let {title, createTime: time, content: html, markdown, tags, coverImage} = result
            sessionStorage.setItem("draft", JSON.stringify({
                id,
                title,
                time: formatDatetime(time),
                html,
                markdown,
                coverImage,
                tags: tags.split(",")
            }))
            popup.loadTemporaryComponent(<Window><Editor isEditMode={true}/></Window>).title("Edit article").show()
        } else {
            // todo 数据获取失败处理
        }

    }

    function viewArticleContent(id) {
        SEOTools.articleDetailsLoader(id, false)
        popup.loadTemporaryComponent(<Window><ArticleDetails/></Window>).title("Preview article").show()
    }

    return <div className="articleList">
        <div className="head">
            <div className="label id">Id</div>
            <div className="label title">Title</div>
            <div className="label datetime">Datetime</div>
            <div className="label operation">Operation</div>
        </div>
        {articleListObject.isLoading
            ? <Loading/>
            : <div className="list">
                {articleListObject.list.map((value, index) =>
                    <div className="item" key={index}>
                        <div className="id">#{value.id}</div>
                        <div className="title" onClick={_ => viewArticleContent(value.id)}>{value.title}</div>
                        <div className="placeholder"></div>
                        <div className="datetime">{formatDatetime(value.createTime)}</div>
                        <div className="operation">
                            <Icon icon="ri:eye-off-line"/>
                            <Icon icon="ri:edit-line" onClick={_ => editArticle(value.id)} className={"edit"}/>
                            <Icon icon="ri:delete-bin-3-line" className={"delete"}/>
                        </div>
                    </div>
                )}
                <div className="placeholder"></div>
            </div>
        }
        <div className="bottomBar">
            <div className="total">Total: {articleListObject.total}</div>
            <div className="add"><Icon icon="ri:sticky-note-add-line"/>Write</div>
        </div>
    </div>
}
