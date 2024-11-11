import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import { NewsDataType } from '@/types'
import axios from 'axios'
import BreakingNews from '@/components/BreakingNews'
import Categories from '@/components/Categories'
import NewsList from '@/components/NewsList'
import Loading from '@/components/Loading'

const Page = () => {
  const { top: safeTop } = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);
  const [News, setNews] = useState<NewsDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('');

  useEffect(() => {
    getBreakingNews();
    getNews();
  }, [])

  const getBreakingNews = async () => {
    try {
      setLoading(true);
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&language=en,hi&image=1&removeduplicate=1&size=5`;
      const response = await axios.get(URL);

      if (response?.data?.results) {
        // Filter out items without images
        const newsWithImages = response.data.results.filter(
          (item: NewsDataType) => item.image_url
        );
        setBreakingNews(newsWithImages);
      }
    } catch (error: any) {
      console.error('Error fetching breaking news:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const getNews = async (category: string = '') => {
    try {
      setLoading(true);
      // Build the URL with category parameter if category is provided
      let URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&language=en,hi&image=1&removeduplicate=1&size=10`;
      
      if (category && category.length > 0) {
        URL += `&category=${category}`;
      }

      const response = await axios.get(URL);

      if (response?.data?.results) {
        // Filter out items without images
        const newsWithImages = response.data.results.filter(
          (item: NewsDataType) => item.image_url
        );
        setNews(newsWithImages);
      }
    } catch (error: any) {
      console.error('Error fetching news:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const onCatChanged = async (category: string) => {
    console.log('Category:', category);
    setCurrentCategory(category);
    setNews([]); // Clear current news before loading new ones
    await getNews(category);
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <SearchBar />
      {loading ? (
        <View style={styles.loadingContainer}>
          <Loading size={'large'} color="#0000ff"/>
        </View>
      ) : (
        <>
          <BreakingNews newsList={breakingNews} />
          <Categories onCategoryChanged={onCatChanged} selectedCategory={currentCategory} />
          <NewsList newsList={News} />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200, // Add minimum height to make loading spinner visible
  }
});

export default Page;