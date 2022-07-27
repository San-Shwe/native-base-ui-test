import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import dateFormat from "dateformat";
import Markdown from "react-native-markdown-display";
import * as Linking from "expo-linking";
import { getSinglePost } from "../api/post";
import RelatedPosts from "./RelatedPosts";
import { Divider } from "react-native-paper";

const { width } = Dimensions.get("window");

const MY_WEBSITE_LINK = "your_link.com"; // base url

const PostDetails = ({ route, navigation }) => {
  const post = route.params?.post;
  if (!post) return;
  const { title, thumbnail, tags, createAt, author, content } = post;

  useEffect(() => {
    console.log(route.params);
  }, []);

  const getImqage = (uri) => {
    if (uri) return { uri };
    return require("../assets/img/default-thumbnail.jpg");
  };

  const handleOnLinkPress = async (url) => {
    if (url.includes(MY_WEBSITE_LINK)) {
      console.log("yes include");
      const slug = url.split(MY_WEBSITE_LINK + "/")[1]; // get the sulug of link if the clicked link is in our post.
      if (!slug) return false;

      const { error, post } = await getSinglePost(slug);
      if (error) return console.log(error);

      navigation.push("PostDetails", { post });

      return false;
    }

    const res = await Linking.canOpenURL(url);
    if (res) {
      Linking.openURL(url);
    } else {
      Alert.alert("Invalid URL", "cannot open broken link");
    }
  };

  const fetchSinglePost = async (slug) => {
    console.log("SULG IS ", slug);
    const { error, post } = await getSinglePost(slug);
    if (error) return console.log(error);

    navigation.push("PostDetails", { post });
  };

  return (
    <ScrollView>
      <Image
        source={getImqage(thumbnail)}
        style={{ width, height: width / 1.7 }}
      />
      <View style={{ padding: 10 }}>
        <Text
          style={{
            color: "#383838",
            fontSize: 20,
            fontWeight: "700",
            marginVertical: 10,
          }}
        >
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#827e7e" }}>By {author}</Text>
          <Text style={{ color: "#827e7e" }}>
            {dateFormat(createAt, "mediumDate")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: "#827e7e" }}>Tags </Text>
          {tags.map((tag, index) => (
            <Text selectable style={{ color: "#3A5BA0" }} key={tag + index}>
              {" "}
              #{tag}
            </Text>
          ))}
        </View>
        <Markdown
          onLinkPress={handleOnLinkPress}
          style={{
            paragraph: { lineHeight: 22, color: "#545050", letterSpacing: 0.8 },
            body: { fontSize: 16 },
            link: { color: "#7784f8" },
          }}
        >
          {content}
        </Markdown>
      </View>
      <View style={{ marginTop: 15, marginBottom: 3, paddingHorizontal: 10 }}>
        <Text
          style={{
            color: "#383838",
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          Related Post
        </Text>
        <Divider />
        <View>
          <RelatedPosts onPostPress={fetchSinglePost} postId={post.id} />
        </View>
      </View>
    </ScrollView>
  );
};

export default PostDetails;

const styles = StyleSheet.create({});
