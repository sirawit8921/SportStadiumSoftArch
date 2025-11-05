// worker/teamWorker.js
const amqp = require("amqplib");

(async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = "teamQueue";

    await channel.assertQueue(queue);
    console.log("Team Worker listening on:", queue);

    channel.consume(queue, (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log("Received team event:", data);

      if (data.event === "team_joined") {
        console.log(`User ${data.userId} joined team ${data.teamId}`);
      } else if (data.event === "team_left") {
        console.log(`User ${data.userId} left team ${data.teamId}`);
      }

      channel.ack(msg);
    });

    connection.on("close", () => console.log("TeamWorker connection closed"));
  } catch (err) {
    console.error("Team Worker error:", err);
  }
})();
