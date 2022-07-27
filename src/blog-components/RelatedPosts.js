import { View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import PostListItem from "./PostListItem";
import { getRelatedPosts, getSinglePost } from "../api/post";

const RelatedPosts = ({ postId, onPostPress }) => {
  const [posts, setPosts] = useState([]);

  const fetchRelatedPosts = async () => {
    const { error, posts } = await getRelatedPosts(postId);
    if (error) console.log(error);

    setPosts([...posts]);
  };

  useEffect(() => {
    fetchRelatedPosts();
  }, [postId]);

  return posts.map((post) => {
    return (
      <View
        key={post.id}
        style={{
          marginTop: 10,
        }}
      >
        <PostListItem
          post={post}
          navigateTo={() => {
            onPostPress(post.slug);
          }}
        />
      </View>
    );
  });
};

export default RelatedPosts;
