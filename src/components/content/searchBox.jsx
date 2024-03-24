import "/src/stylesheets/search/search.less"
import {useContext, useEffect, useRef, useState} from "react";
import {Icon} from "@iconify/react";
import {useNavigate, useParams} from "react-router-dom";
import {routeTools} from "../../utils/tools.js";
import {TabContext} from "./content.jsx";

let previousSearchText = ""

export default function () {
    const [inputValue, setInputValue] = useState("")
    const navigate = useNavigate()
    const {setTabActive} = useContext(TabContext)
    const [focus, setFocus] = useState(false)
    const params = useParams()
    const input = useRef(null)

    useEffect(() => {
        setInputValue(previousSearchText = params.query || "")
    }, [params]);

    function search() {
        if (inputValue) {
            if (previousSearchText === inputValue)
                return
            setTabActive(-1)
            navigate(routeTools.searchArticle(inputValue))
            previousSearchText = inputValue
        } else {
            setTabActive(0)
            navigate(routeTools.root)
        }
        setTimeout(() => {
            input.current.blur()
        }, 0)

    }

    function onFocus(e) {
        setFocus(true)
    }

    function onBlur(e) {
        setFocus(false)
    }

    function onKeyDown(e) {
        if (e.code?.includes("Enter")) {
            search()
        }
    }

    return (
        <div className="searchBox">
            <label className={focus || inputValue ? " active" : ""} htmlFor="searchInput">
                <input ref={input}
                       value={inputValue}
                       onKeyDown={onKeyDown}
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={e => setInputValue(e.target.value)}
                       id="searchInput" type="text"/>
                <a onClick={search}><Icon icon="ri:search-2-line"/></a>
            </label>
        </div>
    )
}
