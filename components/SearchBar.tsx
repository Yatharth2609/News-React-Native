import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  withHorizontalPadding: boolean;
  setSearchQuery: Function;
};

const SearchBar = ({ withHorizontalPadding, setSearchQuery }: Props) => {
  return (
    <View
      style={[
        styles.container,
        withHorizontalPadding && { paddingHorizontal: 20 },
      ]}
    >
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color={Colors.lightGrey} />
        <TextInput
          placeholder="Search"
          placeholderTextColor={Colors.lightGrey}
          style={styles.searchText}
          autoCapitalize="none"
          onChangeText={query => setSearchQuery(query)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: "#E4E4E4",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    gap: 10,
  },
  searchText: {
    fontSize: 14,
    flex: 1,
    color: Colors.darkGrey,
  },
});

export default SearchBar;
