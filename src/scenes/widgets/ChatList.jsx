import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import WidgetWrapper from "components/WidgetWrapper";
import axios from "axios";

const ChatList = () => {
  const [converstations, setConverstations] = useState([]);
  const userId = useSelector((state) => state?.user?._id);
  const token = useSelector((state) => state?.token);

  useEffect(() => {
    const getConverstations = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/converstations/${userId}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setConverstations(res?.data);
      } catch (error) {
        console.error(error);
      }
    };
    getConverstations();
  }, []);
  
  return (
    <WidgetWrapper>
      <Box flex={4}>
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h1">
            Chats
          </Typography>
        </Box>
        <Box>
          {/* <Box>
            <TextField
              sx={{
                marginInline: "2rem",
                width: "98%",
                backgroundColor: "transparent",
              }}
              id="standard-basic"
              placeholder="Find User"
              variant="standard"
            />
          </Box> */}
          <Box>
            <List
              dense
              sx={{
                bgcolor: "background.paper",
                maxHeight: "80vh",
                overflowY: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {converstations?.map((chat) => {
                return <ChatItem key={chat._id} chat={chat}/>;
              })}
            </List>
          </Box>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default ChatList;
