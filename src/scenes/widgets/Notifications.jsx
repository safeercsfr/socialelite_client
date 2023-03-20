import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDataAPI } from "utils/fetchData";
import NotificationItem from "./NotificationItem";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token = useSelector((state) => state?.token);
  const userId = useSelector((state) => state?.user?._id);

  const getNotifications = async () => {
    try {
      const { data } = await getDataAPI(
        `/users/${userId}/notifications`,
        token
      );

      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <WidgetWrapper>
      <Box flex={4}>
        <Box
          sx={{
            height: "80vh",
            width: "100%",
            border: "none",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography variant="h6" component="h1">
              Notifications
            </Typography>
          </Box>
          <Box>
            <Box>
              <Box
                sx={{
                  width: "90%",
                  margin: "1rem",
                  maxHeight: "80vh",
                  overflowY: "scroll",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {notifications.map((item, i) => {
                  return (
                    <>
                      <NotificationItem key={i} notification={item} />
                      <Divider />
                    </>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default Notifications;
