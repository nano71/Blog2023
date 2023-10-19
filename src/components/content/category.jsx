import TagList from "./tagList.jsx";
import {Footer} from "./footer.jsx";
import {useContext} from "react";
import {TagListContext} from "../../pages/index.jsx";
import Loading from "./loading.jsx";


export default () => {
    const tagList = useContext(TagListContext)

    return (
        tagList.length ? <div className="tab active">
            <TagList tagList={tagList}/>
            <div className="placeholder"></div>
            <Footer/>
        </div> : <Loading/>
    )

}
