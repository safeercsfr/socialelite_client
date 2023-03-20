import {
  Avatar,
  Box,
  CardHeader,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Message from "components/Message";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@emotion/react";
// IO CONNECTION
const socket = io.connect("ws://localhost:3002");

const ChatBox = () => {
  // const [openImageUpload, setImageUpload] = useState(false);
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [friend, setFriend] = useState(null);
  const userId = useSelector((state) => state?.user?._id);
  const token = useSelector((state) => state?.token);
  const scrollRef = useRef();
  const { palette } = useTheme();
  const id = useSelector((state) => state?.ids?.chatId);
  const friendId = useSelector((state) => state?.ids?.friendId);
  let messages1 = []
  if(messages){
    messages1=messages
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: userId,
      text: newMessage,
      converstationId: id,
    };
    socket.emit("sendMessage", {
      senderId: userId,
      receiverId: friendId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/messages`,
        message,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages([...messages1, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data?.senderId,
        text: data?.text,
        createdAt: new Date(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      friendId === arrivalMessage.sender &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    socket.emit("addUser", userId);
    socket.on("getUsers", (users) => {});
  }, [userId]);

  useEffect(() => {
    const getMessags = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/messages/${id}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(res?.data);
      } catch (error) {
        console.error(error);
      }
    };
    getMessags();
  }, [id, friendId]);

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
        setFriend(res?.data?.user);
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, [id, friendId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages1]);

  return (
    <WidgetWrapper>
      <Box flex={4}>
        <Box
          sx={{
            height: "70vh",
            width: "99%",
            border: "none",
          }}
        >
          <CardHeader
            avatar={<Avatar src={friend?.picturePath} alt={`Avatar `} />}
            action={
              <IconButton aria-label="settings">
                {/* <MoreVertIcon /> */}
              </IconButton>
            }
            title={friend?.username}
            subheader="online"
          />
          <Box
            sx={{
              backgroundColor: "#f0f5f5",
              height: "calc(100% - 8rem)",
              paddingLeft: "1rem",
              overflowX: "scroll",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Box>
              {messages1 &&
                messages1?.map((msg, index) => {
                  return (
                    <Box ref={scrollRef} key={index}>
                      <Message msg={msg} />
                    </Box>
                  );
                })}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#f0f5f5",
            }}
          >
            <Box
              sx={{
                marginLeft: "3rem",
                height: "3rem",
                width: "90%",
                display: "flex",
                paddingLeft: "1rem",
              }}
            >
              <OutlinedInput
                sx={{
                  padding: "1rem",
                  backgroundColor: "white",
                  borderRadius: "20px",
                }}
                placeholder="Type here"
                multiline
                fullWidth
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                inputProps={{ "aria-label": "Type Message" }}
              />
            </Box>
            <IconButton
              sx={{
                backgroundColor: palette?.primary?.main,
                "&:hover": {
                  backgroundColor: palette?.neutral?.medium,
                  color: palette?.neutral?.medium,
                },
              }}
            >
              <SendIcon
                onClick={handleSubmit}
                sx={{
                  borderRadius: "100%",
                  color: palette?.background?.alt,
                  marginInline: "0.5rem",
                  cursor: "pointer",
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default ChatBox;
