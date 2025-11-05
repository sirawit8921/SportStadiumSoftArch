// worker/notificationWorker.js
const { getChannel } = require("../utils/rabbitmq");

async function startWorker() {
  try {
    const channel = getChannel(); // ใช้ connection เดิม
    const queue = "notificationQueue";

    await channel.assertQueue(queue);
    console.log("Worker connected to RabbitMQ, waiting for messages...");

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log("Received Message:", data);
        console.log(`User ${data.userId} booked ${data.stadiumName} (${data.sportType})`);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("Worker error:", err);
  }
}

module.exports = startWorker;
