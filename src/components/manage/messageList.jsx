import "/src/stylesheets/manage/messageList.less"

import {useContext} from "react";
import {MessageListObjectContextForManage} from "../../pages/manage.jsx";
import {Icon} from "@iconify/react";
import Loading from "../content/loading.jsx";
import {PopupContext} from "../popup/popup.jsx";

export default function MessageListForManage() {
    const popup = useContext(PopupContext)
    const messageListObject = useContext(MessageListObjectContextForManage)

    function deleteMessage(id) {

    }

    return <div className="messageList">
        <div className="head">
            <div className="label face">face</div>
            <div className="label nickname">nickname</div>
            <div className="label url">url</div>
            <div className="label content">content</div>
            <div className="placeholder"></div>
            <div className="label datetime">datetime</div>
            <div className="label operation">operation</div>
        </div>
        {messageListObject.isLoading
            ? <Loading/>
            : <div className="list">
                {messageListObject.list.map((value, index) =>
                    <div className="item" key={index}>
                        <div className="face">
                            <Icon icon={"emojione-v1:" + value.face}/>
                        </div>
                        <div className="nickname">{value.nickname || "匿名网友"}</div>
                        {value.url
                            ? <a href={value.url} className="url">{value.url}</a>
                            : <div className="url">无</div>}
                        <div className="content">{value.content}</div>
                        <div className="datetime">{new Date(value.createTime).toLocaleString()}</div>
                        <div className="operation">
                            <Icon icon="ri:delete-bin-3-line" onClick={deleteMessage(value.id)} className={"delete"}/>
                        </div>
                    </div>
                )}
                <div className="placeholder"></div>
            </div>
        }
        <div className="bottomBar">
            <div className="total">Total: {messageListObject.total}</div>
            <div className="pagination"></div>
        </div>
    </div>
}
