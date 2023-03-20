import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFollowers, setFollowings, setSuggestions } from "state/authSlice";
import { patchDataAPI } from "utils/fetchData";

const NotificationItem = ({ notification }) => {
  const currentUser = useSelector((state) => state?.user);
  const token = useSelector((state) => state?.token);
  const _id = useSelector((state) => state?.user?._id);
  const followings = currentUser?.followings;
  const dispatch = useDispatch();
  const isFollowing = followings?.find(
    (friend) => friend?._id === notification?.friend._id
  );

  const unFollowFriend = async (friendId) => {
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
  const followBackFriend = async (friendId) => {
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
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box marginTop="1rem" minWidth="max-content">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Avatar
            src={notification?.friend?.picturePath}
            sx={{ width: 50, height: 50 }}
          />
          <Box marginLeft="1rem">
            <Typography variant="p" fontWeight={600}>
              {notification?.friend?.username}
            </Typography>
            <Typography variant="p" marginLeft="1rem">
              {notification?.content}
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Box sx={{ marginTop: "1rem",display:"flex" }}>
        {notification?.type === "like" && notification?.postId?.image && (
          <img
            src={notification?.postId?.image}
            alt=""
            style={{
              width: "2rem",
              height: "2rem",
              objectFit: "cover",
            }}
          />
        )}
        {notification?.type === "Comment" && notification?.postId?.image && (
          <img
            src={notification?.postId?.image}
            alt=""
            style={{
              width: "2rem",
              height: "2rem",
              objectFit: "cover",
            }}e
          />
        )}
        {(notification?.type !== "like") | "Comment" &&
        !followings?.includes(notification?.friend._id) ? (
          <Box>
            {isFollowing ? (
              <Button onClick={() => unFollowFriend(notification?.friend._id)}>
                following
              </Button>
            ) : (
              <Button
                onClick={() => followBackFriend(notification?.friend._id)}
              >
                Followback
              </Button>
            )}
          </Box>
        ) : (
          ""
        )}
      </Box>
    </Stack>
  );
};

export default NotificationItem;
