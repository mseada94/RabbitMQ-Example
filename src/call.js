
import amqp from "amqplib";
import generateUuid from "uuid/v4";

async function main() {
    const amqpUrl = "amqp://localhost";
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const callQueue = "Call";
    const replayQueue = "Replay";
    const amqpQueue = await channel.assertQueue(replayQueue, { exclusive: true });

    let correlationId;
    const interval = setInterval(async _ => {
        correlationId = generateUuid();
        const time = new Date().toJSON();
        const message = `[${time}] - params`;
        console.log(`Call: ${message}`)

        channel.sendToQueue(callQueue,
            Buffer.from(message), {
            correlationId: correlationId,
            replyTo: amqpQueue.queue
        });
    }, 3000);

    channel.consume(amqpQueue.queue, message => {
        if (message && message.properties.correlationId === correlationId)
            console.log(message.content.toString())
    }, { noAck: true });

    process.on('exit', _ => {
        connection.close();
        clearInterval(interval);
    });
}

main().catch(console.error);