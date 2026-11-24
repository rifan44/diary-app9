import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isLiked } from "../../src/components/DiaryCard";
import {
  editDiary,
  removeDiary,
} from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";

export default function DetailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const entry = useAppSelector((state) =>
    state.diary.entries.find((item) => item.id === Number(id)),
  );
  const [deleting, setDeleting] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const liked = entry ? isLiked(entry.liked) : false;

  if (!entry) {
    return <Text style={{ padding: 16 }}>Diary tidak ditemukan.</Text>;
  }

  const confirmDelete = () => {
    Alert.alert("Hapus Diary", "Data akan dihapus dari MySQL.", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          try {
            await dispatch(removeDiary(entry.id)).unwrap();
            router.replace("/");
          } catch (error) {
            setDeleting(false);
            Alert.alert(
              "Error",
              error instanceof Error ? error.message : "Gagal menghapus diary",
            );
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mood}>{entry.mood}</Text>
      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.date}>{entry.diary_date}</Text>
      <Text style={styles.createdAt}>Dibuat: {entry.created_at}</Text>
      <Text style={styles.body}>{entry.body}</Text>

      <Pressable
        disabled={savingFavorite}
        onPress={async () => {
          setSavingFavorite(true);
          try {
            await dispatch(
              editDiary({ id: entry.id, data: { liked: !liked } }),
            ).unwrap();
          } catch (error) {
            Alert.alert(
              "Error",
              error instanceof Error
                ? error.message
                : "Gagal memperbarui favorit",
            );
          } finally {
            setSavingFavorite(false);
          }
        }}
        style={styles.favorite}
      >
        <Text style={styles.favoriteText}>
          {savingFavorite
            ? "Menyimpan..."
            : liked
              ? "♥ Hapus dari Favorit"
              : "♡ Tambah ke Favorit"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/edit/[id]",
            params: { id: String(entry.id) },
          })
        }
        style={styles.edit}
      >
        <Text style={styles.white}>Edit Diary</Text>
      </Pressable>

      <Pressable
        onPress={confirmDelete}
        disabled={deleting}
        style={[styles.delete, deleting && styles.disabled]}
      >
        <Text style={styles.white}>
          {deleting ? "Menghapus..." : "Hapus Diary"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  mood: {
    fontSize: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  date: {
    color: "#6B7280",
  },
  createdAt: {
    color: "#6B7280",
    fontSize: 13,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  edit: {
    padding: 14,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#2563EB",
  },
  favorite: {
    padding: 14,
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  favoriteText: {
    color: "#111827",
    fontWeight: "700",
  },
  delete: {
    padding: 14,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#EF4444",
  },
  disabled: {
    opacity: 0.6,
  },
  white: {
    color: "#fff",
    fontWeight: "700",
  },
});
