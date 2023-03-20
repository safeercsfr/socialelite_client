import { useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import Navbar from "scenes/navbar/Navbar";
import ChatBox from "scenes/widgets/ChatBox";
import ChatList from "scenes/widgets/ChatList";

const MessagePage = () => {

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

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
          <ChatList/>
          <Box m="2rem 0" />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <ChatBox />
          <Box m="2rem 0" />
        </Box>
      </Box>
    </Box>
  );
};

export default MessagePage;
