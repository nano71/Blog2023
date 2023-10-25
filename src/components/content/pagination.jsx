import "/src/stylesheets/content/pagination.less"
import {Icon} from "@iconify/react";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {routeTools} from "../../router/router.jsx";

export default function Pagination({max}) {
    const navigate = useNavigate()
    const params = useParams()
    const [pageIndex, setPageIndex] = useState(1)
    useEffect(() => {
        params.pageIndex && setPageIndex(params.pageIndex)
    }, [params]);

    function previous() {
        if (pageIndex <= 1)
            return
        navigate(pathConcatenation(pageIndex - 1))
    }

    function pathConcatenation(pageIndex) {
        let path = "p/" + (pageIndex)
        if (routeTools.isSearch()) {
            path = routeTools.search + "/" + params.query + "/" + path
        } else if (routeTools.isDefault()) {
            path = routeTools.front() + "/" + path
        }
        return path
    }

    function next() {
        if (pageIndex >= max)
            return
        navigate(pathConcatenation(pageIndex + 1))
    }

    return <div className="pagination">
        <a className={"previous " + (pageIndex <= 1 && "disabled")} onClick={previous}><Icon icon="ri:arrow-left-s-line"/>Newer</a>
        <div className="indicator">
            <div className="currentIndex">{pageIndex}</div>
            /
            <div className="max">{max || 1}</div>
        </div>
        <a className={"next " + (pageIndex >= max && "disabled")} onClick={next}>Older<Icon icon="ri:arrow-right-s-line"/></a>
    </div>
}
