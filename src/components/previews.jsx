import "/src/stylesheet/previews.less"
import {useContext} from "react";
import {CurrentIndexContext} from "../pages/index.jsx";

/**
 *
 * @param {string[]} imageUrls
 * @returns {JSX.Element}
 * @constructor
 */
function Previews({imageUrls}) {
    const {currentIndex} = useContext(CurrentIndexContext)

    function Images() {
        const images = []
        imageUrls.forEach((imageUrl, index) => {
            images.push(<img className={currentIndex === index ? "preview active" : "preview"} src={imageUrl} key={index} alt=""/>)
        });
        return images
    }

    return (
        <div className="previews" id="previews">
            <Images/>
            <div className="container">
                <span>Welcome to my</span>
                <h1>Blog-site</h1>
            </div>
        </div>
    )
}

export default Previews
