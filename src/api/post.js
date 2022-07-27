import client from "./client";

export const getFeaturedPosts = async () => {
  try {
    const { data } = await client("/post/featured-posts");
    return data;
  } catch (error) {
    const { response } = error;
    // return backend api error
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const getLatestPosts = async (limit, pageNo) => {
  try {
    const { data } = await client(
      `/post/posts?limit=${limit}&pageNo=${pageNo}`
    );
    return data;
  } catch (error) {
    const { response } = error;
    // return backend api error
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const getSinglePost = async (slug) => {
  try {
    const { data } = await client(`/post/single/${slug}`);
    return data;
  } catch (error) {
    const { response } = error;
    // return backend api error
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const getRelatedPosts = async (slug) => {
  try {
    const { data } = await client(`/post/related-posts/${slug}`);
    return data;
  } catch (error) {
    const { response } = error;
    // return backend api error
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};
