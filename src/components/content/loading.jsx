import "/src/stylesheets/content/loading.less"

const Loading = () => {
    // todo 加载失败反馈
    return (
        <div className="loading">
            <LoadingSVG/>
        </div>)
}

const LoadingSVG = () => {
    return <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                width="24px" height="30px" viewBox="0 0 24 30" xmlSpace="preserve">
    <rect x="0" y="13" width="4" height="5" fill="#333">
      <animate attributeName="height" attributeType="XML"
               values="5;21;5"
               begin="0s" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="y" attributeType="XML"
                 values="13; 5; 13"
                 begin="0s" dur="1s" repeatCount="indefinite"/>
    </rect>
        <rect x="10" y="13" width="4" height="5" fill="#333">
<animate
    attributeName="height"
    attributeType="XML"
    values="5;21;5"
    begin="0.15s"
    dur="1s"
    repeatCount="indefinite"/>
            <animate
                attributeName="y"
                attributeType="XML"
                values="13; 5; 13"
                begin="0.15s"
                dur="1s"
                repeatCount="indefinite"/>
    </rect>
        <rect
            x="20"
            y="13"
            width="4"
            height="5"
            fill="#333">
      <animate
          attributeName="height"
          attributeType="XML"
          values="5;21;5"
          begin="0.5s"
          dur="1s"
          repeatCount="indefinite"/>
            <animate
                attributeName="y"
                attributeType="XML"
                values="13; 5; 13"
                begin="0.5s" dur="1s" repeatCount="indefinite"/>
    </rect>
  </svg>
}
export default Loading
