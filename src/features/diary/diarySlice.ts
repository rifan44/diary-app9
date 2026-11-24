import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apiCreateDiary,
  apiDeleteDiary,
  apiGetDiaries,
  apiUpdateDiary,
  DiaryEntry,
  NewDiary,
} from "../../services/diaryApi";

type DiaryState = {
  entries: DiaryEntry[];
  loading: boolean;
  error: string | null;
};

const initialState: DiaryState = {
  entries: [],
  loading: false,
  error: null,
};

export const fetchDiaries = createAsyncThunk<DiaryEntry[], string>(
  "diary/fetchDiaries",
  async (search) => await apiGetDiaries(search),
);

export const addDiary = createAsyncThunk(
  "diary/addDiary",
  async (data: NewDiary) => {
    return await apiCreateDiary(data);
  },
);

export const editDiary = createAsyncThunk(
  "diary/editDiary",
  async ({ id, data }: { id: number; data: Partial<DiaryEntry> }) => {
    return await apiUpdateDiary(id, data);
  },
);

export const removeDiary = createAsyncThunk(
  "diary/removeDiary",
  async (id: number) => {
    await apiDeleteDiary(id);
    return id;
  },
);

const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchDiaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Gagal mengambil diary";
      })
      .addCase(addDiary.fulfilled, (state, action) => {
        state.entries.unshift(action.payload);
      })
      .addCase(editDiary.fulfilled, (state, action) => {
        const index = state.entries.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index >= 0) {
          state.entries[index] = action.payload;
        }
      })
      .addCase(removeDiary.fulfilled, (state, action) => {
        state.entries = state.entries.filter(
          (item) => item.id !== action.payload,
        );
      });
  },
});

export default diarySlice.reducer;
