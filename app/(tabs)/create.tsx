import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { addDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch } from "../../src/app/hooks";

export default function CreateScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("😊");
  const [saving, setSaving] = useState(false);

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
        addDiary({
          title: title.trim(),
          diary_date: new Date().toISOString().slice(0, 10),
          body: body.trim(),
          mood,
        }),
      ).unwrap();

      setTitle("");
      setBody("");
      setMood("😊");
      router.replace("/");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Diary gagal disimpan",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tambah Diary</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Judul"
        style={styles.input}
      />
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Ceritakan harimu..."
        multiline
        style={[styles.input, styles.bodyInput]}
      />
      <TextInput
        value={mood}
        onChangeText={setMood}
        placeholder="Mood (contoh: 😊)"
        style={styles.input}
      />
      <Pressable
        onPress={save}
        disabled={saving}
        style={[styles.button, saving && styles.buttonDisabled]}
      >
        <Text style={styles.white}>{saving ? "Menyimpan..." : "Simpan"}</Text>
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
  bodyInput: {
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
