import {Cover4Write} from "../components/cover/cover.jsx";
import "/src/stylesheets/write/write.less"
import Content from "../components/content/content.jsx";
import {useEffect} from "react";
import PopupProvider from "../components/popup/popup.jsx";

function Write() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return <>
        <PopupProvider>
            <div className="write">
                <Cover4Write/>
                <Content useTabBar={false} useFooter={false}/>
            </div>
        </PopupProvider>
    </>
}

export default Write
