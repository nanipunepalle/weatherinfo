const request=require('request')

//geocode for latitude and longitude
const geocode=(address,callback)=>{
    console.log("done")
    console.log(address);
    const url='https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(address)+'.json?access_token=pk.eyJ1Ijoia3ByYW5heS0tMSIsImEiOiJjazg4ZnUyYzQwN2xrM2ltcXBobXpocW40In0.gv9Wh6y84h_SF6IE6m49CA'
    
    request({url,json:true},(error,response)=>{
        if(error)
        {
             callback('unable to connect to the server',undefined)
        }else if(response.body.features.length===0){
            callback('unable to find the location try with different search',undefined)
        }
        else
        {
            callback(undefined, {
                latitude:response.body.features[0].center[1],
                longitude:response.body.features[0].center[0],
                location:response.body.features[0].place_name
            })
        }
    })

}

//forecast of the wether
const forecast=(latitude,longitude,callback)=>{
    const forecasturl='https://api.darksky.net/forecast/f9cb6791f17f64b7ee8a29b695cfa1c1/'+latitude+','+longitude+'?units=si'
    request({url:forecasturl,json:true},(error,response)=>{
        if(error)
        {
            callback('unabe to connect to the server')
        }
        else if(response.body.error)
        {
            callback('try with different latitudes and longitudes')
        }
        else{
            callback(undefined,response.body)
        }

    })

}


module.exports={
    geocode:geocode,
    forecast:forecast
}






// exports.currentLocation = function(){
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function(position){
//             let location = position.coords.latitude + "," + position.coords.longitude;
//             return location;
//         });
//       } else { 
//        return "Geo location is not supported.Enter your cityName"
//       }
// }

// function getLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(showPosition);
//     } else { 
//       x.innerHTML = "Geolocation is not supported by this browser.";
//     }
//   }
  
//   function showPosition(position) {
//     x.innerHTML = "Latitude: " + position.coords.latitude + 
//     "<br>Longitude: " + position.coords.longitude;
//   }