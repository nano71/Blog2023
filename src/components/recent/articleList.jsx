import "/src/stylesheets/article/articleList.less"
import React, {useContext, useEffect} from "react";
import {ArticleListObjectContext, CoverImageContext, previousRoute} from "/src/pages/index.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {PopupContext} from "../popup/popup.jsx";
import ArticleDetails from "./articleDetails.jsx";
import Window from "../popup/window.jsx";
import Pagination from "../content/pagination.jsx";
import {routeTools} from "../../utils/tools.js";

function ArticleList() {
    const recentArticlesObject = useContext(ArticleListObjectContext)
    const {setCoverImage} = useContext(CoverImageContext)
    const navigate = useNavigate()
    const popup = useContext(PopupContext)
    const params = useParams()

    useEffect(() => {
        console.log("ArticleList render");
        popup.loadComponent(<Window><ArticleDetails/></Window>)
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

    return (
        <div className="articleList" id="articleList">
            {recentArticlesObject.list.map((value, index) =>
                <a href={articleHref(value.id)} key={index} className="article" onClick={_ => {
                    _.preventDefault()
                    readArticle(value.id)
                }}
                   onMouseEnter={() => value.coverImage && setCoverImage(value.coverImage)}>
                    <span className="date">{new Date(value.createTime).toLocaleString()}</span>
                    <h2 className="title" itemProp="name">{value.title}</h2>
                    <p className="text" itemProp="description" dangerouslySetInnerHTML={{__html: value.description.replace(/<p>|<\/p>/g, "")}}/>
                    <div className="button more">view</div>
                    <img src={value.coverImage} style={{display: "none"}} alt="coverImage"/>
                </a>
            )}
            <div className="placeholder"/>
            <Pagination max={Math.ceil(recentArticlesObject.total / recentArticlesObject.limit)}/>
        </div>
    )
}

export default ArticleList
