import {Icon} from "@iconify/react";
import {useContext} from "react";
import {PopupContext} from "../popup/popup.jsx";
import Validate from "../popup/validate.jsx";
import "/src/stylesheets/content/footer.less"

export const Footer = () => {
    const popup = useContext(PopupContext)

    function goWrite() {
        console.log("goWrite");
        popup.loadTemporaryComponent(<Validate/>).show()
    }

    return (
        <footer className="footer">
            <a href="https://github.com/nano71" target="_blank" title="GitHub"><Icon icon="ri:github-fill"/></a>
            <a href="https://codepen.io/Lightning-Development-Team" target="_blank" title="CodePen"><Icon icon="ri:codepen-fill"/></a>
            <a href="https://nano71.zcool.com.cn" target="_blank" title="ZCool"><Icon icon="ri:zcool-fill"/></a>
            <a href="mailto://master@nano71.com" target="_blank" title="E-Mail"><Icon icon="ri:at-fill"/></a>
            <a onClick={goWrite} title="Writing"><Icon icon="ri:pen-nib-fill"/></a>
            <a href="https://nano71.com/resume" target="_blank" title="Resume"><Icon icon="academicons:cv"/></a>
        </footer>
    )
}
