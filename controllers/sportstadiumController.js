const { createSequelize } = require("../config/mysql");
const sequelizePromise = createSequelize(); // จะได้ instance ของ Sequelize
const SportStadiumFactory = require("../models/sqlModels/sportstadium");
const SportFactory = require("../models/sqlModels/sport");

// Helper
const formatDate = require("../utils/formatDate");

// Helper: จัดรูปแบบข้อมูลก่อนส่งกลับ
const formatStadium = (s) => ({
  id: s.id,
  sportstadiumName: s.sportstadiumName,
  address: s.address,
  latitude: s.latitude,
  longitude: s.longitude,
  indoor: s.indoor,
  facilities: s.facilities || [],
  createdAt: formatDate(s.createdAt),
});

const formatSport = (s) => ({
  id: s.id,
  sportStadiumId: s.sportStadiumId,
  sportType: s.sportType,
  openTime: s.openTime,
  closeTime: s.closeTime
});

const formatCompleteStadium = (sports, stadium) => {
  const buffer = {...stadium, sports: sports}
  return buffer;
}

// Create Stadium
exports.createSportStadium = async (req, res) => {
  try {
    const sequelize = await sequelizePromise;
    const SportStadium = SportStadiumFactory(sequelize);

    const stadium = await SportStadium.create(req.body);
    res.status(201).json(formatStadium(stadium));
  } catch (err) {
    console.error("Error creating stadium:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get All Stadiums
exports.getSportStadiums = async (req, res) => {
  try {
    const sequelize = await sequelizePromise;
    const SportStadium = SportStadiumFactory(sequelize);

    const stadiums = await SportStadium.findAll();
    res.json(stadiums.map(formatStadium));
  } catch (err) {
    console.error("Error getting stadiums:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get Stadium by ID
exports.getSportStadiumById = async (req, res) => {
  try {
    const sequelize = await sequelizePromise;
    const SportStadium = SportStadiumFactory(sequelize);
    const Sport = SportFactory(sequelize); // 1. สร้าง Model 'Sport' (ตัวแปรตัวพิมพ์ใหญ่)

    // ค้นหา Stadium
    const stadium = await SportStadium.findByPk(req.params.id);
    if (!stadium) {
      return res.status(404).json({ message: "Stadium not found" });
    }

    // 2. ค้นหา Sports ทั้งหมดที่ตรงกับ sportStadiumId
    const sports = await Sport.findAll({
      where: {
        sportStadiumId: stadium.id // ใช้ stadium.id ที่เราเพิ่งค้นเจอ
      }
    });

    // 3. Format ข้อมูล
    const formattedStadium = formatStadium(stadium);
    const formattedSports = sports.map(formatSport); // .map() เพราะ sports เป็น array

    // 4. นำมารวมกันด้วย helper
    const completeStadium = formatCompleteStadium(formattedSports, formattedStadium);

    // 5. ส่งผลลัพธ์กลับ
    res.json(completeStadium);

  } catch (err) {
    console.error("Error getting stadium:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update Stadium
exports.updateSportStadium = async (req, res) => {
  try {
    const sequelize = await sequelizePromise;
    const SportStadium = SportStadiumFactory(sequelize);

    const stadium = await SportStadium.findByPk(req.params.id);
    if (!stadium) return res.status(404).json({ message: "Stadium not found" });

    await stadium.update(req.body);
    res.json(formatStadium(stadium));
  } catch (err) {
    console.error("Error updating stadium:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete Stadium
exports.deleteSportStadium = async (req, res) => {
  try {
    const sequelize = await sequelizePromise;
    const SportStadium = SportStadiumFactory(sequelize);

    const stadium = await SportStadium.findByPk(req.params.id);
    if (!stadium) return res.status(404).json({ message: "Stadium not found" });

    await stadium.destroy();
    res.json({ message: "Stadium deleted successfully" });
  } catch (err) {
    console.error("Error deleting stadium:", err);
    res.status(500).json({ message: err.message });
  }
};
