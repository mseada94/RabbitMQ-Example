import amqp from "amqplib";

async function main() {
    const amqpUrl = "amqp://localhost";
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const queue = "Monitor";
    const topic = "Cpu";
    channel.assertExchange(queue, "topic", { durable: false });

    const interval = setInterval(_ => {
        const time = new Date().toJSON();
        const cpuUsage = Math.floor(Math.random() * 100);
        const message = `[${time}] - Server: A, CPU: ${cpuUsage}%`;

        channel.publish(queue, topic, Buffer.from(message));

        console.info(message);
    }, 3000);

    process.on('exit', _ => {
        connection.close();
        clearInterval(interval);
    });
}

main().catch(console.error);