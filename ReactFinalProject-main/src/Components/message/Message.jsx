import "./message.css";
import { format } from "timeago.js";
import { useEffect } from "react";
import DarkStyle from '../DarkMode/darkBtn.module.css'

export default function Message({ message, own }) {
  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode");
    if (isDarkMode) {
      document.querySelector("#time")?.classList.toggle(DarkStyle["time"], isDarkMode);
    }
  }, []);
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom" id='time'>{format(message.createdAt)}</div>
    </div>
  );
}
