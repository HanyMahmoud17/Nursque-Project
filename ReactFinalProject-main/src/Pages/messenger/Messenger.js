import "./messenger.css";
import Conversation from "../../Components/conversations/Conversation";
import Message from "../../Components/message/Message";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

import DarkStyle from '../../Components/DarkMode/darkBtn.module.css'

export default function Messenger() {
  const { patientID, nurseID } = useParams();

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const user = JSON.parse(localStorage.getItem("user"))._id;
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode");
    if (isDarkMode) {
      document.querySelector("#headerText")?.classList.toggle(DarkStyle["headerText"], isDarkMode);
    }
  }, []);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user);
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`http://localhost:3500/chat/${user}`);
        const uniqueConversations = filterUniqueConversations(res.data);
        setConversations(uniqueConversations);
      } catch (err) {
        console.log(err);
      }
    };

    getConversations();
  }, [user]);


  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3500/message/${currentChat?._id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) {
      getMessages();
    }
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user
    );

    socket.current.emit("sendMessage", {
      senderId: user,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("http://localhost:3500/message", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end",
    inline: "nearest", });
  }, [messages]);

  const filterUniqueConversations = (conversations) => {
    const uniqueConversations = [];
    const seenMembers = new Set();

    conversations.forEach((conversation) => {
      const membersString = conversation.members.sort().join('-');
      if (!seenMembers.has(membersString)) {
        seenMembers.add(membersString);
        uniqueConversations.push(conversation);
      }
    });

    return uniqueConversations;
  };

  return (
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
          <h3 id="headerText">: المحادثات الحالية</h3>
          {conversations.map((c) => (
            <div onClick={() => setCurrentChat(c)} key={c._id}>
              <Conversation conversation={c} currentUser={user} />
            </div>
          ))}
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="chatBoxTop">
                {messages.map((m) => (
                  <div key={m._id} ref={scrollRef}>
                    <Message message={m} own={m.sender === user} />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput"
                  placeholder="write something..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                ></textarea>
                <button className="chatSubmitButton" onClick={handleSubmit}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <span className="noConversationText">
              .افتح محادثة لبدء الدردشة
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
