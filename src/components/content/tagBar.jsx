import {useContext, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import {TabContext} from "./content.jsx";

const TabBar = () => {
    const {active, setActive} = useContext(TabContext);
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
    return (
        <div className="tabBar">
            {tabItems.map((item, i) => (
                <Link to={"/" + (routeLinks[i] || item.toLowerCase())} key={i}>
                    <div
                        className={active === i ? "tabItem active" : "tabItem"}
                        onClick={() => setActive(i)}
                    >
                        {item}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default TabBar
