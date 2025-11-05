process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1"; // ✅ บังคับให้ไม่ยุ่งกับ TLS/SSL

// Load Environment Variables
require("dotenv").config({ path: "./config/.env" });

const express = require("express");
const swaggerUI = require("swagger-ui-express");
const connectDB = require("./config/db");
const specs = require("./config/swagger");
const cors = require("cors");
const morgan = require("morgan");

// MySQL + RabbitMQ Imports
const { createSequelize } = require("./config/mysql");
const { connectRabbitMQ } = require("./utils/rabbitmq");
const startWorker = require("./worker/notificationWorker");

// Controllers & Models (MySQL)
const authRoutes = require("./routes/user");
const authCtrl = require("./controllers/userController");
const UserFactory = require("./models/sqlModels/user");
const SportStadiumFactory = require("./models/sqlModels/sportstadium");
const TeamFactory = require("./models/sqlModels/team");

// Express App Setup
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Swagger API Docs
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Routes
app.use("/api/sportstadiums", require("./routes/sportstadium"));
app.use("/api/reservations", require("./routes/reservation"));
app.use("/api/users", require("./routes/user"));
app.use("/api/teams", require("./routes/team"));
app.use("/api/notifications", require("./routes/notification"));

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 💡 SERVER STARTUP
(async () => {
  try {
    // Connect MongoDB
    await connectDB();
    console.log("✅ MongoDB Connected");

    // Connect MySQL
    const sequelize = await createSequelize();

    // Initialize Models
    const User = UserFactory(sequelize);
    const SportStadium = SportStadiumFactory(sequelize);
    const Team = TeamFactory(sequelize);

    // Attach Models to Controller (for Auth)
    authCtrl.attach({ User });

    // Sync All Models (auto create/update tables)
    await sequelize.sync({ alter: true });
    console.log("✅ MySQL Connected & Synced");

    // Connect RabbitMQ
    await connectRabbitMQ();

    // Start Worker
    await startWorker();

    // Start Express Server
    const PORT = process.env.PORT || 5003; // Port for backend
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
})();
