import {useNavigate} from "react-router-dom";
import React, {createContext, useEffect, useState} from "react";
import "/src/stylesheets/popup/popup.less"

class PopupContextValue {
    isVisible
    setVisibility
    isHiding
    loadTemporaryComponent
    loadComponent
    close
    show
    title
}

export const PopupContext = createContext(PopupContextValue)

let visibleState = false
let autoCloseTimer
let taskParams
let titleQueue = []
let temporaryComponentQueue = []
export default function PopupProvider({children}) {
    const navigate = useNavigate()
    const [isHiding, setHiding] = useState(false)
    const [PopupChildren, loadComponent] = useState(<></>)
    const [isVisible, setVisibility] = useState(false)
    const [temporaryComponent, setTemporaryComponent] = useState(null)
    const [isShowMask, setMaskVisibility] = useState(true)
    const [isLockScroll, setLockScroll] = useState(true)
    const [popipTitle, setPopipTitle] = useState("")
    PopupContextValue = {
        isVisible,
        setVisibility,
        isHiding,
        loadTemporaryComponent,
        loadComponent,
        close,
        show,
        title
    }
    useEffect(() => {
        if (isLockScroll)
            document.body.style.overflow = isVisible ? "hidden" : "unset"
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isVisible])

    function title(title) {
        if (title) {
            titleQueue.push(title)
            return PopupContextValue
        } else
            return popipTitle
    }

    function loadTemporaryComponent(element) {
        temporaryComponentQueue.push(element)
        return PopupContextValue
    }

    function close(message, haveTask) {
        console.log("close", message);
        setHiding(true)
        clearTimeout(autoCloseTimer)
        setTimeout(() => {
            if (location.pathname.split("/").length > 2 && !haveTask)
                navigate(location.pathname.replace(/\/[^/]*$/, ""))
            setVisibility(false)
            visibleState = false
            isShowMask || setMaskVisibility(true)
            isLockScroll || setLockScroll(true)
            setPopipTitle("")
            setTemporaryComponent(null)
            haveTask && show(taskParams)
            console.log("closed", isVisible);
        }, 400)
    }

    function show({showMask = true, lockScroll = true, autoClose = false, task = false} = {}) {
        if (visibleState) {
            taskParams = {showMask, lockScroll, autoClose, task: true}
            return close("task", true)
        }
        if (task) {
            console.log("show", "task");
        } else {
            console.log("show", "normal");
        }
        setPopipTitle(titleQueue.shift())
        setTemporaryComponent(temporaryComponentQueue.shift())
        lockScroll || setLockScroll(false)
        showMask || setMaskVisibility(false)
        setHiding(false)
        setVisibility(true)
        visibleState = true

        if (autoClose) {
            autoCloseTimer && clearTimeout(autoCloseTimer)
            autoCloseTimer = setTimeout(() => {
                close("auto")
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
