import { useState } from "react";
import {
  Box,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setUserData } from "state/authSlice";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { toast, Toaster } from "react-hot-toast";
import { postDataAPI } from "utils/fetchData";
import LoadingButton from "@mui/lab/LoadingButton";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .matches(
      /^[a-z0-9_.]+$/,
      "Username can only contain lowercase letters, underscores, dots, and numbers"
    )
    .required("Username is required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup
    .string()
    .required("required")
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  emailOrUsername: yup
    .string()
    .test(
      "email-or-username",
      "Please enter a valid email or username",
      function (value) {
        const isEmail = yup.string().email().isValidSync(value);
        const isUsername = /^[a-z0-9_.]+$/.test(value);
        return isEmail || isUsername;
      }
    )
    .required("Email or username is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long"
    ),
});

const initialValuesRegister = {
  username: "",
  email: "",
  password: "",
  picture: "",
};

const initialValuesLogin = {
  emailOrUsername: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [loading, setLoading] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    try {
      const formData = new FormData();
      for (let value in values) {
        setLoading(true);
        formData.append(value, values[value]);
      }
      formData.append("picturePath", values?.picture?.name);

      const { data } = await postDataAPI(`/auth/register`, formData);
      const savedUser = data;
      onSubmitProps.resetForm();
      setLoading(false);
      if (savedUser?.status === "Pending") {
        navigate(`/verify-email/${savedUser?.user}`);
      }
      // if (savedUser) setPageType("login");
    } catch (err) {
      setLoading(false);
      if (err.response && err?.response?.data?.error) {
        err?.response?.data?.error?.forEach((err) => {
          toast.error(err, {
            position: "bottom-center",
          });
        });
      }
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const { data } = await postDataAPI(`/auth/login`, values);
      const loggedIn = data;
      onSubmitProps.resetForm();
      if (loggedIn) {
        dispatch(
          setLogin({
            token: loggedIn?.token,
          })
        );
        dispatch(
          setUserData({
            user: loggedIn?.user,
          })
        );
        navigate("/home");
      }
    } catch (err) {
      (({ response }) => {
        toast.error(response?.data?.msg, {
          position: "bottom-center",
        });
      })(err);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const handleGoogleLogin = async (response) => {
    const data = JSON.stringify({ token: response.credential });
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/google-login`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        dispatch(
          setLogin({
            token: response?.data?.token,
          })
        );
        dispatch(
          setUserData({
            user: response?.data?.user,
          })
        );
        navigate("/home");
      })
      .catch((err) => {
        console.error(err);
        ((error) => {
          toast.error(error?.response?.data?.msg, {
            position: "top-center",
          });
        })(err);
      });
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.username}
                  name="username"
                  error={
                    Boolean(touched?.username) && Boolean(errors?.username)
                  }
                  helperText={touched?.username && errors?.username}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette?.neutral?.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette?.primary?.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values?.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values?.picture?.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values?.email}
                  name="email"
                  error={Boolean(touched?.email) && Boolean(errors?.email)}
                  helperText={touched?.email && errors?.email}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}

            {/* <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values?.email}
              name="email"
              error={Boolean(touched?.email) && Boolean(errors?.email)}
              helperText={touched?.email && errors?.email}
              sx={{ gridColumn: "span 4" }}
            /> */}
            {isLogin && (
              <TextField
                label="Email or username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values?.emailOrUsername}
                name="emailOrUsername"
                error={
                  Boolean(touched?.emailOrUsername) &&
                  Boolean(errors?.emailOrUsername)
                }
                helperText={touched?.emailOrUsername && errors?.emailOrUsername}
                sx={{ gridColumn: "span 4" }}
              />
            )}
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values?.password}
              name="password"
              error={Boolean(touched?.password) && Boolean(errors?.password)}
              helperText={touched?.password && errors?.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <LoadingButton
              loading={loading}
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette?.primary?.main,
                color: palette?.background?.alt,
                "&:hover": { color: palette?.primary?.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </LoadingButton>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette?.primary?.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette?.primary?.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
            {isLogin && (
              <Link to="/forgot-password">
                <Typography
                  sx={{
                    textAlign: "right",
                    textDecoration: "underline",
                    color: palette?.primary?.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette?.primary?.light,
                    },
                  }}
                >
                  Forgot Password
                </Typography>
              </Link>
            )}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={(response) => {
                handleGoogleLogin(response);
              }}
              shape="pill"
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </Box>
          <Toaster />
        </form>
      )}
    </Formik>
  );
};

export default Form;
