import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import DiaryCard, { isLiked } from "../../src/components/DiaryCard";
import {
  editDiary,
  fetchDiaries,
} from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { entries, loading, error } = useAppSelector((state) => state.diary);
  const [favoriteBusyId, setFavoriteBusyId] = useState<number | null>(null);
  const favorites = entries.filter((entry) => isLiked(entry.liked));

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchDiaries(""));
    }, [dispatch]),
  );

  const removeFavorite = async (id: number) => {
    setFavoriteBusyId(id);
    try {
      await dispatch(editDiary({ id, data: { liked: false } })).unwrap();
    } catch (error) {
      Alert.alert("Error", "Gagal memperbarui favorit");
      throw error;
    } finally {
      setFavoriteBusyId(null);
    }
  };

  if (loading && entries.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Mengambil favorit...</Text>
      </View>
    );
  }

  if (error && entries.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Diary Favorit</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={() => dispatch(fetchDiaries(""))}
        renderItem={({ item }) => (
          <DiaryCard
            entry={item}
            favoriteBusy={favoriteBusyId === item.id}
            onPress={() =>
              router.push({
                pathname: "/detail/[id]",
                params: { id: String(item.id) },
              })
            }
            onToggleFavorite={() => removeFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Belum ada diary favorit.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  error: {
    color: "#EF4444",
    marginBottom: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },
});
