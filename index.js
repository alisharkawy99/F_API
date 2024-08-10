import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { name } from "ejs";

const app= express();
const port=3000;
var weather_APi='45684b1700ec38c4a0422c28165f25f6';
var city='';
var country='';
var response='';
var temperature=0;
var enter="Please enter your country and city";
var lat=0;
var lon=0;
var background_image=[];
//Use Public folder and body parser to get the value from entered data

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/",async(req,res)=>{
   
    try {
        var result=await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=5&appid=${weather_APi}`);
        
        for(var i=0;i<result.data.length;i++){
            
            if(result.data[i].country===country){
               lat =JSON.stringify(result.data[i].lat);  
               lon=JSON.stringify(result.data[i].lon);
            }
        }
    } catch (error) {
        res.render("index.ejs",{
            error: error.response.data
        })
    }
    try {
       
        result=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_APi}`);
        response=result.data.weather[0].main;
        const{temp}=result.data.main;
        const icon_code=result.data.weather[0].icon;
        temperature=temp.toPrecision(2)-273;
       
        
        res.render("index.ejs",{
            response: response,
            City:city,
            temperature:temperature,
            icon:icon_code,
            background_image
            
        });
    } catch (error) {
        res.render("index.ejs",{
            error: "Error"
        })
    }
    
});


app.post("/",(req,res)=>{
    city=req.body.City;
    country=req.body.country;
    const images={
        EG:"egypt.jpg",
        FR:"Paris.jpg",
        DE:"Berlin.jpeg",
        US:"LA.jpg",
        IT:"venice.jpeg",
        ES:"Barcelona.jpg",
    }
    background_image=images[country];
    res.redirect("/");
});


app.listen(port,()=>{
    console.log(`Running on port ${port}`);
});