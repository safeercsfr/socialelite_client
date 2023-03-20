import { useTheme } from "@emotion/react";
import { EditOutlined } from "@mui/icons-material";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { putDataAPI } from "utils/fetchData";

export const ResetPassword = () => {
  const theme = useTheme();
  const location = useLocation();
  const code = location.search.split("?")[1];
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleClick = async (e) => {
    try {
      e.preventDefault();
      if (!password) {
        toast.error("Enter new password", {
          position: "bottom-center",
        });
      }

      const { data } = await putDataAPI(`/auth/reset-password/?${code}`, {
        password,
      });
      if (data) {
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        err?.response?.data?.error.forEach((err) => {
          toast.error(err, {
            position: "bottom-center",
          });
        });
      }
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
                <EditOutlined sx={{ mr: "0.5rem" }} />
                Enter your new Password
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="password"
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    type="password"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box ml="1rem" display="flex" justifyContent="flex-end" mt="1rem">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                  type="submit"
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </WidgetWrapper>
        </Box>
      </Box>
      <Toaster />
    </form>
  );
};

export default ResetPassword;
