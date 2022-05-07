//connect with DB and define schema
const mongoose= require("mongoose");

mongoose.connect("mongodb://localhost:27017/bunnyLogin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=> {
    console.log("connection to database is successfull");
}).catch((e)=> {
    console.log(e);
})

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    
    },
    cpassword: {
        type: String,
        required: true,
    },    
});

const Register= new mongoose.model("bunnyLogin", employeeSchema);

module.exports= Register;