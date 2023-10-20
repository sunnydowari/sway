/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "./main.css"

function UserSearch({searchKey , setSearchKey}) {
  
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search users / chats"
        className="search-bar"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      {/* <i className="ri-search-line absolute top-4 left-4 text-gray-500"></i> */}
    </div>
  );
}

export default UserSearch;
