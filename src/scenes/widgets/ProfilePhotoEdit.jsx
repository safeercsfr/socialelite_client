import React from "react";
import { IconButton, Input } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { putDataAPI } from "utils/fetchData";
import { setProfileImg } from "state/authSlice";

const ProfilePhotoEdit = ({ setIsEdit }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.token);

  const handleFileChange = async (e) => {
    try {
      const selectedFile = e.target?.files[0];
      const formData = new FormData();
      formData.append("picture", selectedFile);
      const { data } = await putDataAPI('/auth/update', formData, token);
      if (data) {
        dispatch(setProfileImg({ picturePath: data?.picturePath }));
        setIsEdit(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <>
      <Input
        type="file"
        id="upload-button"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <label htmlFor="upload-button">
        <IconButton component="span">
          <CameraAlt />
        </IconButton>
      </label>
    </>
  );
};

export default ProfilePhotoEdit;
