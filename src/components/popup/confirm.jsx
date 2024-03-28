import React, {useEffect, useRef, useState} from "react";
import {usePopup} from "./popup.jsx";
import {Icon} from "@iconify/react";

/**
 * @param {Object} target
 * @param {string} tip
 * @param {Function} confirmFn
 * @return {PopupComponent}
 */
function Confirm({target, tip, confirmFn}) {
    const popup = usePopup()
    const [labelWidth, setLabelWidth] = useState("auto")
    const longestLabelRef = useRef(null);

    useEffect(() => {
        target && setLabelWidth(longestLabelRef.current.offsetWidth + "px")
    }, [longestLabelRef]);

    function TargetObject() {
        let list = []
        let longestLabel = Object.keys(target).sort((a, b) => b.length - a.length)[0]
        console.log(longestLabel);
        for (let targetKey in target) {
            list.push(<div className="item" key={targetKey}>
                <div className="label"
                     ref={longestLabel === targetKey ? longestLabelRef : undefined}
                     style={{width: labelWidth}}>
                    {targetKey}:
                </div>
                <div className="content">{target[targetKey] || "null"}</div>
            </div>)
        }
        return list
    }

    return (
        <div className={"confirmContainer container" + (popup.isHiding ? " hide" : "")}>
            <div className="top">
                <div className="subtitle">
                    Please confirm
                </div>
                <a className="close" onClick={_ => popup.close()}><Icon icon="ri:close-fill"/></a>
            </div>
            <div className="body">
                {target && <div className="target">
                    <h2>Target Object:</h2>
                    <div className="object">
                        <TargetObject/>
                    </div>
                </div>}
                <div className="tip">
                    {tip}
                </div>
                <div className="buttons">
                    <div className="cancel" onClick={_ => popup.close()}>cancel</div>
                    <div className="confirm" onClick={confirmFn}>confirm</div>
                </div>
            </div>
        </div>)
}

export default Confirm
