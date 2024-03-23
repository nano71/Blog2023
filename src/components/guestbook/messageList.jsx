import {Icon} from "@iconify/react";

/**
 *
 * @param {Array}messageList
 * @return {JSX.Element}
 */
export default function ({messageList}) {
    return <div className={"messageList"}>
        <h2 className="title">messages</h2>
        <div className="list">
            {messageList.map((value, index) => <MessageItem key={index} value={value}/>)}
        </div>
    </div>
}

/**
 *
 * @param {MessageItem} value
 * @return {JSX.Element}
 * @constructor
 */
function MessageItem({value}) {

    return <div className="item">
        {/*<img className="avatar" src="http://localhost:5173/mona-loading-default.gif" alt="avatar"/>*/}
        <Icon className="avatar" icon={"emojione-v1:" + value.face}></Icon>
        <div className="right">
            <div className="top">
                {value.url
                    ? <a href={value.url} className="nickname">{value.nickname || "匿名网友"}</a>
                    : <div className="nickname">{value.nickname || "匿名网友"}</div>}
                <div className="time">{new Date(value.createTime).toLocaleString()}</div>
            </div>
            <div className="message">
                {value.content}
            </div>
        </div>
    </div>
}
