import "/src/stylesheets/search/search.less"
import {useContext, useState} from "react";
import {Icon} from "@iconify/react";
import {useNavigate} from "react-router-dom";
import {routeTools} from "../../router/router.jsx";
import {TabContext} from "./content.jsx";

export default function () {
    // todo 文章搜索功能
    const [inputValue, setInputValue] = useState("")
    const navigate = useNavigate()
    const {setTabActive} = useContext(TabContext)

    function search() {
        setTabActive(-1)
        navigate(routeTools.searchArticle(inputValue))
    }

    function onInput(e) {
        setInputValue(e.target.value)
    }

    return (
        <div className="searchBox">
            <label className={inputValue ? " active" : ""} htmlFor="searchInput">
                <input value={inputValue} onInput={onInput} id="searchInput" type="text"/>
                <a onClick={search}><Icon icon="ri:search-2-line"/></a>
            </label>
        </div>
    )
}
