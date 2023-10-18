// 创建 Context
import {createContext, useContext, useState} from "react";
import "/src/stylesheet/content.less"
import ArticleList from "./articleList.jsx";

const TabContext = createContext(null);

// 父组件
const Content = () => {
    const [active, setActive] = useState(0);
    return (
        <div className="content" id="content">
            <TabContext.Provider value={{active, setActive}}>
                <TabBar/>
                <div className={active === 0 ? "tab active" : " tab"}>
                    <ArticleList/>
                    <div className="placeholder"></div>
                    <Footer/>
                </div>
                <div className={active === 1 ? "tab active" : " tab"}>2...</div>
            </TabContext.Provider>
        </div>
    );
};

const Footer = () => {
    return (
        <footer className="footer">
            <a className="fa fa-lg fa-envelope-o" href="mailto:tylerpelzer@gmail.com" target="_blank"></a>
            <a className="fa fa-lg fa-github" href="https://github.com/tyl-er" target="_blank"></a>
            <a className="fa fa-lg fa-codepen" href="https://codepen.io/tyl-er/" target="_blank"></a>
            <a className="fa fa-lg fa-linkedin" href="https://www.linkedin.com/in/tyler-pelzer-1b4751115" target="_blank"></a>
            <a className="fa fa-lg fa-twitter" href="https://twitter.com/tpelzy" target="_blank"></a>
        </footer>
    )
}
const TabBar = () => {
    const {active, setActive} = useContext(TabContext);

    const tabItems = ["Recent", "Label", "Search", "All", "About"];
    return (
        <div className="tabBar">
            {tabItems.map((item, i) => (
                <div
                    key={i}
                    className={active === i ? "tabItem active" : "tabItem"}
                    onClick={() => setActive(i)}
                >
                    {item}
                </div>
            ))}
        </div>
    );
};


export default Content
