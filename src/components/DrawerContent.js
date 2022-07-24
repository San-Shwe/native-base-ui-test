import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";

import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Drawer,
  Paragraph,
  Switch,
  TouchableRipple,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AuthContext } from "./context";

const DrawerContent = (props) => {
  // get current Theme
  const paperTheme = useTheme();
  const { colors } = useTheme();
  const theme = useTheme();

  const { signOut, toggleTheme } = React.useContext(AuthContext);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={theme.dark ? "light-content" : "light-content"} />
      <DrawerContentScrollView {...props}>
        <View styles={styles.drawerContent}>
          {/* User Information Section  */}
          {/* <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={{
                  uri: "https://avatars.githubusercontent.com/u/65032357?s=400&u=6770328fbbadb098d0ec17fd9b3844d9f73bccb6&v=4",
                }}
                size={50}
              />
              <View style={{ flexDirection: "column", marginLeft: 15 }}>
                <Title style={styles.title}>San Shwe</Title>
                <Caption style={styles.caption}>@san-shwe</Caption>
              </View>
            </View>
          </View> */}

          {/* Followers and Following Section  */}
          {/* <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                80
              </Paragraph>
              <Caption style={styles.caption}>Following</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                150
              </Paragraph>
              <Caption style={styles.caption}>Follower</Caption>
            </View>
          </View> */}

          {/* Other Sections */}
          <Drawer.Section>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate("HomeScreen");
              }}
            />
          </Drawer.Section>
          {/* <Drawer.Section>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => {
                props.navigation.navigate("Profile");
              }}
            />
          </Drawer.Section> */}
          <Drawer.Section>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="cog-outline" color={color} size={size} />
              )}
              label="Setting"
              onPress={() => {
                props.navigation.navigate("Profile");
              }}
            />
          </Drawer.Section>
          <Drawer.Section>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="lifebuoy" color={color} size={size} />
              )}
              label="Support"
              onPress={() => {
                props.navigation.navigate("Support");
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>

      {/* Preferences */}
      <Drawer.Section title="Preferences">
        <TouchableRipple
          onPress={() => {
            toggleTheme();
          }}
        >
          <View style={styles.preference}>
            <Text style={{ color: colors.text }}>Dark Theme</Text>
            <View pointerEvents="none">
              <Switch value={paperTheme.dark} />
            </View>
          </View>
        </TouchableRipple>
      </Drawer.Section>
      {/* Footer Logout Section  */}
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
            signOut();
          }}
        />
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: { paddingLeft: 20 },
  title: { fontSize: 16, marginTop: 3, fontWeight: "bold" },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopWidth: 1,
  },
  userInfoSection: { paddingLeft: 20 },
  title: { fontSize: 16, marginTop: 3, fontWeight: "bold" },
  caption: { fontSize: 14, lineHeight: 14 },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  section: { flexDirection: "row", alignItems: "center", marginRight: 15 },
  paragraph: { fontWeight: "bold" },
  drawerSection: { marginTop: 15 },
  preference: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default DrawerContent;
