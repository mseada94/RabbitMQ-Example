import amqp from "amqplib";

async function main() {
    const amqpUrl = "amqp://localhost";
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const queue = "Monitor";
    const topic = "Cpu";
    channel.assertExchange(queue, "topic", { durable: false });

    const amqpQueue = await channel.assertQueue('', { exclusive: true });
    channel.bindQueue(amqpQueue.queue, queue, topic);

    channel.consume(amqpQueue.queue, message => {
        console.log(message && message.content.toString())
    }, { noAck: true });

    process.on('exit', _ => {
        connection.close();
    });
}

main().catch(console.error);