import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import useOnline from "utils/useOnline";
import HomePage from "scenes/HomePage/HomePage";
import LoginPage from "scenes/loginPage/LoginPage";
import ProfilePage from "scenes/profilePage/ProfilePage";
import ForgotPassword from "scenes/ForgotPassword/ForgotPassword";
import MessagePage from "scenes/MessagePage/MessagePage";
import VerifyEmail from "scenes/VerifyEmail/VerifyEmail";
import ResetPassword from "scenes/resetPassword/ResetPassword";
import ErrorPage from "scenes/ErrorPage/ErrorPage";
import Notification from "scenes/Notification/Notification"


function App() {
  const mode = useSelector((state) => state?.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state?.token));

  const isOnline = useOnline();
  if (!isOnline)
    return (
      <>
        <Typography
          variant="h4"
          sx={{
            color: theme?.palette?.error?.main,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          You are offline. Please check your internet connection and try again.
        </Typography>
      </>
    );

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={isAuth ? <HomePage /> : <LoginPage />} />
            <Route path="/reset-password" element = {<ResetPassword/>}/>
            <Route path="/forgot-password" element = {<ForgotPassword/>}/>
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
              path="/message"
              element={<MessagePage />}
            />
            <Route path='/verify-email/:id' element={ <VerifyEmail/>}/>
            <Route path="/notifications" element={<Notification />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;