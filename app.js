const express= require("express");
const app=express();
const path= require("path"); //this is to join the path ahead of the main directory
// require("./db/conn");
const Register= require("./registers"); //this is schema in database
const hbs= require('hbs');
const session= require("express-session");
const { Store } = require("express-session");

//To get all data from webpage (request body)
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Template engine settings
app.use(express.static("public"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials"); //partials kaha hai batana padta hai saale ko

//Session
app.use(session({
    secret: "onthewaytopalace",
    resave: false,
    saveUninitialized:false
}));

//ENDPOINTS
app.get("/", (req,res)=> {
    res.render("index");
});

app.post("/", async(req, res)=> {
    const password= req.body.password;
    const cpassword= req.body.cpassword;
    if(password== cpassword)
    {
        const registerEmployee= new Register({
            name: req.body.thename,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword,
        });
        registerEmployee.save();
        res.render("login");
    }
    else
    {
        res.send("Passwords are not matching.")
    }

});


app.get("/login", (req, res)=> {
    res.render("login");
})

app.post("/login", async(req, res)=> {
    const email= req.body.email;
    const pass= req.body.password;
    const getEmail= await Register.findOne({email: email});
    if(getEmail.password== pass){
        if(req.session.email==email){
            console.log("destroying " + req.session.email);
            req.session.destroy((err)=>{
                console.log(err);
            });
            res.redirect("/login");
        }

        let sess= req.session;
        sess.name= getEmail.name;
        sess.email= getEmail.email;
        res.redirect("/dashboard");
    }  
})


app.get("/dashboard", (req,res)=> {
    if(req.session.email){
        res.render("dashboard", {userName: req.session.name});
    }
    else{
        res.redirect("/login");
    }
});

app.post("/dashboard", (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }
        res.redirect("/login");
    })
});

app.listen(3000,'192.168.130.70' || 'localhost',function() {
    console.log('Application worker ' + process.pid + ' started...');
  }
  );