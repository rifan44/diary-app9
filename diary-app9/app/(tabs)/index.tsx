import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import DiaryCard, { isLiked } from "../../src/components/DiaryCard";
import {
  editDiary,
  fetchDiaries,
} from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { entries, loading, error } = useAppSelector((state) => state.diary);
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [favoriteBusyId, setFavoriteBusyId] = useState<number | null>(null);
  const visibleEntries = useMemo(() => {
    const query = activeSearch.toLocaleLowerCase();
    if (!query) return entries;

    return entries.filter((entry) =>
      [entry.title, entry.preview, entry.body]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query),
    );
  }, [activeSearch, entries]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchDiaries(activeSearch));
    }, [activeSearch, dispatch]),
  );

  const search = () => {
    const nextSearch = searchText.trim();
    if (nextSearch === activeSearch) {
      dispatch(fetchDiaries(nextSearch));
    } else {
      setActiveSearch(nextSearch);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    if (activeSearch) {
      setActiveSearch("");
    } else {
      dispatch(fetchDiaries(""));
    }
  };

  const toggleFavorite = async (id: number, liked: boolean | number) => {
    setFavoriteBusyId(id);
    try {
      await dispatch(
        editDiary({ id, data: { liked: !isLiked(liked) } }),
      ).unwrap();
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
        <Text>Mengambil diary...</Text>
      </View>
    );
  }

  if (error && entries.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable onPress={() => dispatch(fetchDiaries(activeSearch))}>
          <Text>Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Buku Harian</Text>
      <View style={styles.searchRow}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={search}
          placeholder="Cari diary..."
          returnKeyType="search"
          style={styles.searchInput}
        />
        <Pressable onPress={search} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Cari</Text>
        </Pressable>
        {searchText || activeSearch ? (
          <Pressable onPress={clearSearch} style={styles.clearButton}>
            <Text>Hapus</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
      <FlatList
        data={visibleEntries}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={() => dispatch(fetchDiaries(activeSearch))}
        renderItem={({ item }) => (
          <DiaryCard
            entry={item}
            favoriteBusy={favoriteBusyId === item.id}
            onToggleFavorite={() =>
              toggleFavorite(item.id, item.liked)
            }
            onPress={() =>
              router.push({
                pathname: "/detail/[id]",
                params: { id: String(item.id) },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {activeSearch ? "Diary tidak ditemukan." : "Belum ada diary."}
          </Text>
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
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  searchButton: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "#2563EB",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  clearButton: {
    paddingHorizontal: 6,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  error: {
    color: "#EF4444",
  },
  errorBanner: {
    color: "#EF4444",
    marginBottom: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },
});
