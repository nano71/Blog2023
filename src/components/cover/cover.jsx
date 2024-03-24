import "/src/stylesheets/cover/cover.less"
import {useContext, useEffect, useState} from "react";
import {CoverImageContext} from "../../pages/index.jsx";


/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Cover() {
    const {coverImage} = useContext(CoverImageContext)
    const [image, setImage] = useState(<></>)

    useEffect(() => {
        if (coverImage) {
            setImage(<></>)
            setTimeout(() => {
                setImage(<img className="preview" src={coverImage} alt=""/>)
            }, 0)
        }
    }, [coverImage]);


    return (
        <div className="cover" id="cover">
            {image}
            <ContainerTemplate subtitle="Welcome to my" title="Blog-site"/>
        </div>)
}


export default Cover

export function Cover4Write() {
    return <div className="cover" id="cover">
        <img className="preview active" src="https://nano71.com:9000/uploads/pexels-james-wheeler-4554150.jpg" alt="websiteCoverImage"/>
        <ContainerTemplate subtitle="Write whatever you want" title="Blog write"/>
    </div>
}

function ContainerTemplate({subtitle, title}) {
    return <div className="container">
        <span>{subtitle}</span>
        <span>{title}</span>
    </div>
}
