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

type Props = {};

const NewsDetails = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [News, setNews] = useState<NewsDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    getNews();
  }, []);

  useEffect(() => {
    if(!loading)
    renderBookmark(News[0].article_id);
  }, [loading]);

  const getNews = async () => {
    try {
      setLoading(true);
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${id}`;
      const response = await axios.get(URL);

      if (response?.data?.results) {
        // Filter out items without images
        const newsWithImages = response.data.results.filter(
          (item: NewsDataType) => item.image_url
        );
        setNews(newsWithImages);
      }
    } catch (error: any) {
      console.error("Error fetching breaking news:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveBookmark = async (newsId: string) => {
    setBookmark(true);
    await AsyncStorage.getItem("boookmark").then((token: any) => {
      const res = JSON.parse(token);
      if (res !== null) {
        let data = res.find((value: string) => value === newsId);
        if (data === null) {
          res.push(newsId);
          AsyncStorage.setItem("bookmark", JSON.stringify(res));
          alert("News Saved!!");
        }
      } else {
        let bookmark = [];
        bookmark.push(newsId);
        AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
        alert("News Saved!!");
      }
    });
  };

  const removeBookmark = async (newsId: string) => {
    setBookmark(false);
    const bookmark = await AsyncStorage.getItem("bookmark").then(
      (token: any) => {
        const res = JSON.parse(token);
        return res.filter((id: string) => id !== newsId);
      }
    );
    await AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
    alert("News Unsaved!!");
  };

  const renderBookmark = async (newsId: string) => {
    await AsyncStorage.getItem("bookmark").then((token: any) => {
      const res = JSON.parse(token);
      if (res !== null) {
        let data = res.find((value: string) => value === newsId);
        return data === null ? setBookmark(false) : setBookmark(true);
      }
    });
  };

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
              onPress={() =>
                bookmark
                  ? removeBookmark(News[0].article_id)
                  : saveBookmark(News[0].article_id)
              }
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
      {loading ? (
        <Loading size={"large"} color="#0000ff" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
        >
          <Text style={styles.title}>{News[0].title}</Text>
          <View style={styles.newsInfoWrapper}>
            <Text style={styles.newsInfo}>
              {Moment(News[0].pubDate).format("MMMM DD, hh:mm a")}
            </Text>
            <Text style={styles.newsInfo}>{News[0].source_name}</Text>
          </View>
          <Image source={{ uri: News[0].image_url }} style={styles.imgSource} />

          <Text style={styles.newsContent}>{News[0].description}</Text>
        </ScrollView>
      )}
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
