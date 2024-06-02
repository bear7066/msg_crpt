/* Transport Layer Security (TLS) is a form of public key cryptography. 
   You can use TLS to encrypt this traffic to protect the traffic from the snooping of a man-in-the-middle attacker.
*/
const Pulsar = require('pulsar-client');
const topic = 'persistent://my-tenant/my-ns/my-topic';

(async () => {
    try {
        // Create a client
        const client = new Pulsar.Client({
            serviceUrl: 'pulsar://localhost:6650', // Correctly specify the service URL
            operationTimeoutSeconds: 30,
        });

        // Create a producer
        const producer = await client.createProducer({
            topic: topic,
            sendTimeoutMs: 30000,
            batchingEnabled: true,
            publicKeyPath: "test_rsa_pubkey.pem",
            encryptionKey: "encryption-key"
        });

        // Create a consumer
        const consumer = await client.subscribe({
            topic: topic,
            subscription: 'my-subscriber-name',
            subscriptionType: 'Shared',
            ackTimeoutMs: 10000,
            privateKeyPath: "test_rsa_privkey.pem"
        });

        // Create message and send by producer + encrpt
        const msg = 'Pulsar testing';
        await producer.send({
            data: Buffer.from(msg),
        });

        console.log('Message sent:', msg);

        // Receive message by consumer + decrpt
        const msg_rec = await consumer.receive();
        const receivedMessage = msg_rec.getData().toString();
        // console.log('Message received:', msg_rec);
        console.log('Message received:', receivedMessage);
        // await consumer.acknowledge(msg);

        // Validate the message
        // If not success, use .trim(). The msg may contain redundent word
        if (msg === receivedMessage) {
            console.log('Encryption and decryption successful!');
        } else {
            console.error('Encryption and decryption failed!');
        }

        // Clean up: close consumer, producer, and client
        await consumer.close();
        await producer.close();
        await client.close();
    } catch (err) {
        console.error('Failed to run Pulsar client:', err);
    }
})();
