// 创建 Context
import {createContext, useState} from "react";
import "/src/stylesheet/content.less"
import {Outlet, useLocation} from "react-router-dom";
import TabBar from "./tabBar.jsx";

export const TabContext = createContext(null);

// 父组件
const Content = ({useTabBar = true}) => {
    const [active, setActive] = useState(0);
    return (
        <div className="content" id="content">
            <TabContext.Provider value={{active, setActive}}>
                {useTabBar ? <TabBar/> : ""}
                <Outlet/>
            </TabContext.Provider>
        </div>
    );
};


export default Content
