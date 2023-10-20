import moment from "moment";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";
import { SetUser } from "../../redux/userSlice";
import { UpdateProfilePicture } from "../../apicalls/users";
import "./profile.css"; 

function Profile() {
  const { user } = useSelector((state) => state.userReducer);
  const [image = "", setImage] = React.useState("");
  const dispatch = useDispatch();

  const onFileSelect = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setImage(reader.result);
    };
  };

  useEffect(() => {
    if (user?.profilePic) {
      setImage(user.profilePic);
    }
  }, [user]);

  const updateProfilePic = async () => {
    try {
      dispatch(ShowLoader());
      const response = await UpdateProfilePicture(image);
      dispatch(HideLoader());
      if (response.success) {
        toast.success("Profile Pic Updated");
        dispatch(SetUser(response.data));
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  return (
    user && (
      <div className="profile-container">
        <div className="profile-details">
          <h1 className="profile-name">{user.name}</h1>
          <h1 className="profile-email">{user.email}</h1>
          <h1 className="profile-created-at">
            Created At: {moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
          </h1>
        </div>

        {image && (
          <img src={image} alt="profile pic" className="profile-image" />
        )}

        <div className="profile-actions">
          <label htmlFor="file-input" className="profile-label">Update Profile Pic</label>
          <input
            type="file"
            onChange={onFileSelect}
            className="profile-file-input"
            id="file-input"
          />
          <button className="profile-update-button" onClick={updateProfilePic}>
            Update
          </button>
        </div>
      </div>
    )
  );
}

export default Profile;
