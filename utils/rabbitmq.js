const amqp = require("amqplib");

let connection = null;
let channel = null;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("✅ RabbitMQ connected and channel ready.");
    return channel;
  } catch (err) {
    console.error("❌ RabbitMQ connection error:", err.message);
    throw err;
  }
}

async function sendToQueue(queueName, data) {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel not initialized. Call connectRabbitMQ() first.");
    }

    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log(`Sent message to queue "${queueName}":`, data);

    // 🕒 Delay 0.5 second before closing connection
    setTimeout(async () => {
      try {
        await channel.close();
        await connection.close();
        console.log("Connection closed after delay (0.5s)");
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }, 500);

  } catch (err) {
    console.error("Failed to send message:", err.message);
  }
}

// Worker call to get channel
function getChannel() {
  return channel;
}

module.exports = {
  connectRabbitMQ,
  sendToQueue,
  getChannel,
};
