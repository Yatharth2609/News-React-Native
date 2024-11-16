import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "@/components/SearchBar";
import { Colors } from "@/constants/Colors";
import newsCategoryList from "@/constants/Categories";
import Checkbox from "@/components/Checkbox";
import { useNewsCategories } from "@/hooks/useNewsCategories";
import { useNewsCountry } from "@/hooks/useNewsContry";
import { Link } from "expo-router";

type Props = {};

const Page = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets();

  const { newsCategories, toggleNewsCategories } = useNewsCategories();
  const { newsCountry, toggleNewsCountry } = useNewsCountry();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");

  return (
    <View style={[styles.container, { paddingTop: safeTop + 20 }]}>
      <SearchBar
        withHorizontalPadding={false}
        setSearchQuery={setSearchQuery}
      />
      <Text style={styles.title}>Categories</Text>
      <View style={styles.listContainer}>
        {newsCategories.map((item) => (
          <Checkbox
            key={item.id}
            label={item.title}
            checked={item.selected}
            onPress={() => {
              toggleNewsCategories(item.id);
              setCategory(item.slug);
            }}
          />
        ))}
      </View>

      <Text style={styles.title}>Countries</Text>
      <View style={styles.listContainer}>
        {newsCountry.map((item, index) => (
          <Checkbox
            key={index}
            label={item.name}
            checked={item.selected}
            onPress={() => {
              toggleNewsCountry(index);
              setCountry(item.code);
            }}
          />
        ))}
      </View>

      <Link href={{ pathname: `/news/search`, params: { query: searchQuery, category, country } }} asChild>
        <TouchableOpacity style={styles.searchBtnTxt}>
          <Text style={styles.test}>Search</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  searchBtnTxt: {
    backgroundColor: Colors.tint,
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
  },
  test: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
