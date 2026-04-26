
  maptilersdk.config.apiKey =mapToken;

  if(listingCoordinates){
   const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: listingCoordinates, // starting position [lng, lat]
  zoom: 14 // starting zoom
  
  });

   const popup = new maptilersdk.Popup({ offset: 25 })
    .setHTML(`${listingLocation}<h6>Exact location provided after booking</h6>`);


 // console.log("adding marker at:", listingCoordinates);
  new maptilersdk.Marker({ color: "red" })
    .setLngLat(listingCoordinates)
    .setPopup(popup)
    .addTo(map);
  }
  
  
  
