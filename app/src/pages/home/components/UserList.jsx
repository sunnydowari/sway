/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CreateNewChat } from "../../../apicalls/chats";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { SetAllChats, SetSelectedChat } from "../../../redux/userSlice";
import moment from "moment";
import store from "../../../redux/store";
import "./main.css"

function UsersList({ searchKey, socket, onlineUsers }) {
  const { allUsers, allChats, user, selectedChat } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();
  const createNewChat = async (receipentUserId) => {
    try {
      dispatch(ShowLoader());
      const response = await CreateNewChat([user._id, receipentUserId]);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        const updatedChats = [...allChats, newChat];
        dispatch(SetAllChats(updatedChats));
        dispatch(SetSelectedChat(newChat));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  const openChat = (receipentUserId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((mem) => mem._id).includes(user._id) &&
        chat.members.map((mem) => mem._id).includes(receipentUserId)
    );
    if (chat) {
      dispatch(SetSelectedChat(chat));
    }
  };

  const getData = () => {
    // if search key is empty then return all chats else return filtered chats and users
    try {
      if (searchKey === "") {
        return allChats || [];
      }
      return allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchKey.toLowerCase()) || []
      );
    } catch (error) {
      return [];
    }
  };

  const getIsSelctedChatOrNot = (userObj) => {
    if (selectedChat) {
      return selectedChat.members.map((mem) => mem._id).includes(userObj._id);
    }
    return false;
  };

  const getDateInRegualarFormat = (date) => {
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

  const getLastMsg = (userObj) => {
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const lastMsgPerson =
        chat?.lastMessage?.sender === user._id ? "You : " : "";
      return (
        <div className="user-card-message">
          <h1 className="user-card-message-text">
            {lastMsgPerson} {chat?.lastMessage?.text}
          </h1>
          <h1 className="user-card-message-last">
            {getDateInRegualarFormat(chat?.lastMessage?.createdAt)}
          </h1>
        </div>
      );
    }
  };

  const getUnreadMessages = (userObj) => {
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (
      chat &&
      chat?.unreadMessages &&
      chat?.lastMessage?.sender !== user._id
    ) {
      return (
        <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {chat?.unreadMessages}
        </div>
      );
    }
  };

  useEffect(() => {
    socket.on("receive-message", (message) => {
      // if the chat area opened is not equal to chat in message , then increase unread messages by 1 and update last message
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      let tempAllChats = store.getState().userReducer.allChats;
      if (tempSelectedChat?._id !== message.chat) {
        const updatedAllChats = tempAllChats.map((chat) => {
          if (chat._id === message.chat) {
            return {
              ...chat,
              unreadMessages: (chat?.unreadMessages || 0) + 1,
              lastMessage: message,
              updatedAt: message.createdAt,
            };
          }
          return chat;
        });
        tempAllChats = updatedAllChats;
      }

      // always latest message chat will be on top
      const latestChat = tempAllChats.find((chat) => chat._id === message.chat);
      const otherChats = tempAllChats.filter(
        (chat) => chat._id !== message.chat
      );
      tempAllChats = [latestChat, ...otherChats];
      dispatch(SetAllChats(tempAllChats));
    });
  }, []);

  return (
    <div className="user-card">
      {getData().map((chatObjOrUserObj) => {
        let userObj = chatObjOrUserObj;

        if (chatObjOrUserObj.members) {
          userObj = chatObjOrUserObj.members.find(
            (mem) => mem._id !== user._id
          );
        }
        return (
          <div
            className={`user-card-each 
                ${getIsSelctedChatOrNot(userObj) && "border-primary border-2"}
            `}
            key={userObj._id}
            onClick={() => openChat(userObj._id)}
          >
            <div className="flex gap-3 items-center">
              {userObj.profilePic && (
                <img
                  src={userObj.profilePic}
                  alt="profile pic"
                  className="w-10 h-10 rounded-full"
                  style={{ objectFit: "cover" }}
                />
              )}
              {!userObj.profilePic && (
                <div className="bg-gray-600 rounded-full h-12 w-12 flex items-center justify-center relative">
                  <h1 className="uppercase text-xl font-semibold text-white">
                    {userObj.name[0]}
                  </h1>
                </div>
              )}
              <div className="user-card-details">  
                <div className="user-card-">
                  <div className="user-card-name">
                    <h1 className="text-white">{userObj.name}</h1>
                    {onlineUsers.includes(userObj._id) && (
                      <div>
                        <div className="bg-green-700 h-3 w-3 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {getUnreadMessages(userObj)}
                </div>
                {getLastMsg(userObj)}
              </div>
            </div>
            <div onClick={() => createNewChat(userObj._id)}>
              {!allChats.find((chat) =>
                chat.members.map((mem) => mem._id).includes(userObj._id)
              ) && (
                <button className="border-primary border text-primary bg-white p-1 rounded">
                  connect
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UsersList;
