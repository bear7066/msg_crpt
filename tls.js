const Pulsar = require('pulsar-client');

const topic = 'persistent://my-tenant/my-ns/my-topic';

(async () => {
    try {
        // Create a client with TLS configuration
        const client = new Pulsar.Client({
            serviceUrl: 'pulsar+ssl://localhost:6651', // Use pulsar+ssl for TLS
            operationTimeoutSeconds: 30,
            tlsTrustCertsFilePath: '/ca-cert.pem', // Path to the CA certificate
            tlsAllowInsecureConnection: false,
            tlsValidateHostname: true,
            authentication: new Pulsar.AuthenticationTls({
                certificatePath: false, // Path to the client certificate
                privateKeyPath: false, // Path to the client key
            })
        });

        // Create a producer with encryption configuration
        const producer = await client.createProducer({
            topic: topic,
            sendTimeoutMs: 30000,
            batchingEnabled: true,
            publicKeyPath: "test_rsa_pubkey.pem",
            encryptionKey: "encryption-key"
        });

        // Create a consumer with decryption configuration
        const consumer = await client.subscribe({
            topic: topic,
            subscription: 'my-subscriber-name',
            subscriptionType: 'Shared',
            ackTimeoutMs: 10000,
            privateKeyPath: "test_rsa_privkey.pem"
        });

        // Create message and send by producer + encrypt
        const msg = 'Pulsar testing';
        await producer.send({
            data: Buffer.from(msg),
        });
        console.log('Message sent:', msg);

        // Receive message by consumer + decrypt
        const msg_rec = await consumer.receive();
        const receivedMessage = msg_rec.getData().toString();
        console.log('Message received:', receivedMessage);
        await consumer.acknowledge(msg_rec);

        // Debugging outputs
        console.log('Sent message:', msg);
        console.log('Received message:', receivedMessage);

        // Validate the message
        if (receivedMessage === msg) {
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
