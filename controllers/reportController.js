const { Presensi, Sequelize } = require("../models");

exports.getDailyReport = async (req, res) => {
  try {
    console.log("Controller: Mengambil data laporan harian dari database...");

    const today = new Date().toISOString().split("T")[0];

    const presensiRecords = await Presensi.findAll({
      where: Sequelize.where(
        Sequelize.fn("DATE", Sequelize.col("checkIn")),
        today
      ),
      order: [["checkIn", "ASC"]],
    });

    res.status(200).json({
      reportDate: today,
      data: presensiRecords,
    });
  } catch (error) {
    console.error("Gagal mengambil data presensi:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data laporan harian",
      error: error.message,
    });
  }
};