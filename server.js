const WebSocket = require('ws');

// Set up the WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// This will store all connected clients
let clients = [];

wss.on('connection', (ws) => {
    console.log('A new client connected!');
    
    // Add this client to the list
    clients.push(ws);

    // When a message is received from a client
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'register') {
            // New device is registering with its name and code
            console.log(`Device ${data.name} with code ${data.code} has connected`);

            // Broadcast this information to all other clients
            clients.forEach(client => {
                if (client !== ws) {
                    client.send(JSON.stringify({
                        type: 'new-feed',
                        deviceName: data.name,
                        code: data.code
                    }));
                }
            });
        }

        if (data.type === 'new-feed') {
            // Broadcast the new camera feed to all clients
            console.log(`New feed from device: ${data.deviceName}`);
            clients.forEach(client => {
                if (client !== ws) {
                    client.send(JSON.stringify({
                        type: 'new-feed',
                        deviceName: data.deviceName,
                        stream: data.stream,
                        code: data.code
                    }));
                }
            });
        }
    });

    // When the connection is closed
    ws.on('close', () => {
        console.log('A client disconnected!');
        clients = clients.filter(client => client !== ws);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
