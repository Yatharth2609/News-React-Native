import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {};

const Header = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }}
          style={styles.userImage}
        />
        <View style={{ gap: 3 }}>
            <Text style={styles.weltxt}>Welcome</Text>
            <Text style={styles.usertxt}>John Doe!</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => {}} />
      <Ionicons name="notifications-outline" size={24} color={Colors.black} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  weltxt: {
    fontSize: 12,
    color: Colors.darkGrey,
  },
  usertxt: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  }
});

export default Header;
