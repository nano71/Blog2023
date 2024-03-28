import "/src/stylesheets/manage/artileList.less"
import {Icon} from "@iconify/react";
import React, {useContext} from "react";
import {ArticleListObjectContextForManage} from "../../pages/manage.jsx";
import Loading from "../content/loading.jsx";
import {usePopup} from "../popup/popup.jsx";
import Editor from "../write/editor.jsx";
import Window from "../popup/window.jsx";
import * as http from "../../utils/http.js";
import {getArticleContent} from "../../utils/http.js";
import Modal from "../popup/modal.jsx";
import {formatDatetime, SEOTools, sleep} from "../../utils/tools.js";
import ArticleDetails from "../recent/articleDetails.jsx";
import {useNavigate} from "react-router-dom";
import EventBus from "../../utils/bus.js";
import {useTip} from "../popup/tip.jsx";

export default function ArticleListForManage() {
    const articleListObject = useContext(ArticleListObjectContextForManage)
    const popup = usePopup()
    const tip = useTip()
    const navigate = useNavigate()

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

    function writeArticle() {
        popup.confirm(null, "About to leave the current page and jump to the writing page, Are you sure?",
            () => {
                popup.close()
                navigate("/write")
            })
    }

    function deleteArticle(target) {
        console.log(target);
        target.datetime = formatDatetime(target.createTime)
        delete target.createTime
        popup.confirm(target, "Your action will delete this article, Are you sure?",
            async () => {
                popup.close()
                let result = await http.deleteArticle(target.id)
                if (result) {
                    tip.show("删除成功")
                    EventBus.emit("update", "articleList")
                } else {
                    tip.show("删除失败")
                }
            })
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
                            <Icon icon="ri:delete-bin-3-line" onClick={_ => deleteArticle(value)} className={"delete"}/>
                        </div>
                    </div>
                )}
                <div className="placeholder"></div>
            </div>
        }
        <div className="bottomBar">
            <div className="total">Total: {articleListObject.total}</div>
            <div className="add" onClick={writeArticle}><Icon icon="ri:sticky-note-add-line"/>Write</div>
        </div>
    </div>
}
