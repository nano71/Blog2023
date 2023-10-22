import {useNavigate} from "react-router-dom";
import React, {createContext, useEffect, useState} from "react";
import "/src/stylesheet/popup.less"

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
        console.log(isVisible);
        if (isLockScroll)
            document.body.style.overflow = isVisible ? "hidden" : "unset"
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isVisible])

    function title(title) {
        if (title) {
            setPopipTitle(title)
            return PopupContextValue
        } else
            return popipTitle
    }

    function loadTemporaryComponent(element) {
        setTemporaryComponent(element)
        return PopupContextValue
    }

    function close(message) {
        console.log("close", message);
        setHiding(true)
        setTimeout(() => {
            navigate(location.pathname.replace(/\/[^/]*$/, ""))
            setVisibility(false)
            setTemporaryComponent(null)
            isShowMask || setMaskVisibility(true)
            isLockScroll || setLockScroll(true)
            setPopipTitle("")
            console.log("closed", isVisible);
        }, 400)
    }

    function show(showMask = true, lockScroll = true, autoClose = false) {

        lockScroll || setLockScroll(false)
        showMask || setMaskVisibility(false)
        setHiding(false)
        setVisibility(true)
    }

    return (
        <PopupContext.Provider value={PopupContextValue}>
            {isVisible && <div className={"popup " + (isShowMask ? "" : "noMask")}>
                {isShowMask && <div className={"mask" + (isHiding ? " hide" : "")} onClick={close}></div>}
                {temporaryComponent || PopupChildren}
            </div>}
            {children}
        </PopupContext.Provider>)
}
