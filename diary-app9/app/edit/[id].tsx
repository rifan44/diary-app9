import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useLocalSearchParams,
  usePreventRemove,
  useRouter,
} from "expo-router";
import { editDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";

export default function EditScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const entry = useAppSelector((state) =>
    state.diary.entries.find((item) => item.id === Number(id)),
  );

  const [title, setTitle] = useState(entry?.title || "");
  const [body, setBody] = useState(entry?.body || "");
  const [mood, setMood] = useState(entry?.mood || "");
  const [saving, setSaving] = useState(false);
  const [allowRemoval, setAllowRemoval] = useState(false);
  const hasUnsavedChanges =
    Boolean(entry) &&
    !allowRemoval &&
    (title !== entry?.title || body !== entry?.body || mood !== entry?.mood);

  usePreventRemove(hasUnsavedChanges, ({ repeat }) => {
    Alert.alert(
      "Perubahan belum disimpan",
      "Yakin ingin meninggalkan halaman edit? Perubahan akan dibuang.",
      [
        { text: "Tetap di sini", style: "cancel" },
        {
          text: "Buang perubahan",
          style: "destructive",
          onPress: () => {
            setAllowRemoval(true);
            repeat();
          },
        },
      ],
    );
  });

  if (!entry) {
    return <Text style={{ padding: 16 }}>Diary tidak ditemukan.</Text>;
  }

  const save = async () => {
    if (title.trim().length < 3) {
      Alert.alert("Validasi", "Judul minimal 3 karakter");
      return;
    }
    if (!body.trim()) {
      Alert.alert("Validasi", "Isi diary wajib diisi");
      return;
    }

    setSaving(true);
    try {
      await dispatch(
        editDiary({
          id: entry.id,
          data: {
            title: title.trim(),
            body: body.trim(),
            mood,
          },
        }),
      ).unwrap();

      setAllowRemoval(true);
      router.replace({
        pathname: "/detail/[id]",
        params: { id: String(entry.id) },
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Gagal memperbarui diary",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Diary</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput
        value={body}
        onChangeText={setBody}
        multiline
        style={[styles.input, styles.body]}
      />
      <TextInput value={mood} onChangeText={setMood} style={styles.input} />
      <Pressable
        onPress={save}
        disabled={saving}
        style={[styles.button, saving && styles.buttonDisabled]}
      >
        <Text style={styles.white}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    backgroundColor: "#F8FAFC",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#fff",
  },
  body: {
    minHeight: 140,
    textAlignVertical: "top",
  },
  button: {
    padding: 14,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#2563EB",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  white: {
    color: "#fff",
    fontWeight: "700",
  },
});
