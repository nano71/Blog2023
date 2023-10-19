import "/src/stylesheet/previews.less"
import {useContext, useEffect} from "react";
import {CurrentIndexContext} from "../../pages/index.jsx";

/**
 *
 * @param {string[]} imageUrls
 * @returns {JSX.Element}
 * @constructor
 */
function Preview({imageUrls}) {
    const {currentIndex} = useContext(CurrentIndexContext)

    return (
        <div className="previews" id="previews">
            {imageUrls.map((value, index) =>
                <img className={currentIndex === index ? "preview active" : "preview"} src={value} key={index} alt=""/>)}
            <div className="container">
                <span>Welcome to my</span>
                <h1>Blog-site</h1>
            </div>
        </div>
    )
}

export default Preview
