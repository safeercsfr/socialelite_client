import { useTheme } from "@emotion/react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setLogin, setUserData } from "state/authSlice";
import { postDataAPI } from "utils/fetchData";

const VerifyEmail = () => {
  const theme = useTheme();
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  const { id } = useParams();

  const handleOTP = async (e) => {
    try {
      e.preventDefault();
      const { data } = await postDataAPI(`/auth/verify-email/${id}`, { OTP });
      if (data) {
        dispatch(
          setLogin({
            token: data.token,
          })
        );
        dispatch(
          setUserData({
            user: data.user,
          })
        );
        navigate("/home");
      }
    } catch (err) {
      (({ response }) => {
        toast.error(response?.data?.message, {
          position: "bottom-center",
        });
      })(err);
    }
  };

  return (
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
                fontWeight="500"
                mb="1rem"
                sx={{ display: "flex", alignItems: "center" }}
              >
                Enter OTP
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="otp"
                    label="OTP"
                    onChange={(e) => setOTP(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    type="number"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box ml="1rem" display="flex" justifyContent="flex-end" mt="1rem">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOTP}
                  type="submit"
                >
                  Submit
                </Button>
              </Box>
              <Link to="/">
                <Typography
                  sx={{
                    textAlign: "left",
                    textDecoration: "underline",
                    color: palette?.primary?.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette?.primary?.light,
                    },
                  }}
                >
                  Back to the page
                </Typography>
              </Link>
            </Box>
          </WidgetWrapper>
        </Box>
      </Box>
      <Toaster />
    </form>
  );
};

export default VerifyEmail;
