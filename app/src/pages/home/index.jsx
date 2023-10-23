import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from "./components/UserList";
import { io } from "socket.io-client";
import "./index.css";

const socket = io('https://sway-backend.onrender.com');

function Home() {
  const [searchKey, setSearchKey] = useState("");
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isUserContainerVisible, setIsUserContainerVisible] = useState(true);

  useEffect(() => {
    // join the room
    if (user) {
      socket.emit("join-room", user._id);
      socket.emit("came-online", user._id);

      socket.on("online-users-updated", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user]);

  const toggleUserContainerVisibility = () => {
    setIsUserContainerVisible(!isUserContainerVisible);
  };

  return (
    <>
    
    <div className="home-container">
    <div className={`userlist-interface ${isUserContainerVisible ? 'open' : ''}`}>
      {isUserContainerVisible && (
        <div className="user-container">
          <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
          <UsersList searchKey={searchKey} socket={socket} onlineUsers={onlineUsers} />
        </div>
      )}
    </div>
    <button className="toggle-user-container" onClick={toggleUserContainerVisibility}>
    <img className="file-picker-icon" 
            src="./toggle.png"
            />
      </button>
      {selectedChat && (
        <div className="chat-container">
          <ChatArea socket={socket} />
        </div>
      )}

      {!selectedChat && (
        <div className="empty-chat-container">
          <h1 className="empty-chat-text">Select a user or connect to chat</h1>
        </div>
      )}
    </div>
</>
  );
}

export default Home;
