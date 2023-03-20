import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state/authSlice";
import { postDataAPI } from "utils/fetchData";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { palette } = useTheme();
  const _id = useSelector((state) => state?.user?._id);
  const token = useSelector((state) => state?.token);
  const posts = useSelector((state) => state?.posts);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const mediumMain = palette?.neutral?.mediumMain;
  const medium = palette?.neutral?.medium;

  const postSchema = Yup.object().shape({
    post: Yup.string()
      .required("Comment is required")
      .matches(/^\S.*$/, "Field must not start with white space"),
  });

  const handlePost = async () => {
    try {
      await postSchema.validate({ post }, { abortEarly: false });

      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        setLoading(true);
        formData.append("picture", image);
        formData.append("picturePath", image?.name);
      }

      const { data } = await postDataAPI("/posts", formData, token);
      dispatch(setPosts({ posts: [data, ...posts] }));
      setImage(null);
      setPost("");
      setLoading(false);
      setErrors({});
    } catch (error) {
      console.error(error);
      if (error.name === "ValidationError") {
        const errors = error?.inner?.reduce(
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
  const handleChange = (e) => {
    setErrors({});
    setPost(e.target.value);
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={handleChange}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette?.neutral?.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
            border: errors.post ? "1px solid red" : "none", // add border style for error
          }}
        />
      </FlexBetween>
      {errors?.post && (
        <Typography
          color="red"
          sx={{
            marginTop: "0.5rem",
            textAlign: "center",
          }}
        >
          {errors?.post}
        </Typography>
      )}
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            accept={["image/jpeg", "image/png"]}
            multiple={false}
            onDrop={(acceptedFiles) => {
              setImage(acceptedFiles[0]);
            }}
            onDropRejected={(rejectedFiles) => {
              alert("Please upload only JPEG or PNG files.");
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette?.primary?.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <img
                        style={{ width: "6rem", height: "4rem" }}
                        src={URL.createObjectURL(image)}
                        alt="PostImage"
                      />
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}
      <Divider sx={{ margin: "1.25rem 0" }} />
      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            {/* <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween> */}
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}
        <LoadingButton
          loading={loading}
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette?.background?.alt,
            backgroundColor: palette?.primary?.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </LoadingButton>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
