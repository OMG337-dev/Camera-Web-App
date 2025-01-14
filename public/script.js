// Connect to the WebSocket server
const socket = new WebSocket('ws://localhost:8080');

// Set up references for the camera feed container and input fields
const cameraNameInput = document.getElementById('cameraName');
const deviceCodeInput = document.getElementById('deviceCode');
const setCameraNameBtn = document.getElementById('setCameraNameBtn');
const submitCodeBtn = document.getElementById('submitCodeBtn');
const cameraFeedsContainer = document.getElementById('cameraFeedsContainer');

// Camera name and code storage
let cameraName = '';
let deviceCode = '';

// Listen for WebSocket messages from the server
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'new-feed') {
        // Handle receiving a new feed
        displayCameraFeed(data.deviceName, data.code);
    }
};

// When WebSocket connection is open
socket.onopen = function() {
    console.log('Connected to WebSocket server');
};

// When WebSocket connection is closed
socket.onclose = function() {
    console.log('Disconnected from WebSocket server');
};

// When the "Set Camera Name" button is clicked
setCameraNameBtn.addEventListener('click', function() {
    cameraName = cameraNameInput.value;
    if (cameraName) {
        // Send the camera registration message to the WebSocket server
        deviceCode = generateDeviceCode();
        socket.send(JSON.stringify({
            type: 'register',
            name: cameraName,
            code: deviceCode
        }));
        
        alert(`Camera name set to: ${cameraName} with code: ${deviceCode}`);
    }
});

// When the "Submit Code" button is clicked
submitCodeBtn.addEventListener('click', function() {
    const code = deviceCodeInput.value;
    if (code) {
        // Send a request to join the feed associated with the code
        socket.send(JSON.stringify({
            type: 'join-feed',
            code: code
        }));
    }
});

// Generate a random 5-digit device code
function generateDeviceCode() {
    return Math.floor(10000 + Math.random() * 90000);
}

// Display the camera feed in the UI
function displayCameraFeed(deviceName, code) {
    const cameraFeedDiv = document.createElement('div');
    cameraFeedDiv.classList.add('camera-feed');
    cameraFeedDiv.innerHTML = `
        <h3>${deviceName} (${code})</h3>
        <video id="video-${code}" autoplay></video>
    `;
    cameraFeedsContainer.appendChild(cameraFeedDiv);

    // This part assumes that the server will send the video stream; for now, we'll just display a placeholder
    const videoElement = document.getElementById(`video-${code}`);
    // You can replace this with the actual camera feed once it's available from the WebSocket server
    // Example: videoElement.srcObject = stream;
}
