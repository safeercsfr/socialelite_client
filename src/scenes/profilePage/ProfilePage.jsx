import { Box, Button, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "scenes/navbar/Navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { getDataAPI, putDataAPI } from "utils/fetchData";
import { setIsEditing } from "state/authSlice";
import UserEdit from "scenes/widgets/UserEdit";
import { toast, Toaster } from "react-hot-toast";
import { setUserData } from "state/authSlice";
import axios from "axios";

const ProfilePage = () => {
  const isEditing = useSelector((state) => state?.isEditing);
  const [friendData, setFriendData] = useState(false);
  const [friendDetails, setFriendDetails] = useState({});
  const dispatch = useDispatch();
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state?.token);
  const user = useSelector((state) => state?.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");



  const getFriendData = async () => {
    try {
      const { data } = await getDataAPI(`/users/${userId}`, token);
      setFriendDetails(data);
      dispatch(setIsEditing({ isEditing: false }));
    } catch (error) {
      console.error(error);
    }
  };

  const onSave = async (userDetails) => {
    try {
      const { data } = await putDataAPI(`/users/${userId}`, userDetails, token);
      dispatch(setUserData({ user: data }));
      dispatch(setIsEditing({ isEditing: false }));
    } catch (err) {
      toast.error(err.response.data.error, {
        position: "bottom-center",
      });
      console.error(err);
    }
  };

  const createConverStation = async (friendId) => {
    const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/converstations`, { friendId }, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        },
    })

    if(data){
      navigate(`/message`);
    }
}

  useEffect(() => {
    if (userId !== user?._id) {
      setFriendData(true);
    }
  }, [userId, user._id]);

  useEffect(() => {
    getFriendData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget
            userId={friendData ? friendDetails?._id : userId}
            picturePath={
              friendData ? friendDetails?.picturePath : user.picturePath
            }
            isEditUser={friendData ? false : true}
            isFriendData={friendData ? true : false}
            isProfile
          />
          <Box m="2rem 0" />
          {!friendData && (
            <FriendListWidget
              userId={friendData ? friendDetails?._id : userId}
              isFriendData={friendData ? true : false}
            />
          )}
        </Box>
        {isEditing ? (
          <Box
            flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            <UserEdit
              user={user}
              onCancel={() => dispatch(setIsEditing({ isEditing: false }))}
              onSave={onSave}
            />
          </Box>
        ) : (
          <Box
            flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            {!friendData && <MyPostWidget picturePath={user?.picturePath} />}
            <Box m="2rem 0" />
            <PostsWidget userId={userId} isProfile />
          </Box>
        )}
      </Box>
      <Toaster />
      {friendData ? <Button sx={{ margin: "1rem" }} onClick={() => createConverStation(userId)} variant='contained' size='small' >Message</Button> : ''}
    </Box>
  );
};

export default ProfilePage;
