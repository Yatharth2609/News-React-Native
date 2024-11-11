import { NewsDataType } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  slideItem: NewsDataType;
  index: number;
  scrollX: SharedValue<number>;
  totalItems: number;
};

const { width } = Dimensions.get("screen");
const ITEM_WIDTH = width * 0.8; // Reduced width to show adjacent slides
const SPACING = 10;

const SliderItem = ({ slideItem, index, scrollX, totalItems }: Props) => {
  if (!slideItem) {
    return null;
  }

  const inputRange = [
    (index - 1) * width,
    index * width,
    (index + 1) * width,
  ];

  const rnStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.itemWrapper}>
      <Animated.View style={[styles.animatedContainer, rnStyle]}>
        {slideItem.image_url && (
          <Image
            source={{ uri: slideItem.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.background}
        >
          <View style={styles.contentContainer}>
            <View style={styles.sourceInfo}>
              {slideItem.source_icon && (
                <Image
                  source={{ uri: slideItem.source_icon }}
                  style={styles.sourceIcon}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.sourceName}>{slideItem.source_name}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {slideItem.title}
            </Text>
          </View>
        </LinearGradient>
        
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {Array(totalItems)
            .fill(0)
            .map((_, i) => {
              const dotStyle = useAnimatedStyle(() => {
                const scale = interpolate(
                  scrollX.value,
                  [(i - 1) * width, i * width, (i + 1) * width],
                  [0.8, 1.4, 0.8],
                  Extrapolation.CLAMP
                );
                const opacity = interpolate(
                  scrollX.value,
                  [(i - 1) * width, i * width, (i + 1) * width],
                  [0.4, 1, 0.4],
                  Extrapolation.CLAMP
                );
                return {
                  transform: [{ scale }],
                  opacity,
                };
              });

              return (
                <Animated.View
                  key={`dot-${i}`}
                  style={[styles.dot, dotStyle]}
                />
              );
            })}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    width: width,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedContainer: {
    width: ITEM_WIDTH,
    height: 180,
    marginHorizontal: SPACING,
  },
  image: {
    width: ITEM_WIDTH,
    height: 180,
    borderRadius: 10,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
    borderRadius: 10,
    justifyContent: "flex-end",
  },
  contentContainer: {
    padding: 15,
  },
  sourceInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sourceIcon: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  sourceName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -25,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginHorizontal: 4,
  },
});

export default SliderItem;