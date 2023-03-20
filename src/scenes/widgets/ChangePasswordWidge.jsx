import { TextField, Box, Typography, Grid, useTheme } from "@mui/material";
import { Button } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { useState } from "react";
import WidgetWrapper from "components/WidgetWrapper";
import * as yup from "yup";

const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required("Required"),
  newPassword: yup
    .string()
    .required("Required")
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

const ChangePasswordWidget = ({ user, onPasswordSave, onCancel }) => {
  const { palette } = useTheme();
  const dark = palette?.neutral?.dark;
  const [formValues, setFormValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event?.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSave = () => {
    passwordSchema
      .validate(formValues, { abortEarly: false })
      .then(() => {
        onPasswordSave({
          ...user,
          oldPassword: formValues?.oldPassword,
          newPassword: formValues?.newPassword,
          confirmPassword: formValues?.confirmPassword,
        });
      })
      .catch((errors) => {
        const validationErrors = {};
        errors.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setFormErrors(validationErrors);
      });
  };
  return (
    <WidgetWrapper>
      <Box p="1rem">
        <Typography
          variant="h4"
          color={dark}
          fontWeight="500"
          mb="1rem"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <EditOutlined sx={{ mr: "0.5rem" }} />
          Change Password
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Old Password"
              type="password"
              name="oldPassword"
              value={formValues?.oldPassword}
              onChange={handleChange}
              error={!!formErrors?.oldPassword}
              helperText={formErrors?.oldPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              name="newPassword"
              value={formValues?.newPassword}
              onChange={handleChange}
              error={!!formErrors?.newPassword}
              helperText={formErrors?.newPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formValues?.confirmPassword}
              onChange={handleChange}
              error={!!formErrors?.confirmPassword}
              helperText={formErrors?.confirmPassword}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt="1rem">
          <Button variant="contained" color="primary" onClick={onCancel}>
            Cancel
          </Button>
          <Box ml="1rem">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!formValues}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default ChangePasswordWidget;
