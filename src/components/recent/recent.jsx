import ArticleList from "./articleList.jsx";
import {Outlet} from "react-router-dom";
import {Footer} from "/src/components/content/footer.jsx";
import Loading from "/src/components/content/loading.jsx";
import {useContext, useEffect} from "react";
import {ArticleListObjectContext} from "../../pages/index.jsx";

export default () => {
    const recentArticlesObject = useContext(ArticleListObjectContext)
    return <>{
        recentArticlesObject.isLoading ? <Loading/> :
            <div className="tab active">
                <ArticleList/>
                <div className="placeholder"></div>
            </div>}
        <Outlet/></>
}

