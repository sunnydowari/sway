/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

function UserSearch({searchKey , setSearchKey}) {
  
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search users / chats"
        className="rounded-xl w-90 border-gray-300 pl-10 text-gray-500 h-14"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <i className="ri-search-line absolute top-4 left-4 text-gray-500"></i>
    </div>
  );
}

export default UserSearch;
