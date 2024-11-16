import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { NewsDataType } from "@/types";
import axios from "axios";
import Loading from "@/components/Loading";
import { Colors } from "@/constants/Colors";
import Moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewsDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [news, setNews] = useState<NewsDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    getNews();
    checkBookmarkStatus();
  }, [id]);

  const getNews = async () => {
    try {
      setLoading(true);
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${id}`;
      const response = await axios.get(URL);

      if (response?.data?.results && response.data.results.length > 0) {
        const newsItem = response.data.results[0];
        if (newsItem.image_url) {
          setNews(newsItem);
        }
      }
    } catch (error: any) {
      console.error("Error fetching news:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const bookmarksStr = await AsyncStorage.getItem("bookmark");
      if (bookmarksStr) {
        const bookmarks = JSON.parse(bookmarksStr);
        setBookmark(bookmarks.includes(id));
      } else {
        setBookmark(false);
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      setBookmark(false);
    }
  };

  const saveBookmark = async () => {
    try {
      const bookmarksStr = await AsyncStorage.getItem("bookmark");
      let bookmarks: string[] = [];
      
      if (bookmarksStr) {
        bookmarks = JSON.parse(bookmarksStr);
      }

      if (!bookmarks.includes(id)) {
        bookmarks.push(id);
        await AsyncStorage.setItem("bookmark", JSON.stringify(bookmarks));
        setBookmark(true);
        alert("News Saved!");
      }
    } catch (error) {
      console.error("Error saving bookmark:", error);
    }
  };

  const removeBookmark = async () => {
    try {
      const bookmarksStr = await AsyncStorage.getItem("bookmark");
      if (bookmarksStr) {
        const bookmarks = JSON.parse(bookmarksStr);
        const updatedBookmarks = bookmarks.filter((bookmarkId: string) => bookmarkId !== id);
        await AsyncStorage.setItem("bookmark", JSON.stringify(updatedBookmarks));
        setBookmark(false);
        alert("News Unsaved!");
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  if (loading) {
    return <Loading size="large" color="#0000ff" />;
  }

  if (!news) {
    return (
      <View style={styles.container}>
        <Text>No news found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => (bookmark ? removeBookmark() : saveBookmark())}
            >
              <Ionicons
                name={bookmark ? "heart" : "heart-outline"}
                size={22}
                color={bookmark ? "red" : Colors.black}
              />
            </TouchableOpacity>
          ),
          title: "",
        }}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
        <Text style={styles.title}>{news.title}</Text>
        <View style={styles.newsInfoWrapper}>
          <Text style={styles.newsInfo}>
            {Moment(news.pubDate).format("MMMM DD, hh:mm a")}
          </Text>
          <Text style={styles.newsInfo}>{news.source_name}</Text>
        </View>
        <Image source={{ uri: news.image_url }} style={styles.imgSource} />
        <Text style={styles.newsContent}>{news.description}</Text>
      </ScrollView>
    </>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  imgSource: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  newsInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  newsInfo: {
    fontSize: 12,
    color: Colors.darkGrey,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginVertical: 10,
    letterSpacing: 0.6,
  },
  newsContent: {
    fontSize: 14,
    color: "#555",
    letterSpacing: 0.8,
    lineHeight: 22,
  },
});