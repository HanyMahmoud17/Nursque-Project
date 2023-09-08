import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
import DarkStyle from '../DarkMode/darkBtn.module.css'

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const token = localStorage.getItem("token");
  const isUser = JSON.parse(localStorage.getItem("user")).role;
  const api="http://localhost:3500/"
  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode");
    if (isDarkMode) {
      document.querySelector("#userName")?.classList.toggle(DarkStyle["userName"], isDarkMode);
      document.querySelector("#usernameDiv")?.classList.toggle(DarkStyle["usernameDiv"], isDarkMode);
    }
  }, []);
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser);
    const getUser = async () => {
      try {
        let res;
        if (isUser === 'nurse') {
          res = await axios.get(
            `http://localhost:3500/patient/patientProfile?patientId=${friendId}`,
            {
              headers: { authorization: `Bearer ${token}` },
            }
          );
        } else if(isUser === 'patient') {
          res = await axios.get(
            `http://localhost:3500/nurse/nurseProfile/${friendId}`
          );
        }
        setUser(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation" id="usernameDiv">
      <img
        className="conversationImg"
        src={`${api}/${user?.profile}`}
        alt=""
      />
      <span className="conversationName" id='userName'>{user?.name}</span>
    </div>
  );
}
