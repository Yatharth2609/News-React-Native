import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { NewsDataType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import { NewsItem } from "@/components/NewsList";

type Props = {};

const Page = (props: Props) => {
  const { query, category, country } = useLocalSearchParams<{
    query: string;
    category: string;
    country: string;
  }>();

  const [News, setNews] = useState<NewsDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews();
  }, []);

  const getNews = async () => {
    try {
      setLoading(true);
      // Build the URL with category parameter if category is provided
      let URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&language=en,hi&image=1&removeduplicate=1&size=10`;

      if (category && category.length > 0) {
        URL += `&category=${category}`;
      }
      if (country && country.length > 0) {
        URL += `&country=${country}`;
      }
      if (query && query.length > 0) {
        URL += `&q=${query}`;
      }

      console.log(URL);

      const response = await axios.get(URL);

      if (response?.data?.results) {
        // Filter out items without images
        const newsWithImages = response.data.results.filter(
          (item: NewsDataType) => item.image_url
        );
        setNews(newsWithImages);
      }
    } catch (error: any) {
      console.error("Error fetching news:", error.message);
    } finally {
      setLoading(false);
    }
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
          title: "Search",
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <Loading size={24} color={"#0000ff"} />
        ) : (
          <FlatList
            data={News}
            keyExtractor={(_, index) => `list_item${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ index, item }) => {
              return (
                <Link href={`/news/${item.article_id}`} asChild key={index}>
                  <TouchableOpacity>
                    <NewsItem item={item} />
                  </TouchableOpacity>
                </Link>
              );
            }}
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
    marginHorizontal: 20,
    marginVertical: 20,
  },
});
