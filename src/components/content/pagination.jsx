import "/src/stylesheets/content/pagination.less"
import {Icon} from "@iconify/react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";

export default function Pagination({max}) {
    const navigate = useNavigate()
    const params = useParams()
    const [pageIndex, setPageIndex] = useState(1)
    let [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setPageIndex(searchParams.get("page")?.toInt() || 1)
    }, [params]);

    function previous() {
        if (pageIndex <= 1)
            return
        goto(false)
    }

    function goto(isNext = true) {
        setSearchParams({page: (pageIndex + (isNext ? 1 : -1)).toString()})
    }

    function next() {
        if (pageIndex >= max)
            return
        goto()
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
