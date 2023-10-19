import { useRouteError } from "react-router-dom";
import "/src/stylesheet/error.less"
export default function Error() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="errorPage">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}
