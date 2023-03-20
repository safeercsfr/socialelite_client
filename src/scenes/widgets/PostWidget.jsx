import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state/authSlice";
import { patchDataAPI, postDataAPI } from "utils/fetchData";
import * as Yup from "yup";
import TimeAgo from 'timeago.js';

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.token);
  const loggedInUserId = useSelector((state) => state?.user?._id);
  const [isLiked, setIsLiked] = useState(
    Boolean(likes[loggedInUserId])
  );
  const likeCount = Object?.keys(likes)?.length;
  const { palette } = useTheme();
  const main = palette?.neutral?.main;
  const primary = palette?.primary?.main;
  const timeago = new TimeAgo()

  const validationSchema = Yup.object().shape({
    comment: Yup.string()
      .required("Comment is required")
      .matches(/^\S.*$/, "Field must not start with white space"),
  });
  const patchLike = async () => {
    try {
      setIsLiked(!isLiked);
      const { data } = await patchDataAPI(
        `/posts/${postId}/like`,
        loggedInUserId,
        token
      );
      const updatedPost = data;
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    setErrors({});
  };

  const handleCommentSubmit = async (event) => {
    try {
      event.preventDefault();
      const values = { comment };
      await validationSchema.validate(values, { abortEarly: false });

      const { data } = await postDataAPI(
        `/posts/${postId}/comment`,
        { userId: loggedInUserId, comment },
        token
      );
      const updatedPost = data;
      dispatch(setPost({ post: updatedPost }));
      setComment("");
      setErrors({});
    } catch (error) {
      if (error?.name === "ValidationError") {
        const errors = error.inner.reduce(
          (acc, err) => ({
            ...acc,
            [err.path]: err.message,
          }),
          {}
        );
        setErrors(errors);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={timeago.format(createdAt) }
        userPicturePath={userPicturePath}
        postId={postId}
        
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picturePath}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments?.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          <Box
            sx={{
              maxHeight: "10rem",
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {comments?.map((comment, i) => (
              <Box key={`${i}`}>
                <Divider />
                <Typography
                  sx={{
                    color: main,
                    m: "0.5rem 0",
                    pl: "1rem",
                    display: "flex",
                  }}
                >
                  <Avatar
                    sx={{ width: 30, height: 30, marginRight: "1rem" }}
                    alt="user Image"
                    src={comment?.author?.picturePath}
                  />
                  <strong>
                    {comment?.author?.username}{" "}
                  </strong>
                  <Box
                    sx={{
                      marginLeft: "0.65rem",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "68%",
                      textAlign: "right",
                    }}
                  >
                    <Typography>{comment?.coment}</Typography>
                    <Box sx={{ textAlign: "end" }}>
                      <Typography component="p" fontSize={10}>
                      {timeago.format(comment?.createdAt) }
                      </Typography>
                    </Box>
                  </Box>
                </Typography>
              </Box>
            ))}
          </Box>

          <form onSubmit={handleCommentSubmit}>
            <Box sx={{ mt: "1rem" }}>
              <Box sx={{ display: "flex" }}>
                <TextField
                  label="Add comment"
                  value={comment}
                  onChange={handleCommentChange}
                  error={Boolean(errors?.comment)}
                  helperText={errors?.comment}
                  fullWidth
                  maxRows={1}
                  sx={{
                    borderRadius: "20px",
                    "& fieldset": {
                      border: "none",
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
                <Button type="submit" sx={{ ml: "1rem" }}>
                  Post
                </Button>
              </Box>
            </Box>
          </form>
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
