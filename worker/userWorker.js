const amqp = require("amqplib");

(async () => {
    try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = "userQueue";

    await channel.assertQueue(queue);
    console.log("User Worker listening on:", queue);

    channel.consume(queue, (msg) => {
        const data = JSON.parse(msg.content.toString());
        if (data.event === "user_created") {
        console.log(`New user created: ${data.username} (${data.email})`);
        }
        channel.ack(msg);
    });

    connection.on("close", () => console.log("UserWorker connection closed"));
  } catch (err) {
    console.error("User Worker error:", err);
  }
});