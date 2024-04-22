import React, {createContext, useContext, useEffect, useState} from "react";
import "/src/stylesheets/popup/popup.less"
import Confirm from "./confirm.jsx";

class PopupContextValue {
}

export const PopupContext = createContext(PopupContextValue)

let visibleState = false
let autoCloseTimer
let taskParams
let titleQueue = []
let temporaryComponentQueue = []
let callback4Close
export default function PopupProvider({children}) {
    const [isHiding, setHiding] = useState(false)
    const [PopupChildren, loadComponent] = useState(<></>)
    const [isVisible, setVisibility] = useState(false)
    const [temporaryComponent, setTemporaryComponent] = useState(null)
    const [isShowMask, setMaskVisibility] = useState(true)
    const [isLockScroll, setLockScroll] = useState(true)
    const [isLockMask, setLockMask] = useState(false)
    const [popupTitle, setPopupTitle] = useState("")

    PopupContextValue = {
        isVisible,
        setVisibility,
        isHiding,
        loadTemporaryComponent,
        loadComponent,
        close,
        show,
        title,
        confirm
    }
    useEffect(() => {
        if (isLockScroll)
            document.body.style.overflow = isVisible ? "hidden" : "unset"
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isVisible, isLockScroll])

    function confirm(target, message, confirmFn) {
        console.log(target);
        loadTemporaryComponent(<Confirm confirmFn={confirmFn} target={target} tip={message}/>).show()
    }

    function title(title) {
        if (title) {
            titleQueue.push(title)
            return PopupContextValue
        } else
            return popupTitle
    }

    function loadTemporaryComponent(element) {
        temporaryComponentQueue.push(element)
        return PopupContextValue
    }

    function close(message, haveTask) {
        if (message === "mask" && isLockMask)
            return
        console.log("close", message);
        return new Promise(resolve => {
            setHiding(true)
            clearTimeout(autoCloseTimer)
            setTimeout(() => {
                setVisibility(false)
                visibleState = false
                isShowMask || setMaskVisibility(true)
                isLockScroll || setLockScroll(true)
                setPopupTitle("")
                setTemporaryComponent(null)
                if (haveTask) {
                    show(taskParams)
                } else {
                    callback4Close()
                }
                console.log("closed", isVisible);
                resolve()
            }, 400)
        })

    }

    /**
     *
     * @param message
     * @param showMask
     * @param lockScroll
     * @param autoClose
     * @param task
     * @param lockMask
     * @param onClose
     * @return {void}
     */
    function show({
                      message = "",
                      showMask = true,
                      lockScroll = true,
                      autoClose = false,
                      task = false,
                      lockMask = false,
                      onClose = () => {
                      }
                  } = {}) {
        console.log("visibleState:", visibleState);
        if (visibleState) {
            taskParams = {message: "task", showMask, lockScroll, autoClose, task: true, onClose, lockMask}
            return close("task", true)
        }
        if (task) {
            console.info("popup.show", "task", "message:", message);
        } else {
            console.info("popup.show", "normal", "message:", message);
        }
        setLockMask(lockMask)
        setPopupTitle(titleQueue.shift())
        setTemporaryComponent(temporaryComponentQueue.shift())
        lockScroll || setLockScroll(false)
        showMask || setMaskVisibility(false)
        setHiding(false)
        setVisibility(true)
        visibleState = true
        callback4Close = onClose
        if (autoClose) {
            autoCloseTimer && clearTimeout(autoCloseTimer)
            autoCloseTimer = setTimeout(() => {
                close("auto").then()
            }, 3000)
        }

    }

    return (
        <PopupContext.Provider value={PopupContextValue}>
            {isVisible && <div className={"popup " + (isShowMask ? "" : "noMask")}>
                {isShowMask && <div className={"mask" + (isHiding ? " hide" : "")} onClick={_ => close("mask")}></div>}
                {temporaryComponent || PopupChildren}
            </div>}
            {children}
        </PopupContext.Provider>)
}

export function usePopup() {
    return useContext(PopupContext)
}
