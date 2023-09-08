import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MassangerStyle from "./massengerIcon.module.css";
import { io } from "socket.io-client";

const MassangerIcon = () => {
  const socket = useRef();
  useEffect(() => {
    socket.current = io("ws://localhost:3500");
  }, []);
  const [notificationChat, setNotificationChat] = useState([]);
  const token = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    socket.current?.on("getNotifcationChat", (data) => {
      if (data.nurseId == token._id) {
        setNotificationChat((prevNotifications) => {
          const updatedNotifications = [...prevNotifications, data];
          localStorage.setItem(
            "notificationChat",
            JSON.stringify(updatedNotifications)
          );
          return updatedNotifications;
        });
      }
    });
    return () => {
      socket.current?.off("getNotificationChat");
    };
  }, []);

  useEffect(() => {
    const storedNotificationChat = JSON.parse(
      localStorage.getItem("notificationChat")
    );

    if (storedNotificationChat) {
      setNotificationChat(storedNotificationChat);
    }
  }, []);
  const navigate = useNavigate();
  const clearChatNumber = () => {
    const updatedNotifications = [];
    setNotificationChat(updatedNotifications);
    localStorage.removeItem("notificationChat");
    navigate('/Messenger');
  };
  

  return (
     
    <div className={MassangerStyle.top_to_btm}>
      <div className={`${MassangerStyle.icon_position} ${MassangerStyle.icon_style}`}>
          <span
            className={`${MassangerStyle.messengerIcon}`}
            role="img"
            aria-label="Messenger"
            onClick={(e) => {
              e.preventDefault();
              clearChatNumber();
            }}
              >
                💬
                  {notificationChat.length > 0 && (
                    <div className={MassangerStyle.counter}>
                      {notificationChat.length}
                    </div>
                  )}
             </span>
      </div>
    </div>  
  );
};

export default MassangerIcon;
