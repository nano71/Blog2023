import "/src/stylesheet/cover.less"
import {useContext} from "react";
import {CurrentIndexContext} from "../../pages/index.jsx";

/**
 *
 * @param {string[]} imageUrls
 * @returns {JSX.Element}
 * @constructor
 */
function Cover({imageUrls}) {
    const {currentIndex} = useContext(CurrentIndexContext)

    return (
        <div className="cover" id="cover">
            {imageUrls.map((value, index) => <img className={currentIndex === index ? "preview active" : "preview"} src={value} key={index} alt=""/>)}
            <ContainerTemplate subtitle="Welcome to my" title="Blog-site"/>
        </div>)
}


export default Cover

export function Cover4Write() {
    return <div className="cover" id="cover">
        <img className="preview active" src="https://images.pexels.com/photos/4554150/pexels-photo-4554150.jpeg?auto=compress&cs=tinysrgb&w=1200" alt=""/>
        <ContainerTemplate subtitle="Write whatever you want" title="Blog write"/>
    </div>
}

function ContainerTemplate({subtitle, title}) {
    return <div className="container">
        <span>{subtitle}</span>
        <h1>{title}</h1>
    </div>
}
