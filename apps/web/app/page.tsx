'use client'
import { useState } from "react";
import { useSocket } from "../context/SocketProvicer";
import classes from "./page.module.css";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");




  return (
    <div className={classes.container}>
      <div className={classes["chat-box"]}>
        <ul className={classes.messages}>
          {messages && messages.length > 0 ? (
            messages.map((msg, idx) => (
              <li key={idx} className={classes["message-item"]}>
                {msg}
              </li>
            ))
          ) : (
            <li className={classes["message-item"]}>No messages yet</li>
          )}
        </ul>
        <div className={classes["input-row"]}>
          <input
            className={classes["chat-input"]}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={() => sendMessage(message)} className={classes["button"]}>Send</button>
        </div>


      </div>
    </div>
  );
}
