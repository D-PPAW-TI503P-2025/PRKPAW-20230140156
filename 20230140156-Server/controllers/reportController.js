const { Presensi, User, Sequelize } = require("../models");
const { Op } = Sequelize;
const { format } = require("date-fns-tz");

const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
  try {
    const search = req.query.search || "";

    // Hitung awal & akhir hari ini (WIB)
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 59
    );

    // Ambil presensi hari ini
    const presensis = await Presensi.findAll({
      where: {
        checkIn: {
          [Op.between]: [startOfDay, endOfDay],
          // atau kalau mau aman:
          // [Op.not]: null
        },
      },
      order: [["checkIn", "DESC"]],
      raw: true,
    });

    // Kalau tidak ada presensi hari ini
    if (!presensis.length) {
      return res.json({
        reportDate: format(new Date(), "M/d/yyyy", { timeZone }),
        data: [],
      });
    }

    // Ambil userId unik
    const userIds = [...new Set(presensis.map((p) => p.userId))];

    // Query kondisi user
    const userWhere = { id: userIds };

    if (search) {
      userWhere.nama = { [Op.like]: `%${search}%` };
    }

    // Ambil data user
    const users = await User.findAll({
      where: userWhere,
      attributes: ["id", "nama", "email"],
      raw: true,
    });

    // Map userId -> user
    const userMap = {};
    users.forEach((u) => {
      userMap[u.id] = u;
    });

    // Merge presensi + user
    const merged = presensis
      .filter((p) => {
        // Jika ada search nama, hanya presensi yang user-nya ditemukan
        if (!search) return true;
        return !!userMap[p.userId];
      })
      .map((p) => ({
        ...p,
        user: userMap[p.userId] || null,
      }));

    return res.json({
      reportDate: format(new Date(), "M/d/yyyy", { timeZone }),
      data: merged,
    });

  } catch (error) {
    console.error("Error getDailyReport:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};