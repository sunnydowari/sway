/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetMessages, SendMessage } from "../../../apicalls/messages";
import { ClearChatMessages } from "../../../apicalls/chats";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";
import moment from "moment";
import { SetAllChats } from "../../../redux/userSlice";
import store from "../../../redux/store";
import EmojiPicker from "emoji-picker-react";
import "./main.css";

function ChatArea({ socket }) {
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [isReceipentTyping, setIsReceipentTyping] = React.useState(false);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = React.useState("");
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );
  const [messages = [], setMessages] = React.useState([]);
  const receipentUser = selectedChat.members.find(
    (mem) => mem._id !== user._id
  );

  const sendNewMessage = async (image) => {
    try {
      const message = {
        chat: selectedChat._id,
        sender: user._id,
        text: newMessage,
        image,
      };
      // send message to server using socket
      socket.emit("send-message", {
        ...message,
        members: selectedChat.members.map((mem) => mem._id),
        createdAt: moment().format("DD-MM-YYYY hh:mm:ss"),
        read: false,
      });

      // send message to server to save in db
      const response = await SendMessage(message);

      if (response.success) {
        setNewMessage("");
        setShowEmojiPicker(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getMessages = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetMessages(selectedChat._id);
      dispatch(HideLoader());
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  const clearUnreadMessages = async () => {
    try {
      socket.emit("clear-unread-messages", {
        chat: selectedChat._id,
        members: selectedChat.members.map((mem) => mem._id),
      });

      const response = await ClearChatMessages(selectedChat._id);

      if (response.success) {
        const updatedChats = allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data;
          }
          return chat;
        });
        dispatch(SetAllChats(updatedChats));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDateInRegularFormat = (date) => {
    let result = "";

    // if date is today return time in hh:mm format
    if (moment(date).isSame(moment(), "day")) {
      result = moment(date).format("hh:mm");
    }
    // if date is yesterday return yesterday and time in hh:mm format
    else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
      result = `Yesterday ${moment(date).format("hh:mm")}`;
    }
    // if date is this year return date and time in MMM DD hh:mm format
    else if (moment(date).isSame(moment(), "year")) {
      result = moment(date).format("MMM DD hh:mm");
    }

    return result;
  };

  const inputRef = useRef(null);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents a new line from being added
      sendNewMessage("");
      inputRef.current.focus(); // Refocus on the input field
    }
  };

  useEffect(() => {
    getMessages();
    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessages();
    }

    // receive message from server using socket
    socket.on("receive-message", (message) => {
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      if (tempSelectedChat._id === message.chat) {
        setMessages((messages) => [...messages, message]);
      }

      if (
        tempSelectedChat._id === message.chat &&
        message.sender !== user._id
      ) {
        clearUnreadMessages();
      }
    });

    // clear unread messages from server using socket
    socket.on("unread-messages-cleared", (data) => {
      const tempAllChats = store.getState().userReducer.allChats;
      const tempSelectedChat = store.getState().userReducer.selectedChat;

      if (data.chat === tempSelectedChat._id) {
        // update unread messages count in selected chat
        const updatedChats = tempAllChats.map((chat) => {
          if (chat._id === data.chat) {
            return {
              ...chat,
              unreadMessages: 0,
            };
          }
          return chat;
        });
        dispatch(SetAllChats(updatedChats));

        // set all messages as read
        setMessages((prevMessages) => {
          return prevMessages.map((message) => {
            return {
              ...message,
              read: true,
            };
          });
        });
      }
    });

    // recipient typing
    socket.on("started-typing", (data) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      if (data.chat === selectedChat._id && data.sender !== user._id) {
        setIsReceipentTyping(true);
      }
      setTimeout(() => {
        setIsReceipentTyping(false);
      }, 1500);
    });
  }, [selectedChat]);

  useEffect(() => {
    // always scroll to the bottom for messages id
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages, isReceipentTyping]);

  const onUploadImageClick = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      sendNewMessage(reader.result);
    };
  };

  return (
    <div className="chat-area">
      {/* 1st part recipient user */}
      <div>
        <div className="flex gap-5 items-center mb-2">
          {receipentUser.profilePic && (
            <img
              src={receipentUser.profilePic}
              alt="profile pic"
              className="w-10 h-10 rounded-full"
              style={{ objectFit: "cover" }}
            />
          )}
          {!receipentUser.profilePic && (
            <div className="bg-gray-500  rounded-full h-10 w-10 flex items-center justify-center">
              <h1 className="uppercase text-xl font-bold  text-white">
                {receipentUser.name[0]}
              </h1>
            </div>
          )}
          <h1 className="lowercase">{receipentUser.name}</h1>
        </div>
        <hr />
      </div>

      {/* 2nd part chat messages */}
      <div className="h-[55vh] overflow-y-scroll p-5" id="messages">
        <div className="flex flex-col gap-2">
          {messages.map((message, index) => {
            const isCurrentUserIsSender = message.sender === user._id;
            return (
              <div className={`flex ${isCurrentUserIsSender && "justify-end"}`}>
                <div className="flex flex-col gap-1">
                  {message.text && (
                    <h1
                      className={`${
                        isCurrentUserIsSender
                          ? "bg-secondary text-white rounded-bl-none"
                          : "bg-gray-300 text-primary rounded-tr-none"
                      } p-2 rounded-xl`}
                    >
                      {message.text}
                    </h1>
                  )}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="message image"
                      className="message-image"
                    />
                  )}
                  {/* last sent message date */}
                  <h1 className="chatarea-timestamps">
                    {getDateInRegularFormat(message.createdAt)}
                  </h1>
                </div>
                {isCurrentUserIsSender && message.read && (
                  <div className="p-2">
                    {receipentUser.profilePic && (
                      <img
                        src={receipentUser.profilePic}
                        alt="profile pic"
                        className="w-4 h-4 rounded-full"
                      />
                    )}
                    {!receipentUser.profilePic && (
                      <div className="bg-gray-400 rounded-full h-4 w-4 flex items-center justify-center relative">
                        <h1 className="uppercase text-sm font-semibold text-white">
                          {receipentUser.name[0]}
                        </h1>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {isReceipentTyping && (
            <div className="pb-10">
              <h1 className="bg-blue-100 text-primary  p-2 rounded-xl w-max">
                typing...
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* 3rd part chat input */}
      <div className="h-18 rounded-xl border-gray-300 shadow border flex justify-between p-2 items-center relative">
        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker
              height={350}
              onEmojiClick={(e) => {
                setNewMessage(newMessage + e.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </div>
        )}

        <div className="file-picker">
          <label for="file">
            <img
              className="file-picker-icon"
              src="./files.png"
              typeof="file"
            />
            <input
              type="file"
              id="file"
              style={{
                display: "none",
                width: 200,
                height: 350,
              }}
              accept="image/gif,image/jpeg,image/jpg,image/png"
              onChange={onUploadImageClick}
            />
          </label>
          <img
            src="./emoji.png"
            alt="Emoji Icon"
            className="emoji-picker"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
        </div>

        <input
          type="text"
          placeholder="Type a message"
          className="w-[90%] border-0 h-full rounded-xl focus:border-none"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            socket.emit("typing", {
              chat: selectedChat._id,
              members: selectedChat.members.map((mem) => mem._id),
              sender: user._id,
            });
          }}
          onKeyDown={handleInputKeyDown} 
          ref={inputRef}
        />
        <button
          className="send-message-button"
          onClick={() => {
            sendNewMessage("");
            inputRef.current.focus();
          }}
        >
          <img src="/send.png" alt="Send" className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
