import amqp from "amqplib";

async function main() {
    const amqpUrl = "amqp://localhost";
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const queue = "Monitor";
    channel.assertQueue(queue, { durable: false });

    channel.consume(queue, message => {
        console.log(message && message.content.toString())
    }, { noAck: true });

    process.on('exit', _ => {
        connection.close();
    });
}

main().catch(console.error);