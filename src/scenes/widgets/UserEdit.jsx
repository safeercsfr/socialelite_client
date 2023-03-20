import { TextField, Box, Typography, Grid, useTheme } from "@mui/material";
import { Button } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { useState } from "react";
import WidgetWrapper from "components/WidgetWrapper";
import ChangePasswordWidget from "./ChangePasswordWidge";
import { useDispatch, useSelector } from "react-redux";
import { setIsEditing, setUserData } from "state/authSlice";
import { putDataAPI } from "utils/fetchData";
import { toast, Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup
    .string()
    .matches(
      /^[a-z0-9_.]+$/,
      "Username must contain only small letters, underscores, dots, and numbers."
    )
    .required("Username is required."),
  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required."),
  name: yup
    .string()
    .required("Name is required.")
    .min(1, "Name must be at least 1 character long.")
    .max(50, "Name cannot be longer than 50 characters."),
  bio: yup
    .string()
    .trim()
    .matches(/^[^#<>@/"$%^&*()!+=:;{}[\]`\\|~]+$/, {
      message:
        "Invalid characters in bio. Bio cannot contain hashtags, links, or special characters.",
      excludeEmptyString: true,
    })
    .max(150, "Bio cannot be longer than 150 characters."),
});

const UserEdit = ({ user, onSave, onCancel }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const dark = palette.neutral.dark;
  const [isPasswordEdit, setIsPasswordEdit] = useState(false);
  const [username, setUsername] = useState(user?.username);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [bio, setBio] = useState(user?.bio);
  const token = useSelector((state) => state?.token);
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    name: "",
    bio: "",
  });
  const handleSave = () => {
    const formData = { username, name, email, bio };
    schema
      .validate(formData, { abortEarly: false })
      .then(() => {
        onSave({
          ...user,
          username,
          name,
          bio,
          email,
        });
      })
      .catch((err) => {
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      });
  };

  const onPasswordSave = async (userDetails) => {
    try {
      const { data } = await putDataAPI(`/users/${userId}`, userDetails, token);
      dispatch(setUserData({ user: data }));
      dispatch(setIsEditing({ isEditing: false }));
    } catch (err) {
      toast.error(err?.response?.data?.error, {
        position: "bottom-center",
      });
      console.error(err);
    }
  };

  const handleTextClick = () => {
    setIsPasswordEdit(true);
  };

  return isPasswordEdit ? (
    <ChangePasswordWidget
      user={user}
      onCancel={() => dispatch(setIsEditing({ isEditing: false }))}
      onPasswordSave={onPasswordSave}
    />
  ) : (
    <WidgetWrapper>
      <Toaster />
      <Box p="1rem">
        <Typography
          variant="h4"
          color={dark}
          fontWeight="500"
          mb="1rem"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <EditOutlined sx={{ mr: "0.5rem" }} />
          Edit profile
        </Typography>
        {/* PASSWORD CHANGE BUTTON  */}
        <Box
          onClick={handleTextClick}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mb: "1rem",
            color: palette?.primary?.main,
            "&:hover": {
              cursor: "pointer",
              color: palette?.primary?.light,
            },
          }}
        >
          <Typography>Change Password</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={Boolean(formErrors.username)}
              helperText={formErrors.username}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              error={Boolean(formErrors.bio)}
              helperText={formErrors.bio}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt="1rem">
          <Button variant="contained" color="primary" onClick={onCancel}>
            Cancel
          </Button>
          <Box ml="1rem">
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default UserEdit;
