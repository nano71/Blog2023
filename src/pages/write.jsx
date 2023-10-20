import {Cover4Write} from "../components/cover/cover.jsx";
import "/src/stylesheet/write.less"
import Content from "../components/content/content.jsx";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";

function Write() {
    return <div className="write">
        <Cover4Write/>
        <Content useTabBar={false}/>
    </div>
}

export default Write
