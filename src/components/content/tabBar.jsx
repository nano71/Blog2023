import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {TabContext} from "./content.jsx";
import Search from "./searchBox.jsx";
import {routeTools} from "../../router/router.jsx";
import "/src/stylesheets/content/tabBar.less"

const TabBar = () => {
    const {active, setActive} = useContext(TabContext);
    const navigate = useNavigate()
    const routeLinks = [routeTools.articles]

    const tabItems = ["Recent", "Category", "Guestbook"];
    useEffect(() => {
        console.log("useEffect");
        for (let i in tabItems) {
            let path = (routeLinks[i] || tabItems[i]).toLowerCase()
            if (location.pathname.includes(path)) {
                setActive(parseInt(i))
                break
            }
        }
    }, [])

    function switchTabItem(i, item) {
        setActive(i)
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
