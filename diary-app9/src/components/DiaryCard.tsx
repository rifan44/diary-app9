import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DiaryEntry } from "../services/diaryApi";

type DiaryCardProps = {
  entry: DiaryEntry;
  onPress: () => void;
  onToggleFavorite: () => void;
  favoriteBusy?: boolean;
};

export function isLiked(liked: DiaryEntry["liked"]) {
  return liked === true || Number(liked) === 1;
}

export default function DiaryCard({
  entry,
  onPress,
  onToggleFavorite,
  favoriteBusy = false,
}: DiaryCardProps) {
  const liked = isLiked(entry.liked);

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.content}>
        <Text style={styles.mood}>{entry.mood}</Text>
        <View style={styles.details}>
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.date}>{entry.diary_date}</Text>
          <Text numberOfLines={2}>{entry.preview}</Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={liked ? "Hapus dari favorit" : "Tambah ke favorit"}
        disabled={favoriteBusy}
        onPress={onToggleFavorite}
        style={styles.favoriteButton}
      >
        <Text style={[styles.favorite, liked && styles.favoriteActive]}>
          {liked ? "♥" : "♡"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  details: {
    flex: 1,
  },
  mood: {
    fontSize: 32,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  date: {
    color: "#6B7280",
    marginVertical: 4,
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 8,
  },
  favorite: {
    color: "#9CA3AF",
    fontSize: 26,
  },
  favoriteActive: {
    color: "#EF4444",
  },
});
