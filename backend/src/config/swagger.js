const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SecureAuth API",
      version: "1.0.0",
      description: "Full-stack JWT Authentication API — Portfolio Project",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
