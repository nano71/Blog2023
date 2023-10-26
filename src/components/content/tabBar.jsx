import {useContext, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {TabContext} from "./content.jsx";
import Search from "./searchBox.jsx";
import {routeTools} from "../../utils/tools.js";
import "/src/stylesheets/content/tabBar.less"

let paginationRouteHistory = [""]

const TabBar = () => {
    const {active, setTabActive} = useContext(TabContext);
    const navigate = useNavigate()
    const params = useParams()
    const routeLinks = [routeTools.articles]
    const tabItems = ["Recent", "Category", "Guestbook"];
    useEffect(() => {
        tabActiveInitial()
    }, [])
    useEffect(() => {
        if (params.pageIndex && routeTools.isArticles())
            paginationRouteHistory[0] = location.hash
    }, [params]);

    function tabActiveInitial() {
        if (routeTools.isSearch()) {
            setTabActive(-1)
            return
        }
        for (let i in tabItems) {
            let path = (routeLinks[i] || tabItems[i]).toLowerCase().replace("/", "")
            if (location.hash.includes(path)) {
                setTabActive(i.toInt())
                break
            }
        }
    }

    function switchTabItem(i, item) {
        if (active === i)
            return
        setTabActive(i)
        if (params.query && i === 0) {
            paginationRouteHistory = []
            return navigate(routeTools.articles)
        }
        location.hash = (paginationRouteHistory[i] || "/" + (routeLinks[i] || item)).toLowerCase()
    }

    return (
        <div className="tabBar">
            {tabItems.map((item, i) => (
                <div
                    key={i}
                    className={active === i ? "tabItem active" : "tabItem"}
                    onClick={() => switchTabItem(i, item)}
                >
                    {item}
                </div>
            ))}
            <Search/>
        </div>
    );
};

export default TabBar
