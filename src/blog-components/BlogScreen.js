import { useState, useEffect, useCallback } from "react";
import { Text, FlatList, View } from "react-native";
import { Divider } from "react-native-paper";
import Slider from "./Slider";
import PostListItem from "./PostListItem";
import { getFeaturedPosts, getLatestPosts, getSinglePost } from "../api/post";
import { useNetInfo } from "@react-native-community/netinfo";
import { useTheme, ActivityIndicator } from "react-native-paper";

import Constants from "expo-constants"; // to get system information
import NoInternet from "./NoInternet";
let pageNo = 0;
const limit = 5;

export default function BlogScreen({ navigation }) {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [reachToEnd, setReachToEnd] = useState(false);
  const [busy, setBusy] = useState(false);
  const netInfo = useNetInfo();
  const [noInternet, setNoInternet] = useState(false);

  const fetchFeaturedPosts = async () => {
    const { error, post } = await getFeaturedPosts();
    if (error) return console.log("error is ", error);
    // console.log("featured post is ", post);
    setFeaturedPosts(post);
  };

  const fetchLatestPosts = async () => {
    const { error, posts } = await getLatestPosts(limit, pageNo);

    if (error) console.log("error is ", error);

    setLatestPosts(posts);
  };

  const fetchMorePosts = async () => {
    console.log("fetch more");
    if (reachToEnd || busy) return;
    pageNo += 1;
    setBusy(true);
    const { error, posts, postCount } = await getLatestPosts(limit, pageNo);
    setBusy(false);
    if (error) console.log("error is ", error);
    if (latestPosts.length === postCount) return setReachToEnd(true);
    setLatestPosts([...latestPosts, ...posts]);
  };

  const fetchSinglePost = async (slug) => {
    const { error, post } = await getSinglePost(slug);
    if (error) return console.log(error);
    console.log(post);
    navigation.navigate("PostDetails", { post });
  };

  const fetchNetInfo = () => {
    const { isConnected, isInternetReachable } = netInfo;
    if (isConnected === false && isInternetReachable === false) {
      setNoInternet(true);
    } else {
      setNoInternet(false);
    }
  };

  useEffect(() => {
    fetchNetInfo();
  }, [netInfo]);

  useEffect(() => {
    fetchFeaturedPosts();
    fetchLatestPosts();

    return () => {
      pageNo = 0;
      setReachToEnd(false);
    };
  }, []);

  const ListHeaderComponent = useCallback(() => {
    const { colors } = useTheme();

    return (
      <View style={{ paddingTop: Constants.statusBarHeight }}>
        {featuredPosts.length ? (
          <Slider
            data={featuredPosts}
            onSliderPress={fetchSinglePost}
            title="Featured Posts"
          />
        ) : null}
        <Divider />
        <View style={{ marginTop: 15, marginBottom: 3 }}>
          <Text
            style={{ color: colors.subTxt, fontSize: 20, fontWeight: "700" }}
          >
            Latest Post
          </Text>
        </View>
      </View>
    );
  }, [featuredPosts]); // this list header component will only run when featuredpost is change | we need to run this component just once

  const renderItem = ({ item }) => {
    return (
      <View>
        <PostListItem
          post={item}
          navigateTo={() => {
            fetchSinglePost(item.slug);
          }}
        />
      </View>
    );
  };

  const ItemSeparatorComponent = () => (
    <View style={{ paddingVertical: 10 }}>
      <Divider />
    </View>
  );

  if (noInternet) return <NoInternet onRefreshPress={fetchNetInfo} />;

  if (busy) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={latestPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ marginHorizontal: 10, paddingBottom: 20 }}
        ListHeaderComponent={ListHeaderComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={renderItem}
        onEndReached={async () => {
          await fetchMorePosts();
        }}
        // onEndReachedThreshold={0}
        ListFooterComponent={() => {
          return reachToEnd ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "gray",
                  textAlign: "center",
                  paddingVertical: 20,
                  marginEnd: 20,
                }}
              >
                Reach To End
              </Text>
              <ActivityIndicator size="small" />
            </View>
          ) : null;
        }}
      />
    </View>
  );
}
