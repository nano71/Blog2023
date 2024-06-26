import "/src/stylesheets/content/result.less"
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Icon} from "@iconify/react";

/**
 *
 * @param {ResponseData} result
 * @param {string} minHeight
 * @return {JSX.Element}
 * @constructor
 */
function Result({result, minHeight = "auto"}) {
    const params = useParams()
    const [view, setView] = useState(<></>)

    function notFound() {
        console.log("notFound");
        return <div className="notFound">
            <Message>{params.query ? `Sorry we couldn't find any matches for "${params.query}".` : "There's nothing here."}</Message>
        </div>
    }

    function forbidden() {
        console.log("forbidden");
        return customMessage("Your IP address is banned.")
    }

    function customMessage(message) {
        let string = message.endsWith(".") ? message : message + "."
        return <div>
            <Message>{string}</Message>
        </div>
    }

    function timeout() {
        console.log("timeout");

        function retry() {
            location.reload()
        }

        return <div className="timeout">
            <Message>The list request timed out, please <a onClick={retry}>try again</a>.</Message>
        </div>
    }

    function Message({children}) {
        return <div className="message">{children}</div>
    }

    useEffect(() => {
        console.log("result render");
        switch (result.code) {
            case 504:
                setView(timeout())
                break
            case 403:
                setView(forbidden())
                break
            case "ERR_NETWORK":
            case 0:
                setView(customMessage(result.message))
                break
            default:
                setView(notFound())
        }
    }, []);

    return (
        <div className="result" style={{minHeight}}>
            <Icon icon="emojione-v1:confused-face" style={{marginRight: "5px"}}/>
            {view}
        </div>)
}

export default Result
