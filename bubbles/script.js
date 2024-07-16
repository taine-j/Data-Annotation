// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 2); // Centered at a default location

// Add a tile layer (you can use different tile providers)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Define the data for the bubbles
var bubbles = [
    { lat: 51.505, lng: -0.09, url: 'page1.html', title: 'Bubble 1' },
    { lat: 48.8566, lng: 2.3522, url: 'page2.html', title: 'Bubble 2' },
    { lat: 40.7128, lng: -74.0060, url: 'page3.html', title: 'Bubble 3' }
];

// Add bubbles to the map
bubbles.forEach(function(bubble) {
    var circle = L.circle([bubble.lat, bubble.lng], {
        color: 'blue',
        fillColor: '#30f',
        fillOpacity: 0.5,
        radius: 500000 // Adjust radius as needed
    }).addTo(map);

    // Add a click event to the bubble
    circle.on('click', function() {
        window.location.href = bubble.url;
    });

    // Optionally, add a tooltip or popup
    circle.bindTooltip(bubble.title).openTooltip();
});