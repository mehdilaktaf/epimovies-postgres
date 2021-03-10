const mountRoutes = require('./routes')
const settings = require('./settings');
const express = require("express");
const cors = require("cors");
const app =  express();

// API Documentation
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "Movies API",
        version: '1.0.0',
      },
    },
    apis: ["./routes/*.js", "./models/*.js"],
  };

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Middleware
app.use(cors());
app.use(express.json());

mountRoutes(app)

app.listen(settings.server_port, () => {
    console.log("Server has started on port: " + settings.server_port);
});