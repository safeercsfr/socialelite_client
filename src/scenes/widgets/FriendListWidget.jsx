import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFollowers, setFollowings, setSuggestions } from "state/authSlice";
import { getDataAPI } from "utils/fetchData";
import { isEqual } from "lodash";

const FriendListWidget = ({ userId, isSuggestion }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const medium = palette.neutral.medium;
  const followings = useSelector((state) => state?.user?.followings);
  const followers = useSelector((state) => state?.user?.followers);
  const token = useSelector((state) => state?.token);
  const suggestions = useSelector((state) => state?.suggestions);
  let followers1 = []
  let followings1 = []
  if(followers){
    followers1=followers
  }
  if(followings){
    followings1=followings
  }

  const getFriends = async () => {
    try {
      // CALLING FOLLOWING LIST
      const { data } = await getDataAPI(`/users/${userId}/followings`, token);

      const formattedFollowingsData = data?.formattedFollowings.map(
        ({ id }) => id
      );
      const formattedFollowersData = data?.formattedFollowers.map(
        ({ id }) => id
      );

      if (isEqual(formattedFollowingsData, formattedFollowersData)) {
        dispatch(setFollowings({ followings: data?.formattedFollowings }));
        dispatch(setFollowers({ followers: [] }));
        dispatch(setSuggestions({ suggestions: data?.suggestions }));
      } else {
        dispatch(setFollowings({ followings: data?.formattedFollowings }));
        dispatch(setFollowers({ followers: data?.formattedFollowers }));
        dispatch(setSuggestions({ suggestions: data?.suggestions }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper style={{ position: "sticky", top: "7.3rem" }}>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        {isSuggestion ? "Suggestion List" : "Following List"}
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {isSuggestion ? (
          suggestions?.length === 0 ? (
            <Typography color={medium} m="0.5rem 0">
              No suggestions found.
            </Typography>
          ) : (
            suggestions?.map((friend) => (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={friend?.username}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
                isFriendData
              />
            ))
          )
        ) : followings1?.length === 0 ? (
          <Typography color={medium} m="0.5rem 0">
            You are following no one yet.
          </Typography>
        ) : (
          [...followers1, ...followings1]?.map((friend, I) => (
            <Friend
              key={friend?._id + I}
              friendId={friend?._id}
              name={friend?.username}
              subtitle={friend?.occupation}
              userPicturePath={friend?.picturePath}
              isFriendData
            />
          ))
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
