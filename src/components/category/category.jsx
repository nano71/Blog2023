import TagList from "./tagList.jsx";
import React, {useContext} from "react";
import {TagListObjectContext} from "../../pages/index.jsx";
import Loading from "/src/components/content/loading.jsx";
import Result from "../content/result.jsx";


export default () => {
    const tagListObject = useContext(TagListObjectContext)

    function List() {
        if (tagListObject.total)
            return <div className="tab"><TagList tagList={tagListObject.list}/></div>
        return <Result result={tagListObject.result}/>
    }

    return (
        tagListObject.isLoading ? <Loading/> : <List/>
    )

}
