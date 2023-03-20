import { useTheme } from "@emotion/react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { postDataAPI } from "utils/fetchData";

export const ForgotPassword = () => {
  const theme = useTheme();
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");

  const handleClick = async (e) => {
    try {
      e.preventDefault();
      if (email === "") {
        toast.error("email is required", {
          position: "bottom-center",
        });
      } else if (!email.includes("@")) {
        toast.warning("includes @ in your email!", {
          position: "bottom-center",
        });
      } else {
        const { data } = await postDataAPI(`/auth/forgot-password`, {
          email,
        });
        if(data){
          setIsVerified(true);
          setEmail("");
        }
      }
    } catch (err) {
       (({ response }) => {
        toast.error(response?.data?.message, {
          position: "bottom-center",
        });
      })(err);
    }
  };

  return !isVerified ? (
    <form>
      <Box>
        <Box
          width="100%"
          backgroundColor={theme?.palette?.background?.alt}
          p="1rem 6%"
          textAlign="center"
        >
          <Typography fontWeight="bold" fontSize="32px" color="primary">
            Socialelite
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "85vh",
          }}
        >
          <WidgetWrapper>
            <Box p="1rem" sx={{ width: "30rem", alignItems: "center" }}>
              <Typography
                variant="h4"
                //   color={}
                fontWeight="500"
                mb="1rem"
                sx={{ display: "flex", alignItems: "center" }}
              >
                {/* <EditOutlined sx={{ mr: "0.5rem" }} /> */}
                Enter Your Email
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Enter new email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box
                display="flex"
                justifyContent="flex-end"
                mt="1rem"
                sx={{
                  button: {
                    margin: "0 0.5rem",
                  },
                  "& button:first-of-type": {
                    marginRight: 0,
                  },
                }}
              >
                <Button
                  onClick={handleClick}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Send
                </Button>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Button
                    sx={{ marginTop: "10px" }}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Back to login page
                  </Button>
                </Link>
              </Box>
            </Box>
          </WidgetWrapper>
        </Box>
      </Box>
      <Toaster />
    </form>
  ) : (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>URL has sended to your email,Check email and Go to the URL</h2>
    </div>
  );
};

export default ForgotPassword;
