/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetAllChats } from "../apicalls/chats";
import { GetAllUsers, GetCurrentUser } from "../apicalls/users";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { SetAllUsers, SetUser, SetAllChats } from "../redux/userSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetCurrentUser();
      const allUsersResponse = await GetAllUsers();
      const allChatsResponse = await GetAllChats();
      dispatch(HideLoader());
      if (response.success) {
        dispatch(SetUser(response.data));
        dispatch(SetAllUsers(allUsersResponse.data));
        dispatch(SetAllChats(allChatsResponse.data));
      } else {
        toast.error(response.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-primary p-2">
      {/* header */}
      <div className="flex justify-between p-5 bg-primary rounded">
        <div className="flex items-center gap-1">
          <i className="ri-message-3-line text-2xl text-white"></i>
          <h1
            className="text-white text-2xl uppercase font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Sway
          </h1>
        </div>
        <div className="flex gap-2 text-md items-center bg-secondary p-2 rounded">
          {user?.profilePic && (
            <img
              src={user?.profilePic}
              alt="profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          {!user?.profilePic && (
          <img
            src="/profile.png" // Specify the path to your default profile image PNG file
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        )}
          <h1
            className="underline text-white cursor-pointer"
            onClick={() => {
              navigate("/profile");
            }}
          >
            {user?.name}
          </h1>

          <img
            src="/logout.png"
            alt="Logout"
            className="w-5 h-5 cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          />
        </div>
      </div>

      {/* content (pages) */}
      <div className="py-5">{children}</div>
    </div>
  );
}

export default ProtectedRoute;
