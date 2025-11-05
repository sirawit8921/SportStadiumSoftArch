const amqp = require('amqplib');

let channel, connection;

async function connectQueue() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('✅ RabbitMQ connected');
  } catch (error) {
    console.error('❌ RabbitMQ connection failed:', error);
  }
}

function getChannel() {
  if (!channel) throw new Error('Channel not initialized');
  return channel;
}

module.exports = { connectQueue, getChannel };
