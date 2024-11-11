import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import newsCategoryList from "@/constants/Categories";

type Props = {
  onCategoryChanged: (category: string) => void;
  selectedCategory: string;
};

const Categories = ({ onCategoryChanged, selectedCategory }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsLayout = useRef<{ [key: number]: number }>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  // Update activeIndex when selectedCategory changes from parent
  useEffect(() => {
    const categoryIndex = newsCategoryList.findIndex(
      (item) => item.slug === selectedCategory
    );
    if (categoryIndex !== -1) {
      setActiveIndex(categoryIndex);
      scrollToCategory(categoryIndex);
    }
  }, [selectedCategory]);

  const scrollToCategory = (index: number) => {
    const itemOffset = itemsLayout.current[index] || 0;
    const scrollToX = Math.max(0, itemOffset - 20 - (scrollViewWidth / 2 - 50));

    scrollRef.current?.scrollTo({
      x: scrollToX,
      y: 0,
      animated: true,
    });
  };

  const handleSelectCategory = (index: number) => {
    setActiveIndex(index);
    scrollToCategory(index);
    onCategoryChanged(newsCategoryList[index].slug);
  };

  const handleItemLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    itemsLayout.current[index] = x;
  };

  const handleScrollViewLayout = (event: LayoutChangeEvent) => {
    setScrollViewWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.itemsWrapper}
        onLayout={handleScrollViewLayout}
        scrollEventThrottle={16}
      >
        {newsCategoryList.map((item, index) => (
          <TouchableOpacity
            key={`category-${item.title}-${index}`}
            style={[
              styles.item,
              activeIndex === index && styles.itemActive,
            ]}
            onLayout={(event) => handleItemLayout(index, event)}
            onPress={() => handleSelectCategory(index)}
          >
            <Text
              style={[
                styles.itemText,
                activeIndex === index && styles.itemActiveText,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  itemsWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 12,
  },
  item: {
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 8,
    minWidth: 80, // Added to ensure consistent button sizes
    alignItems: 'center', // Center text horizontally
  },
  itemActive: {
    backgroundColor: Colors.tint,
    borderColor: Colors.tint,
  },
  itemText: {
    fontSize: 14,
    color: Colors.darkGrey,
    letterSpacing: 0.5,
    textAlign: 'center', // Center text
  },
  itemActiveText: {
    fontWeight: "600",
    color: "white",
  },
});

export default Categories;