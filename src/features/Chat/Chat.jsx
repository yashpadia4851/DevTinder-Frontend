import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { createSocketConnection } from "../../config/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { APP_URL } from "../../config/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const location = useLocation();
  const userData = location.state?.userData;

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // ===============================
  // 📥 FETCH OLD CHAT FROM DATABASE
  // ===============================
  const fetchChatDetails = async () => {
    try {
      const chats = await axios.get(
        APP_URL + "/chatDetails/" + targetUserId,
        { withCredentials: true }
      );

      const chatData = chats?.data?.message;

      if (!chatData || !chatData.messages) return;

      const formattedMessages = chatData.messages.map((msg) => ({
        id: msg._id,
        text: msg.text,
        createdAt: msg.createdAt,
        sender:
          msg.senderId._id === userId ? "me" : "other",
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId && targetUserId) {
      fetchChatDetails();
    }
  }, [userId, targetUserId]);

  // ===============================
  // 🔌 SOCKET CONNECTION
  // ===============================
  useEffect(() => {
    if (!userId) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", {
      userId,
      targetUserId,
    });

    socketRef.current.on(
      "messageReceived",
      ({ messageId, text, createdAt, senderId }) => {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === messageId)) return prev;

          return [
            ...prev,
            {
              id: messageId,
              text,
              createdAt,
              sender: senderId === userId ? "me" : "other",
            },
          ];
        });
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, targetUserId]);

  // ===============================
  // 📜 AUTO SCROLL
  // ===============================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===============================
  // ⏰ FORMAT TIME (AM/PM)
  // ===============================
  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // ===============================
  // 📅 FORMAT DATE LABEL
  // ===============================
  const formatDateLabel = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    const isToday =
      today.toDateString() === messageDate.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday =
      yesterday.toDateString() === messageDate.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return messageDate.toLocaleDateString();
  };

  // ===============================
  // 🚀 SEND MESSAGE
  // ===============================
  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    socketRef.current.emit("sendMessage", {
      userId,
      targetUserId,
      text: currentMessage,
    });

    setCurrentMessage("");
  };

  return (
    <div className="flex items-center justify-center p-2 sm:p-6">
      <div className="w-full sm:w-auto p-[2px] rounded-none sm:rounded-2xl bg-gradient-to-r from-emerald-400 to-purple-500">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-screen sm:h-[600px] sm:w-[420px] bg-white rounded-none sm:rounded-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-emerald-400 to-purple-500 text-white">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <img
                src={userData?.photoURL}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold">
                {userData?.firstName} {userData?.lastName}
              </h2>
              <p className="text-sm opacity-90">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((msg, index) => {
              const showDate =
                index === 0 ||
                new Date(messages[index - 1].createdAt).toDateString() !==
                  new Date(msg.createdAt).toDateString();

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-2">
                      <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {formatDateLabel(msg.createdAt)}
                      </span>
                    </div>
                  )}

                  <motion.div
                    initial={{
                      opacity: 0,
                      x: msg.sender === "me" ? 20 : -20,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`relative px-4 py-2 rounded-xl shadow-sm text-sm w-fit max-w-[80%] ${
                      msg.sender === "me"
                        ? "ml-auto bg-gradient-to-r from-emerald-400 to-purple-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <p className="pr-10">{msg.text}</p>

                    <span
                      className={`absolute bottom-1 right-3 text-[10px] ${
                        msg.sender === "me"
                          ? "text-white/70"
                          : "text-gray-400"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </span>
                  </motion.div>
                </React.Fragment>
              );
            })}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 text-black border rounded-full outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              />
              <button
                onClick={sendMessage}
              className="px-4 py-2 bg-linear-to-r cursor-pointer from-emerald-400 to-purple-500 text-white rounded-full hover:opacity-90 transition text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;