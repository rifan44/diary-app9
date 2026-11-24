import { db } from "../config/database.js";

export async function getAllDiaries(req, res) {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const [rows] = search
      ? await db.execute(
          `SELECT *
           FROM diaries
           WHERE title LIKE ? OR preview LIKE ? OR body LIKE ?
           ORDER BY created_at DESC`,
          [`%${search}%`, `%${search}%`, `%${search}%`],
        )
      : await db.query(`
          SELECT *
          FROM diaries
          ORDER BY created_at DESC
        `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil data diary",
    });
  }
}

export async function getDiaryById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM diaries WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Diary tidak ditemukan",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil detail diary",
    });
  }
}

export async function createDiary(req, res) {
  try {
    const { title, diary_date, body, mood = "😊" } = req.body ?? {};

    if (
      typeof title !== "string" ||
      title.trim().length < 3 ||
      typeof diary_date !== "string" ||
      !diary_date ||
      typeof body !== "string" ||
      !body.trim()
    ) {
      return res.status(400).json({
        message: "Judul minimal 3 karakter, tanggal, dan isi wajib diisi",
      });
    }

    const preview = body.trim().slice(0, 100);

    const [result] = await db.execute(
      `INSERT INTO diaries (title, diary_date, preview, body, mood)
       VALUES (?, ?, ?, ?, ?)`,
      [title.trim(), diary_date, preview, body.trim(), mood],
    );

    const [rows] = await db.execute("SELECT * FROM diaries WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal menambahkan diary",
    });
  }
}

export async function updateDiary(req, res) {
  try {
    const { id } = req.params;
    const [oldRows] = await db.execute("SELECT * FROM diaries WHERE id = ?", [
      id,
    ]);

    if (oldRows.length === 0) {
      return res.status(404).json({
        message: "Diary tidak ditemukan",
      });
    }

    const old = oldRows[0];
    const requestData = req.body ?? {};
    const {
      title = old.title,
      diary_date = old.diary_date,
      body = old.body,
      mood = old.mood,
      liked = old.liked,
    } = requestData;

    if (
      (requestData.title !== undefined &&
        (typeof title !== "string" || title.trim().length < 3)) ||
      typeof diary_date !== "string" ||
      !diary_date ||
      typeof body !== "string" ||
      !body.trim()
    ) {
      return res.status(400).json({
        message: "Judul minimal 3 karakter, tanggal, dan isi wajib diisi",
      });
    }

    const preview = body.trim().slice(0, 100);

    await db.execute(
      `UPDATE diaries
       SET title = ?,
           diary_date = ?,
           preview = ?,
           body = ?,
           mood = ?,
           liked = ?
       WHERE id = ?`,
      [title.trim(), diary_date, preview, body.trim(), mood, liked, id],
    );

    const [rows] = await db.execute("SELECT * FROM diaries WHERE id = ?", [id]);

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal memperbarui diary",
    });
  }
}

export async function deleteDiary(req, res) {
  try {
    const { id } = req.params;
    const [result] = await db.execute("DELETE FROM diaries WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Diary tidak ditemukan",
      });
    }

    res.json({
      message: "Diary berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal menghapus diary",
    });
  }
}
