const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sport Stadium API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [{ url: "http://localhost:5003" }],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsDoc(options);
