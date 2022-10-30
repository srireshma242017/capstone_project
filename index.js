const express = require("express");
const app = express();
const port = 1000;
const Converter = require("node-temperature-converter");

const request = require("request");

app.set('view engine','ejs');


var admin = require("firebase-admin");

var serviceAccount = require("./key.json");  
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());


app.use(express.urlencoded({extended:true}));

const db = admin.firestore();

db.settings({ ignoreUndefinedProperties: true })
app.use( express.static( "views" ) );

app.get("/",(req,res)=>{
  res.render('home');
});


app.get("/signup",(req,res)=>{
    res.render('signup');
});


app.get("/signupsubmit",(req,res)=>{
    
    const full_name = req.query.sfullname;
    const email = req.query.semail;
    const password = req.query.spassword;
    const repeatpassword = req.query.srpassword;

    if(password === repeatpassword) {
        db.collection("data")
        .add({
          name: full_name,
          email: email,
          password: password,
          conformpassword : repeatpassword,

          
        })
        .then(() => {
          res.render("successsign");
        });
        
      } 
      else {
        res.send("<center><h1 style=\"padding-top: 20%\">PASSWORD AND CONFORM PASSWORD SHOULD BE SAME</h1></center>")
      }
    
});
app.get("/login",(req,res)=>{
    res.render('login');
});

app.get('/loginsubmit', (req, res) => {
    const email = req.query.lemail;
    const password = req.query.lpassword;
    db.collection("data")
        .where("email", "==", email)
        .where("password", "==", password)
        .get()
        .then((docs) => {
            if(docs){
              res.render("main");
            }else{
                res.render("wrong");
            }
        
        });
 });


app.get("/forgotPassword",(req,res)=>{
  
    res.render('forgotPassword');
});
app.get("/gettmp1", function (req, res) {
  res.render("main");
});
app.get("/gettmp", function (req, res) {
  const tmpnumber1 = req.query.tmp;
  const select = req.query.scale;
  const tmpnumber=parseInt(tmpnumber1);
  if(select=="celsius"){
    const celsius = new Converter.Celsius(tmpnumber);
    const x = celsius.toFahrenheit();
    const y = celsius.toKelvin();
    res.render("output", {
      Celsius:tmpnumber,
      Fahrenheit : x,
      Kelvin : y     
  });
  }else if(select=="fahrenheit"){
    const fahrenheit = new Converter.Fahrenheit(tmpnumber);
    const z = fahrenheit.toCelsius();
    const w = fahrenheit.toKelvin();
    res.render("output", {
      Celsius : z,
      Fahrenheit:tmpnumber,
      Kelvin : w    
  });
  }else{
    const kelvin = new Converter.Kelvin(tmpnumber);
    const k = kelvin.toCelsius();
    const l = kelvin.toFahrenheit();
    res.render("output", {
      Celsius : k,
      Fahrenheit : l,
      Kelvin : tmpnumber      
  });
  }    
});

app.listen(port ,() =>{
  console.log("Application is running in the server");
});