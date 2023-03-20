import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  isEditing: false,
  isMessage: false,
  suggestions:[],
  ids:{},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.token = action.payload.token;
    },
    setUserData: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFollowings: (state, action) => {
      if (state.user) {
        state.user.followings = action.payload.followings;
      } else {
        console.log("user friends non-existent");
      }
    },
    setFollowers: (state, action) => {
      if (state.user) {
        state.user.followers = action.payload.followers;
      } else {
        console.log("user friends non-existent");
      }
    },
    setProfileImg: (state, action) => {
      if (state.user) {
        state.user.picturePath = action.payload.picturePath;
      } else {
        console.log("user image error");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload.isEditing;
    },
    setIsMessage: (state, action) => {
      state.isMessage = action.payload.isMessage;
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload.suggestions;
    },
    setIds: (state, action) => {
      state.ids = action.payload.ids;
    },
  },
});

export const {
  setFollowings,
  setFollowers,
  setSuggestions,
  setMode,
  setLogin,
  setLogout,
  setPosts,
  setPost,
  setUserData,
  setProfileImg,
  setIsEditing,
  setIsMessage,
  setIds,
} = authSlice.actions;
export default authSlice.reducer;
