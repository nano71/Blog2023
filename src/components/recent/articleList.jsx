import "/src/stylesheet/articleList.less"
import React, {useContext, useEffect} from "react";
import {CurrentIndexContext, RecentArticlesContext} from "/src/pages/index.jsx";
import {useNavigate} from "react-router-dom";
import {PopupContext} from "../popup/popup.jsx";
import ArticleDetails from "./articleDetails.jsx";
import Window from "../popup/window.jsx";
import Message from "../popup/message.jsx";

function ArticleList() {
    // todo 文章列表需要加载更多功能
    /**
     * @type {Article[]}
     */
    const recentArticles = useContext(RecentArticlesContext)
    const {setCurrentIndex} = useContext(CurrentIndexContext)
    const navigate = useNavigate()
    const popup = useContext(PopupContext)

    useEffect(() => {
        console.log("ArticleList Mounted");
        popup.loadComponent(<Window><ArticleDetails/></Window>)
        popup.loadTemporaryComponent(<Message/>)
            .title("缺少标题")
            .show({showMask: false, lockScroll: false, autoClose: true})

        if (location.pathname.includes("/article/")) {
            popup.show()
        }
    }, []);

    function readArticle(id) {
        popup.show()
        navigate("/article/" + id)
    }

    return (<div className="articleList" id="articleList">
        {recentArticles.map((value, index) =>
            <div key={index} className="article" onClick={_ => readArticle(value.id)} onMouseEnter={() => value.coverImage && setCurrentIndex(index)}>
                <span className="date">{new Date(value.createTime).toLocaleString()}</span>
                <h2 className="title" itemProp="name">{value.title}</h2>
                <p className="text" itemProp="description">{value.description.replace(/<[^>]*>/g, '')}</p>
                <div className="button more">view</div>
            </div>
        )}
    </div>)
}

export default ArticleList
