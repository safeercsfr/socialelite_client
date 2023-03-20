import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { setIds } from "state/authSlice";

const ChatItem = ({ chat }) => {
  const [user, setUser] = useState(null);
  const currentUser = useSelector((state) => state?.user?._id);
  const token = useSelector((state) => state?.token);
  const friendId = chat.members.find((m) => m !== currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${friendId}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res?.data?.user);
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, [friendId]);

  const ids = {
    chatId: chat?._id,
    friendId: friendId,
  };

  return (
    <Box>
      <ListItem>
        <ListItemButton
          onClick={() => {
            dispatch(setIds({}));
            dispatch(setIds({ ids: ids }));
          }}
        >
          <ListItemAvatar>
            <Avatar alt={`Avatar `} src={user?.picturePath} />
          </ListItemAvatar>
          <ListItemText primary={user?.username} />
        </ListItemButton>
      </ListItem>
      <Divider />
    </Box>
  );
};

export default ChatItem;
