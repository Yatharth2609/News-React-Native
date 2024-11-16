import { Colors } from "@/constants/Colors";
import { NewsDataType } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ViewToken,
  useWindowDimensions,
} from "react-native";
import SliderItem from "@/components/SliderItem";
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Pagination from "@/components/Pagination";

type Props = {
  newsList: Array<NewsDataType>;
};

const { width } = Dimensions.get("screen");

const BreakingNews = ({ newsList }: Props) => {
  const [data, setData] = useState(newsList);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useAnimatedRef<Animated.FlatList<NewsDataType>>();
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const interval = useRef<NodeJS.Timeout>();
  const offset = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (e) => {
      offset.value = e.contentOffset.x;
    },
  });

  useEffect(() => {
    if (isAutoPlay === true) {
      interval.current = setInterval(() => {
        offset.value = offset.value + width;
      }, 5000);
    } else {
      clearInterval(interval.current);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [isAutoPlay, offset, width]);

  useDerivedValue(() => {
    scrollTo(flatListRef, offset.value, 0, true);
  });

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (
      viewableItems[0].index !== undefined &&
      viewableItems[0].index !== null
    ) {
      setPaginationIndex(viewableItems[0].index % newsList.length);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  if (!newsList || newsList.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breaking News</Text>
      <View style={styles.slideWrapper}>
        <Animated.FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(item, index) => `news-${index}-${item?.title || ""}`}
          renderItem={({ item, index }) => (
            <SliderItem
              slideItem={item}
              index={index}
              scrollX={scrollX}
              totalItems={newsList.length}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={onScrollHandler}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={width}
          contentContainerStyle={styles.flatListContent}
          onEndReachedThreshold={0.5}
          onEndReached={() => setData([...data, ...newsList])}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          onScrollBeginDrag={() => {
            setIsAutoPlay(false);
          }}
          onScrollEndDrag={() => {
            setIsAutoPlay(true);
          }}
        />
        <Pagination
          paginationIndex={paginationIndex}
          scrollX={scrollX}
          items={newsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  slideWrapper: {
    height: 220,
  },
  flatListContent: {
    alignItems: "center",
  },
});

export default BreakingNews;
