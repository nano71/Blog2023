import {useRouteError} from "react-router-dom";
import "/src/stylesheets/error.less"
import {Icon} from "@iconify/react";

export default function ErrorView() {
    const error = useRouteError();
    console.error(error);
    window.previousLocation = "/error"

    return (
        <div className="errorPage">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <Icon icon="emojione-v1:unamused-face" style={{marginRight: "5px"}}/><i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}
