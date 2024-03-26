import "/src/stylesheets/article/articleList.less"
import React, {useContext, useEffect} from "react";
import {ArticleListObjectContext, CoverImageContext, previousRoute} from "/src/pages/index.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {PopupContext} from "../popup/popup.jsx";
import ArticleDetails from "./articleDetails.jsx";
import Window from "../popup/window.jsx";
import Pagination from "../content/pagination.jsx";
import {formatDatetime, routeTools} from "../../utils/tools.js";
import sanitizeHtml from "sanitize-html";

function ArticleList() {
    const recentArticlesObject = useContext(ArticleListObjectContext)
    const {setCoverImage} = useContext(CoverImageContext)
    const navigate = useNavigate()
    const popup = useContext(PopupContext)
    const params = useParams()

    useEffect(() => {
        console.log("ArticleList render");
        popup.loadComponent(<Window><ArticleDetails isPreviewMode={false}/></Window>)
        if (params.articleId) {
            popup.show({
                message: "firstShow",
                onClose() {
                    if (previousRoute === "initial")
                        navigate(location.pathname.replace(/\/\d+$/g, ""))
                    else
                        navigate(-1)
                }
            })
        }
    }, []);

    function readArticle(id) {
        if (routeTools.isRoot())
            navigate("/articles")
        popup.show({
            message: "readArticle",
            onClose() {
                navigate(-1)
            }
        })
        navigate(location.pathname.replace(/\/$/g, "") + "/" + id)
    }

    function articleHref(id) {
        return location.origin + "/articles/" + id
    }

    function clean(html) {
        return sanitizeHtml(html, {
            allowedTags: ['code'],
            allowedAttributes: false
        })
    }

    return (
        <div className="articleList" id="articleList">
            {recentArticlesObject.list.map((value, index) => {
                    let processedHTML = clean(value.description)
                    return (<a href={articleHref(value.id)} key={index} className="article" onClick={_ => {
                        _.preventDefault()
                        readArticle(value.id)
                    }}
                               onMouseEnter={() => value.coverImage && setCoverImage(value.coverImage)}>
                        <span className="date">{formatDatetime(value.createTime)}</span>
                        <h2 className="title" itemProp="name" title={value.title}>{value.title}</h2>
                        <p className="description" itemProp="description" title={processedHTML} dangerouslySetInnerHTML={{__html: processedHTML}}/>
                        <div className="button more" title={"查看文章"}>view</div>
                        <img src={value.coverImage} style={{display: "none"}} alt="coverImage"/>
                    </a>)
                }
            )}
            <div className="placeholder"/>
            <Pagination max={Math.ceil(recentArticlesObject.total / recentArticlesObject.limit)}/>
        </div>
    )
}

export default ArticleList
