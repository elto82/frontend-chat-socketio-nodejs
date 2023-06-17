import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://backend-chat-production-c2a2.up.railway.app/");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([...messages, newMessage]);
    socket.emit("messageF", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("messageB", receiveMessage);
    return () => {
      socket.off("messageB", receiveMessage);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const receiveMessage = (message) => {
    setMessages((state) => [...state, message]);
  };

  return (
    <div className="h-screen w-screen bg-zinc-800 text-white flex items-center justify-center">
      <div className="container mx-auto h-full">
        <div className="flex flex-col justify-between h-full">
          <div className="overflow-y-auto pb-10">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`my-2 p-2 table text-sm rounded-md ${
                  message.from === "Me" ? "bg-sky-900 ml-auto" : "bg-sky-500"
                }`}
              >
                <span className="text-xs text-slate-300 block">
                  {message.from.slice(0, 6)}
                </span>
                <span className="text-md">{message.body}</span>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
            <h1 className="text-4xl font-bold my-2">Chat</h1>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="my-2 border-2 border-zinc-500 p-2 w-full bg-zinc-50 text-black font-bold"
            />
            <button className="bg-zinc-50 p-2 text-black font-bold rounded-md w-1/4">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
