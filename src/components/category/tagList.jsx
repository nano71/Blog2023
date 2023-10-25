import "/src/stylesheets/tagList.less"
import {useNavigate} from "react-router-dom";
import {routeTools} from "../../router/router.jsx";
import {useContext} from "react";
import {TabContext} from "../content/content.jsx";

function TagList({tagList}) {
    const navigate = useNavigate()
    const {setTabActive} = useContext(TabContext)

    function viewArticleListByTag(tag) {
        setTabActive(-1)
        navigate(routeTools.search + "/Tag:" + tag)
    }

    return (
        <div className="tagList">
            {tagList.map((value, index) =>
                <div className="card" key={index} onClick={_ => viewArticleListByTag(value.name)}>
                    <h2 className="title">{value.name}</h2>
                    <p className="descript">{value.content}</p>
                    <div className="info">
                        <div className="label">文章数量:</div>
                        <div className="count">{value["count"]}</div>
                    </div>
                </div>)}
        </div>)
}

export default TagList
