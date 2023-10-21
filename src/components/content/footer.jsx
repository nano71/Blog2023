import {Icon} from "@iconify/react";

export const Footer = () => {
    return (
        <footer className="footer">
            <a href="https://github.com/nano71" title="GitHub"><Icon icon="ri:github-fill"/></a>
            <a href="https://codepen.io/Lightning-Development-Team" title="CodePen"><Icon icon="ri:codepen-fill"/></a>
            <a href="https://nano71.zcool.com.cn" title="ZCool"><Icon icon="ri:zcool-fill"/></a>
            <a href="mailto://master@nano71.com" title="E-Mail"><Icon icon="ri:at-fill"/></a>
            <a href="#/write" title="Writing"><Icon icon="ri:pen-nib-fill"/></a>
        </footer>
    )
}
