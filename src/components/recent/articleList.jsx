import "/src/stylesheets/article/articleList.less"
import React, {useContext, useEffect} from "react";
import {ArticleListObjectContext, CoverImageIndexContext} from "/src/pages/index.jsx";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {PopupContext} from "../popup/popup.jsx";
import ArticleDetails from "./articleDetails.jsx";
import Window from "../popup/window.jsx";
import Pagination from "../content/pagination.jsx";
import {routeTools} from "../../router/router.jsx";

function ArticleList() {
    const recentArticlesObject = useContext(ArticleListObjectContext)
    const {setCoverImage} = useContext(CoverImageIndexContext)
    const navigate = useNavigate()
    const popup = useContext(PopupContext)
    const params = useParams()

    useEffect(() => {
        console.log("ArticleList Mounted");
        console.log(recentArticlesObject);
        popup.loadComponent(<Window><ArticleDetails/></Window>)
        if (params.articleId) {
            popup.show()
        }
    }, []);

    function readArticle(id) {
        popup.show()
        navigate(routeTools.articleDetails(id))
    }

    return (<div className="articleList" id="articleList">
        {recentArticlesObject.list.map((value, index) =>
            <div key={index} className="article" onClick={_ => readArticle(value.id)} onMouseEnter={() => value.coverImage && setCoverImage(value.coverImage)}>
                <span className="date">{new Date(value.createTime).toLocaleString()}</span>
                <h2 className="title" itemProp="name">{value.title}</h2>
                <p className="text" itemProp="description">{value.description.replace(/<[^>]*>/g, '')}</p>
                <div className="button more">view</div>
                <img src={value.coverImage} style={{display: "none"}} alt=""/>
            </div>
        )}
        <Pagination max={Math.ceil(recentArticlesObject.total / recentArticlesObject.limit)}/>
    </div>)
}

export default ArticleList
