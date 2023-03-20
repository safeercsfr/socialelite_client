import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state/authSlice";
import PostWidget from "./PostWidget";
import { getDataAPI } from "utils/fetchData";
import WidgetWrapper from "components/WidgetWrapper";
import { CameraAltOutlined } from "@mui/icons-material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state?.posts);
  const token = useSelector((state) => state?.token);

  const getPosts = async () => {
    try {
      const { data } = await getDataAPI("/posts", token);
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error(error);
    }
  };

  const getUserPosts = async () => {
    try {
      const { data } = await getDataAPI(`/posts/${userId}/posts`, token);
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Only render posts if there are posts to display
  return (
    <>
      {posts?.length > 0 ? (
        posts?.map(
          ({
            _id,
            author,
            content,
            image,
            likes,
            comments,
            createdAt,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={author?._id}
              name={author?.username}
              description={content}
              picturePath={image}
              userPicturePath={author?.picturePath}
              likes={likes}
              comments={comments}
              createdAt={createdAt}
              isProfile
            />
          )
        )
      ) : (
        <WidgetWrapper m="2rem 0">
          <Box display="flex" flexDirection="column" alignItems="center">
            <CameraAltOutlined
              sx={{ fontSize: "4rem", color: "grey.500", mb: "1rem" }}
            />
            <Typography variant="h6" sx={{ mb: "1rem" }}>
              No posts to display
            </Typography>
          </Box>
        </WidgetWrapper>
      )}
    </>
  );
};

export default PostsWidget;
