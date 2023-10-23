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
            <a href="https://github.com/nano71" title="GitHub"><Icon icon="ri:github-fill"/></a>
            <a href="https://codepen.io/Lightning-Development-Team" title="CodePen"><Icon icon="ri:codepen-fill"/></a>
            <a href="https://nano71.zcool.com.cn" title="ZCool"><Icon icon="ri:zcool-fill"/></a>
            <a href="mailto://master@nano71.com" title="E-Mail"><Icon icon="ri:at-fill"/></a>
            <a onClick={goWrite} title="Writing"><Icon icon="ri:pen-nib-fill"/></a>
        </footer>
    )
}
