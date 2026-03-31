maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates,
  zoom: 9,
});

new maptilersdk.Marker()
  .setLngLat(coordinates)
  .addTo(map);