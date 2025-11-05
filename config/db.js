const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || "mongodb://mongodb:27017/sportstadiumDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: false, // ✅ ปิด SSL/TLS ที่นี่
      tls: false, // ✅ บาง version ต้องปิด tls ด้วย
    });
    console.log("✅ MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
