
import amqp from "amqplib";

function delay(time) {
    return new Promise(resolve => setTimeout(_ => resolve(), time));
}

async function main() {
    const amqpUrl = "amqp://localhost";
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const callQueue = "Call";
    const amqpQueue = await channel.assertQueue(callQueue, { durable: false });

    channel.prefetch(1); // Max concurrent calls 

    channel.consume(amqpQueue.queue, async message => {
        if (!message)
            return;

        const params = message.content.toString();
        console.log(params)

        await delay(1500);
        channel.sendToQueue(message.properties.replyTo,
            Buffer.from(`Replay: ${params}`), {
            correlationId: message.properties.correlationId
        });

        channel.ack(message);
    });

    process.on('exit', _ => {
        connection.close();
    });
}

main().catch(console.error);