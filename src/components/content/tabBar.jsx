import {useContext, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {TabContext} from "./content.jsx";
import Search from "./searchBox.jsx";

const TabBar = () => {
    const {active, setActive} = useContext(TabContext);
    const navigate = useNavigate()
    const location = useLocation()
    const routeLinks = ["article"]
    const tabItems = ["Recent", "Category", "Search", "About"];
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
