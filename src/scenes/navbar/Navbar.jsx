import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state/authSlice";
import { Link, useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { getDataAPI } from "utils/fetchData";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const token = useSelector((state) => state?.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isMobileScreen = useMediaQuery("(max-width: 999px)");
  const theme = useTheme();
  const neutralLight = theme?.palette?.neutral?.light;
  const dark = theme.palette?.neutral?.dark;
  const background = theme?.palette?.background?.default;
  const primaryLight = theme?.palette?.primary?.light;
  const alt = theme.palette?.background?.alt;

  const fullName = `${user ? user?.username : "username"}`;
  const getAllUsers = async () => {
    const { data } = await getDataAPI("/users", token);
    setUsers(data);
  };

  useEffect(() => {
    getAllUsers();
  }, []); // eslint-disable-line

  return (
    <FlexBetween
      padding="1rem 6%"
      sx={{ position: "sticky", top: 0, zIndex: 1 }}
      backgroundColor={alt}
    >
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Socialelite
        </Typography>

        {/* show search bar only for mobile screens */}
        {isMobileScreen && (
          <IconButton onClick={() => setOpen(!open)}>
            <Search />
          </IconButton>
        )}

        {(open || isNonMobileScreens) && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
            />
            <IconButton>
              <Search />
            </IconButton>
            {search !== "" || open === true ? (
              <Box
                display="flex"
                flexDirection="column"
                position="absolute"
                backgroundColor="white"
                marginTop="15rem"
                borderRadius="10px"
                width="300px"
                boxShadow={4}
                p={1}
              >
                <IconButton
                  onClick={() => [setOpen(false), setSearch("")]}
                  style={{ alignSelf: "flex-end" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                {users?.length > 0 ? (
                  <Box>
                    {users.map((user1) =>
                      user1?.username.toLowerCase().includes(search) &&
                      user._id !== user1?.id ? (
                        <Link
                          key={user1?._id}
                          style={{ textDecoration: "none" }}
                          to={`/profile/${user1?._id}`}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            p={1} 
                            borderRadius="5px"
                            _hover={{
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              cursor: "pointer",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                alt="userImage"
                                src={`${user1?.picturePath}`}
                                sx={{ marginRight: 1 }}
                              />
                              <Typography
                                variant="subtitle2"
                                color={dark}
                              >
                                {user1?.username}
                              </Typography>
                            </Box>
                          </Box>
                        </Link>
                      ) : null
                    )}
                  </Box>
                ) : (
                  <Typography>User not found.</Typography>
                )}
              </Box>
            ) : null}
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme?.palette?.mode === "dark" ? (
              <LightMode sx={{ fontSize: "25px" }} />
            ) : (
              <DarkMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <Message
            onClick={()=>navigate("/message")}
            sx={{ fontSize: "25px", cursor: "pointer" }}
          />
          <Notifications onClick={()=> navigate('/notifications')} sx={{ fontSize: "25px",cursor:"pointer" }} />
          <Help sx={{ fontSize: "25px" }} />
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(setLogout());
                }}
              >
                Log Out
              </MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} onClick={()=>navigate("/message")} />
            <Notifications onClick={()=> navigate('/notifications')}  sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
