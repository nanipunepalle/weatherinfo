// https://api.darksky.net/forecast/[key]/[latitude],[longitude]
// f9cb6791f17f64b7ee8a29b695cfa1c1
// https://api.darksky.net/forecast/f9cb6791f17f64b7ee8a29b695cfa1c1/37.8267,-122.4233

const express = require("express");
const https = require("https");
const geocode=require(__dirname+"/location")
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.set('view engine', 'ejs');

var summary = "__";
var temp = "__";
var windSpeed = "__";
var pressure = "__";
var humidity = "__";
var visibility = "__";
var uvIndex = "__";
var time = "__";
var img = "default.jpg";
var desc1 = "Enter your city to continue";
var desc2 = "";
var gDate = new Date(0);
var items = [];

app.get("/",function(req,res){
    res.render("index",{
        summary: summary,
        temp: temp,
        humidity: humidity,
        pressure: pressure,
        windspeed: windSpeed,
        visibility: visibility,
        uvindex: uvIndex,
        time: time,
        img: img,
        desc1: desc1,
        desc2: desc2,
        newListItems: items
    })
});

app.post("/",function(req,res){
    console.log(req.body.cityname)
    if(req.body.cityname.length != 0){
        geocode.geocode(req.body.cityname,(error,data)=>{
            if(error){
                return res.send({
                    error:error
                })
    
            }
            geocode.forecast(data.latitude,data.longitude,(error,forecastdata)=>{
                if(error)
                {
                   return res.send({
                       error:error
                   }) 
                }
                console.log(data.location);
                console.log(forecastdata.currently.summary);
                console.log(forecastdata.currently.icon);
                summary = forecastdata.currently.summary;
                temp = forecastdata.currently.temperature;
                windSpeed = forecastdata.currently.windSpeed;
                pressure = forecastdata.currently.pressure;
                humidity = forecastdata.currently.humidity;
                visibility = forecastdata.currently.visibility;
                uvIndex = forecastdata.currently.uvIndex;
                time = forecastdata.currently.time;
                gDate.setUTCSeconds(time);
                time = gDate.toString();
                desc1 = forecastdata.hourly.summary;
                if(uvIndex < 4 && temp <= 30 && temp >=12){
                    desc2 = "Great! Go ahead and enjpy your outdoors";
                }
                else{
                    desc2 = "You need to wait for right moment";
                }
                let todayHoursData = forecastdata.hourly.data;
                todayHoursData.forEach(function(value){
                    if(value.uvIndex < 4 && value.temperature <= 30 && value.temperature >=12){
                        let t = value.time;
                        let d = new Date(0);
                        d.setUTCSeconds(t);
                        items.push(d.toString());
                        console.log(d.toString());
                    }
                });

                res.redirect("/");
            })
        
        })
    }
    else{
        res.redirect("/");
    }
    
})

app.get("/location",function(req,res){
    // console.log(req.query.lat)
    geocode.forecast(req.query.lat,req.query.long,(error,forecastdata)=>{
        if(error)
        {
           return res.send({
               error:error
           }) 
        }
        // console.log(data.location);
        console.log(forecastdata.currently.summary);
        summary = forecastdata.currently.summary;
        temp = forecastdata.currently.temperature;
        windSpeed = forecastdata.currently.windSpeed;
        pressure = forecastdata.currently.pressure;
        humidity = forecastdata.currently.humidity;
        visibility = forecastdata.currently.visibility;
        uvIndex = forecastdata.currently.uvIndex;
        time = forecastdata.currently.time;
        // img = forecastdata.currently.icon + ".jpg"
        // res.render("index",{
        //     summary: summary,
        //     temp: temp,
        //     humidity: humidity,
        //     pressure: pressure,
        //     windspeed: windSpeed,
        //     visibility: visibility,
        //     uvindex: uvIndex,
        //     time: time
        // })
        res.redirect("/")
    })
});


app.listen(process.env.PORT || 3000,function(){
    console.log("server started");
});