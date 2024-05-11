
mapboxgl.accessToken = mapToken;
console.log(mapToken);
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    zoom: 12,
    center: listing.geometry.coordinates
});

 // Create a default Marker and add it to the map.
 const marker = new mapboxgl.Marker({ color : 'red'})
 .setLngLat(listing.geometry.coordinates)
 .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h3>${listing.location}</h3><p>Exact location will be provided after booking!<p/>`)) // add popup
 .addTo(map);

console.log(coordinates);