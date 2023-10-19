// 创建 Context
import {createContext, useState} from "react";
import "/src/stylesheet/content.less"
import {Outlet} from "react-router-dom";
import TabBar from "./tagBar.jsx";

export const TabContext = createContext(null);

// 父组件
const Content = () => {
    const [active, setActive] = useState(0);
    return (
        <div className="content" id="content">
            <TabContext.Provider value={{active, setActive}}>
                <TabBar/>
                <Outlet/>
            </TabContext.Provider>
        </div>
    );
};


export default Content
