import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar/Navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import Notifications from "scenes/widgets/Notifications";
import UserWidget from "scenes/widgets/UserWidget";


const Notification = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { _id, picturePath } = useSelector((state) => state?.user);

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
        <UserWidget userId={_id} picturePath={picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={_id} isSuggestion={true } />
        </Box>
        
          <Box
            flexBasis={isNonMobileScreens ? "50%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            <Notifications/>
          </Box>
      </Box>
    </Box>
  );
};

export default Notification;
