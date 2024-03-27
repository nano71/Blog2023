import TipProvider from "../components/popup/tip.jsx";
import PopupProvider from "../components/popup/popup.jsx";

export default function Provider({children}) {
    return <TipProvider><PopupProvider>{children}</PopupProvider></TipProvider>
}
