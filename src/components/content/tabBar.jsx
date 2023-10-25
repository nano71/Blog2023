import {useContext, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {TabContext} from "./content.jsx";
import Search from "./searchBox.jsx";
import {routeTools} from "../../router/router.jsx";
import "/src/stylesheets/content/tabBar.less"

const TabBar = () => {
    const {active, setTabActive} = useContext(TabContext);
    const navigate = useNavigate()
    const location = useLocation()
    const routeLinks = [routeTools.articles]

    const tabItems = ["Recent", "Category", "Guestbook"];
    useEffect(() => {
        automaticRouteSelection()
    }, [])

    function automaticRouteSelection() {
        console.log("automaticRouteSelection");
        if (routeTools.isSearch()) {
            setTabActive(-1)
            return
        }
        for (let i in tabItems) {
            let path = (routeLinks[i] || tabItems[i]).toLowerCase()
            if (location.pathname.includes(path)) {
                setTabActive(i.toInt())
                break
            }
        }
    }

    function switchTabItem(i, item) {
        if (active === i)
            return
        setTabActive(i)
        navigate("/" + (routeLinks[i] || item.toLowerCase()))
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
