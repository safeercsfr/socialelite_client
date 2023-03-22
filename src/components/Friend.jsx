import { Box, Typography, useTheme, Button } from "@mui/material";
import { ConfirmToast } from "react-confirm-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setFollowers,
  setFollowings,
  setPosts,
  setSuggestions,
  setUserData,
} from "state/authSlice";
import { deleteDataAPI, patchDataAPI } from "utils/fetchData";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  postId,
  isFriendData,
  userImage=true,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _id  = useSelector((state) => state?.user?._id);
  const token = useSelector((state) => state?.token);
  const followings = useSelector((state) => state?.user?.followings);
  const followers = useSelector((state) => state?.user?.followers);

  const { palette } = useTheme();
  const main = palette?.neutral?.main;
  const medium = palette?.neutral?.medium;

  const isFollowing = followings?.find((friend) => friend?._id === friendId);
  const isFollower = followers?.find((friend) => friend?._id === friendId);

  const followFriend = async () => {
    try {
      const { data } = await patchDataAPI(
        `/users/${_id}/${friendId}/follow`,
        {},
        token
      );
      dispatch(setFollowings({ followings: data?.formattedFollowings }));
      dispatch(setFollowers({ followers: data?.formattedFollowers }));
      // dispatch(setSuggestions({ suggestions: data.suggestions }));
    } catch (error) {
      console.log(error);
    }
  };
  const unFollowFriend = async () => {
    try {
      const { data } = await patchDataAPI(
        `/users/${_id}/${friendId}/unfollow`,
        {},
        token
      );

      dispatch(setFollowings({ followings: data?.formattedFollowings }));
      dispatch(setFollowers({ followers: data?.formattedFollowers }));
      dispatch(setSuggestions({ suggestions: data?.suggestions }));
    } catch (error) {
      console.log(error);
    }
  };
  const followBackFriend = async () => {
    try {
      const { data } = await patchDataAPI(
        `/users/${_id}/${friendId}/followback`,
        {},
        token
      );

      dispatch(setFollowings({ followings: data?.formattedFollowings }));
      dispatch(setFollowers({ followers: [] }));
      dispatch(setSuggestions({ suggestions: data?.suggestions }));
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async () => {
    const { data } = await deleteDataAPI(`/posts/${postId}`, token);
    dispatch(setPosts({ posts: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        {userImage && <UserImage image={userPicturePath} size="55px" />}
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette?.primary?.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {!isFriendData && friendId === _id ? (
        <ConfirmToast
          asModal={true}
          customCancel={"Cancel"}
          customConfirm={"Confirm"}
          customFunction={deletePost}
          message={"Do you want to delete post?"}
          position={"bottom-left"}
          showCloseIcon={true}
          theme={"snow"}
        >
          <Button>Delete</Button>
        </ConfirmToast>
      ) : (
        <Box>
          {isFollowing ? (
            <Button onClick={() => unFollowFriend()}>Following</Button>
          ) : isFollower ? (
            <Button onClick={() => followBackFriend()}>Followback</Button>
          ) : (
            <Button onClick={() => followFriend()}>Follow</Button>
          )}
        </Box>
      )}
    </FlexBetween>
  );
};

export default Friend;
