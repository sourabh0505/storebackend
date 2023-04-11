require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
var bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express();

const authRoutes = require("./routes/auth.js")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")
const paymentRoutes = require("./routes/payementRotes")


app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors())

app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.options('*', cors());

//My Routes
console.log(process.env.SECRET);
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes);
app.use("/api",paymentRoutes);

//Port
const port = process.env.PORT || 5000;


const StartServer = async () => {
    await mongoose.connect(process.env.DATABASE,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex: true
    }).then(() => {
        console.log("DB CONNECTED")
    }).catch(function(error){
        console.log("Error Ocurred: ",error);
    })
    
    //Starting a Server
    app.listen(port, () => {
        console.log(`app is running at ${port}`);
    })
}

StartServer();
