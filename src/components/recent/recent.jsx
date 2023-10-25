import ArticleList from "./articleList.jsx";
import Loading from "/src/components/content/loading.jsx";
import React, {useContext, useEffect} from "react";
import {ArticleListObjectContext, ArticleListRequestStateContext} from "../../pages/index.jsx";
import Result from "../content/result.jsx";

export default () => {
    const recentArticlesObject = useContext(ArticleListObjectContext)

    function List() {
        if (recentArticlesObject.total)
            return <div className="tab"><ArticleList/></div>
        return <Result/>
    }

    return (
        recentArticlesObject.isLoading ? <Loading/> : <List/>
    )

}

