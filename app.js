const express = require('express')
const app = express()

require("dotenv").config()
// IMPORT ROUTES
const productRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");

// MIDDELWARE
app.use(express.static('public'))
app.use(express.urlencoded({ extended:true}))
app.use(express.json())

app.use("/api/",productRoutes)
app.use("/api/orders",ordersRoutes)
app.use("/api/",userRoutes)


app.listen(8080, () => console.log("Server started"))
