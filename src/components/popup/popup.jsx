import {useNavigate} from "react-router-dom";
import React, {createContext, useEffect, useState} from "react";
import "/src/stylesheets/popup/popup.less"
import Message from "./message.jsx";

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
    const navigate = useNavigate()
    const [isHiding, setHiding] = useState(false)
    const [PopupChildren, loadComponent] = useState(<></>)
    const [isVisible, setVisibility] = useState(false)
    const [temporaryComponent, setTemporaryComponent] = useState(null)
    const [isShowMask, setMaskVisibility] = useState(true)
    const [isLockScroll, setLockScroll] = useState(true)
    const [isLockMask, setLockMask] = useState(false)
    const [popipTitle, setPopipTitle] = useState("")

    PopupContextValue = {
        isVisible,
        setVisibility,
        isHiding,
        loadTemporaryComponent,
        loadComponent,
        close,
        show,
        title,
        tip
    }
    useEffect(() => {
        if (isLockScroll)
            document.body.style.overflow = isVisible ? "hidden" : "unset"
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isVisible, isLockScroll])

    function tip(message) {
        loadTemporaryComponent(<Message/>)
            .title(message)
            .show({showMask: false, lockScroll: false, autoClose: true})
    }

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
        if (message === "mask" && isLockMask)
            return
        console.log("close", message);
        setHiding(true)
        clearTimeout(autoCloseTimer)
        setTimeout(() => {
            setVisibility(false)
            visibleState = false
            isShowMask || setMaskVisibility(true)
            isLockScroll || setLockScroll(true)
            setPopipTitle("")
            setTemporaryComponent(null)
            if (haveTask) {
                show(taskParams)
            } else {
                callback4Close()
            }
            console.log("closed", isVisible);
        }, 400)
    }

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
        setPopipTitle(titleQueue.shift())
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
