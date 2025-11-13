const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Cek apakah masih ada presensi aktif ( belum checkout )
    const existingRecord = await Presensi.findOne({
      where: {
        userId: userId,
        checkOut: null
      }
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId,
      nama: userName,
      checkIn: waktuSekarang,
      checkOut: null
    });

    const formattedData = {
      ...newRecord.dataValues,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone })
    };

    console.log(`DATA TERUPDATE: ${userName} (ID: ${userId}) melakukan check-in.`);

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: formattedData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: {
        userId: userId,
        checkOut: null
      }
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in aktif untuk Anda."
      });
    }

    await recordToUpdate.update({
      checkOut: waktuSekarang
    });

    const formattedData = {
      ...recordToUpdate.dataValues,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone })
    };

    console.log(`DATA TERUPDATE: ${userName} (ID: ${userId}) melakukan check-out.`);

    res.json({
      message: `Selamat jalan ${userName}, check-out berhasil pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: formattedData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }
    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Anda tidak memiliki izin untuk menghapus catatan ini." });
    }
    await recordToDelete.destroy();
    res.status(200).json({ message: "Data Presensi berhasil dihapus.", 
		data: recordToDelete });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;
    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
      });
    }
    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.nama = nama || recordToUpdate.nama;
    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
