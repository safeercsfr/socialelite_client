import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { useSelector } from "react-redux";

const ChatMessage = ({ msg }) => {
  const userId = useSelector((state) => state?.user?._id);

  return (
    <Box
      sx={{
        display: "flex",
        ...(msg?.sender === userId && {
          alignItems: "flex-end",
        }),
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          maxWidth: "75%",
          width: "min-content",
          minHeight: "max-content",
          marginTop: "1rem",
          ...(msg?.sender === userId && {
            backgroundColor: "#b1c9ad",
          }),
          ...(msg?.sender !== userId && {
            backgroundColor: "white",
          }),
          borderRadius: "0px 10px 10px 10px",
          padding: "1rem",
        }}
      >
        <Typography variant="p" component="p">
          {msg?.text}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatMessage;
