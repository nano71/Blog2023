// 创建 Context
import {createContext, useState} from "react";
import "/src/stylesheets/content/content.less"
import {Outlet} from "react-router-dom";
import TabBar from "./tabBar.jsx";
import {Footer} from "./footer.jsx";

export const TabContext = createContext(null);

// 父组件
const Content = ({useTabBar = true, useFooter = true}) => {
    const [active, setTabActive] = useState(location.pathname === "/" ? 0 : -1);

    return (
        <div className="content" id="content">
            <TabContext.Provider value={{active, setTabActive}}>
                {useTabBar ? <TabBar/> : ""}
                <Outlet/>
                {useFooter && <Footer/>}
            </TabContext.Provider>
        </div>
    );
};


export default Content
