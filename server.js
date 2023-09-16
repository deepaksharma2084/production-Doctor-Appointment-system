const express = require("express");
const cors = require("cors");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require('path');


//dot env config
dotenv.config();

//mongodb connection
connectDB();

const app = express();
app.use(moragan("dev"));
app.use(express.json());
app.use(cors());

//route
// app.post('/api/v1/user/register',(req,res)=>{
//     console.log('Received form data:', req.body);
//     //console.log('name is',req.body);
//     res.status(200).send({
//         message:'server running',
//     })
// });

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);


//static files 

app.use(express.static(path.join(__dirname,'./client/build')))

app.get("*",function(req,res){

  res.sendFile(path.join(__dirname,"./client/build/index.html"))
 
});



// app.post("/api/v1/doctor/updateProfile", (req, res) => {
//   res.send("Hello, World!");
// });

// app.post('/api/v1/user/register', (req,res)=>{

//     res.send('server is running fine')
// })

// app.use('api/v1/user/registervv',(req,res,next)=>{

//     res.send('yes it is okay')
//     next();

// })

//app.use('api/v1/user',userRoutes)

// app.post("/api/v1/doctor/getdoctorinfo", (req, res) => {
//   res.send("Hello, World!");
// });

//port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  // console.log(`server is running ${process.env.NODE_MODE} on port ${port}`);
});
