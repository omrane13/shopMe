const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const cors =require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const productRoutes = require('./Routes/productRoutes');
const AdminRouter = require('./Routes/AdminRouter');
const userRoutes = require('./Routes/userRoutes');
const orderRoutes = require('./Routes/orderRoutes');


//const stripeRoutes = require("./Routes/stripe");
//app.use("/api/checkout", stripeRoutes);


require('dotenv').config();
require('./Models/db');
const PORT= process.env.PORT || 8000;


app.get('/ping', (req,res) => {
    res.send('pong');});
app.use(bodyParser.json());
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', AuthRouter);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/admin', AdminRouter);
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})