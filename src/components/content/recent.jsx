import ArticleList from "./articleList.jsx";
import {Outlet} from "react-router-dom";
import {Footer} from "./footer.jsx";
import Loading from "./loading.jsx";
import {useContext} from "react";
import {RecentArticlesContext} from "../../pages/index.jsx";

export default () => {
    const recentArticles = useContext(RecentArticlesContext)

    return <>{
        !recentArticles.length ? <Loading/> :
            <div className="tab active">
                <ArticleList/>
                <div className="placeholder"></div>
                <Footer/>
            </div>}
        <Outlet/></>
}

