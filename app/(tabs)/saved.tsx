import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { NewsDataType } from "@/types";
import { Link, Stack } from "expo-router";
import Loading from "@/components/Loading";
import { NewsItem } from "@/components/NewsList";
import { useIsFocused } from "@react-navigation/native";

const Page = () => {
  const [bookmarkNews, setBookmarkNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchBookmark();
    }
  }, [isFocused]);

  const fetchBookmark = async () => {
    try {
      setIsLoading(true);
      const bookmarksStr = await AsyncStorage.getItem("bookmark");
      
      if (bookmarksStr) {
        const bookmarks = JSON.parse(bookmarksStr);
        if (bookmarks.length > 0) {
          const query_string = bookmarks.join(",");
          const response = await axios.get(
            `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${query_string}`
          );
          
          if (response?.data?.results) {
            const newsWithImages = response.data.results.filter(
              (item: NewsDataType) => item.image_url
            );
            setBookmarkNews(newsWithImages);
          }
        } else {
          setBookmarkNews([]);
        }
      } else {
        setBookmarkNews([]);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setBookmarkNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Saved News",
        }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <Loading size={24} color="#0000ff" />
        ) : bookmarkNews.length === 0 ? (
          <Text style={styles.emptyText}>No saved news articles</Text>
        ) : (
          <FlatList
            data={bookmarkNews}
            keyExtractor={(item) => item.article_id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Link href={`/news/${item.article_id}`} asChild>
                <TouchableOpacity>
                  <NewsItem item={item} />
                </TouchableOpacity>
              </Link>
            )}
          />
        )}
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});