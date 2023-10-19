import "/src/stylesheet/tagList.less"
import {useContext} from "react";
import {TagListContext} from "/src/pages/index.jsx";

function TagList({tagList}) {
    return (
        <div className="tagList">
            {tagList.map((value, index) => <div className="card" key={index}>
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
