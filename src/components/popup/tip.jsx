import React, {createContext, useContext, useState} from "react";
import "/src/stylesheets/popup/tip.less"
import Message from "./message.jsx";

class TipContextValue {
}

export const TipContext = createContext(TipContextValue)

let visibleState = false
let autoCloseTimer
let taskParams
let titleQueue = []
let temporaryComponentQueue = []
let callback4Close
export default function TipProvider({children}) {
    const [isHiding, setHiding] = useState(false)
    const [isVisible, setVisibility] = useState(false)
    const [temporaryComponent, setTemporaryComponent] = useState(null)
    const [tipTitle, setTipTitle] = useState("")

    TipContextValue = {
        isVisible,
        setVisibility,
        isHiding,
        close,
        showWithConfig,
        title,
        show
    }

    function show(message) {
        temporaryComponentQueue.push(<Message/>)
        TipContextValue.title(message)
            .showWithConfig({autoClose: true})
    }

    function title(title) {
        if (title) {
            titleQueue.push(title)
            return TipContextValue
        } else
            return tipTitle
    }

    function close(message, haveTask) {
        console.log("close", message);
        setHiding(true)
        clearTimeout(autoCloseTimer)
        setTimeout(() => {
            setVisibility(false)
            visibleState = false
            setTipTitle("")
            setTemporaryComponent(null)
            if (haveTask) {
                showWithConfig(taskParams)
            } else {
                callback4Close()
            }
            console.log("closed", isVisible);
        }, 400)
    }

    function showWithConfig({
                        message = "",
                        autoClose = false,
                        task = false,
                        onClose = () => {
                        }
                    } = {}) {
        console.log("visibleState:", visibleState);
        if (visibleState) {
            taskParams = {message: "task", autoClose, task: true, onClose}
            return close("task", true)
        }
        if (task) {
            console.info("popup.show", "task", "message:", message);
        } else {
            console.info("popup.show", "normal", "message:", message);
        }
        setTipTitle(titleQueue.shift())
        setTemporaryComponent(temporaryComponentQueue.shift())
        setHiding(false)
        setVisibility(true)
        visibleState = true
        callback4Close = onClose
        if (autoClose) {
            autoCloseTimer && clearTimeout(autoCloseTimer)
            autoCloseTimer = setTimeout(() => {
                close("auto")
            }, 3000)
        }

    }

    return (
        <TipContext.Provider value={TipContextValue}>
            {isVisible && <div className={"tip"} id={"tip"}>{temporaryComponent}</div>}
            {children}
        </TipContext.Provider>)
}

export function useTip() {
    return useContext(TipContext)
}
