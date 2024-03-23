import ArticleList from "./articleList.jsx";
import Loading from "/src/components/content/loading.jsx";
import React, {useContext, useEffect} from "react";
import {ArticleListObjectContext} from "../../pages/index.jsx";
import Result from "../content/result.jsx";

export default () => {
    const articleListObject = useContext(ArticleListObjectContext)

    function List() {
        if (articleListObject.total)
            return <div className="tab"><ArticleList/></div>
        return <Result result={articleListObject.result}/>
    }

    return (
        articleListObject.isLoading ? <Loading/> : <List/>
    )

}

