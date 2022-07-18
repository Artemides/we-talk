import axios from "axios";
import React, { useEffect, useRef, useState, } from "react";
import {useParams} from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import "../styles/Messages.css";
import { Message } from "./Message";
const API="http://localhost:4000/api/v1/chats";
export const Messages = () => {
  const auth=useAuth();
  const {chatId}=useParams();
  const lastMessageRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    (async()=>{
      await axios.get(`${API}/chat-messages?chatId=${chatId}`,{
        headers:{'Authorization':`Bearer ${auth.token}`}
      })
        .then(response=>setMessages(response.data.messages))
        .catch(err=>console.log(err));
    })()
  }, []);
  useEffect(()=>{
     auth.socket.current.on("comming-messages",(message)=>{
         setMessages([...messages,message]);
     })
  },[messages])
  return (
    <section className="messages-container">
      <div className="messages-body">
        {messages.map((message) => (
          <Message message={message} key={message._id} />
        ))}
        <div ref={lastMessageRef} />
      </div>
    </section>
  );
};
