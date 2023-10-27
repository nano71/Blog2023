import "/src/stylesheets/article/articleList.less"
import React, {useContext, useEffect} from "react";
import {ArticleListObjectContext, CoverImageIndexContext, previousRoute} from "/src/pages/index.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {PopupContext} from "../popup/popup.jsx";
import ArticleDetails from "./articleDetails.jsx";
import Window from "../popup/window.jsx";
import Pagination from "../content/pagination.jsx";

function ArticleList() {
    const recentArticlesObject = useContext(ArticleListObjectContext)
    const {setCoverImage} = useContext(CoverImageIndexContext)
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
        popup.show({
            message: "readArticle",
            onClose() {
                navigate(-1)
            }
        })

        navigate(location.pathname.replace(/\/$/g, "") + "/" + id)
    }

    return (
        <div className="articleList" id="articleList">
            {recentArticlesObject.list.map((value, index) =>
                <div key={index} className="article" onClick={_ => readArticle(value.id)} onMouseEnter={() => value.coverImage && setCoverImage(value.coverImage)}>
                    <span className="date">{new Date(value.createTime).toLocaleString()}</span>
                    <h2 className="title" itemProp="name">{value.title}</h2>
                    <p className="text" itemProp="description" dangerouslySetInnerHTML={{__html: value.description.replace(/<p>|<\/p>/g, "")}}/>
                    <div className="button more">view</div>
                    <img src={value.coverImage} style={{display: "none"}} alt=""/>
                </div>
            )}
            <div className="placeholder"/>
            <Pagination max={Math.ceil(recentArticlesObject.total / recentArticlesObject.limit)}/>
        </div>
    )
}

export default ArticleList
