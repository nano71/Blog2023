import ArticleList from "./articleList.jsx";
import {Outlet} from "react-router-dom";
import Loading from "/src/components/content/loading.jsx";
import React, {useContext} from "react";
import {ArticleListObjectContext} from "../../pages/index.jsx";
import Result from "../content/result.jsx";

export default () => {
    const recentArticlesObject = useContext(ArticleListObjectContext)
    return <>{
        recentArticlesObject.isLoading ? <Loading/> :
            <div className="tab">
                {!recentArticlesObject.total ? <Result/> : <ArticleList/>}
            </div>}
        <Outlet/></>
}

