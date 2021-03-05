const mountRoutes = require('./routes')
const settings = require('./settings');
const express = require("express");
const cors = require("cors");
const app =  express();


// Middleware
app.use(cors());
app.use(express.json());

mountRoutes(app)

app.listen(settings.server_port, () => {
    console.log("Server has started on port: " + settings.server_port);
});