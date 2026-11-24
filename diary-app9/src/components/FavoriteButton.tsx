import { useEffect, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ViewStyle } from "react-native";
import { SymbolView } from "expo-symbols";

type FavoriteButtonProps = {
  liked: boolean;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  label?: string;
  style?: ViewStyle;
};

export default function FavoriteButton({
  liked,
  onPress,
  disabled = false,
  label,
  style,
}: FavoriteButtonProps) {
  const [progress] = useState(() => new Animated.Value(liked ? 1 : 0));

  useEffect(() => {
    animateFavorite(progress, liked);
  }, [liked, progress]);

  const handlePress = () => {
    animateFavorite(progress, !liked);
    try {
      const result = onPress();
      if (result) {
        void result.catch(() => animateFavorite(progress, liked));
      }
    } catch {
      animateFavorite(progress, liked);
    }
  };

  const filledStyle = {
    opacity: progress,
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.72, 1],
        }),
      },
    ],
  };
  const outlineStyle = {
    opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.82],
        }),
      },
    ],
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? (liked ? "Hapus dari favorit" : "Tambah ke favorit")}
      accessibilityState={{ disabled, selected: liked }}
      disabled={disabled}
      onPress={handlePress}
      style={[styles.button, style, disabled && styles.disabled]}
    >
      <View style={styles.icon}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.iconCenter, outlineStyle]}>
          <SymbolView
            name={{ ios: "heart", android: "favorite_border", web: "favorite_border" }}
            tintColor="#94A3B8"
            size={26}
          />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, styles.iconCenter, filledStyle]}>
          <SymbolView
            name={{ ios: "heart.fill", android: "favorite", web: "favorite" }}
            tintColor="#EF4444"
            size={26}
          />
        </Animated.View>
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

function animateFavorite(progress: Animated.Value, liked: boolean) {
  Animated.spring(progress, {
    toValue: liked ? 1 : 0,
    speed: 20,
    bounciness: 7,
    useNativeDriver: true,
  }).start();
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  icon: {
    width: 28,
    height: 28,
  },
  iconCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#111827",
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.65,
  },
});
