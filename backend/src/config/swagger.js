const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SecureAuth API",
      version: "1.0.0",
      description: "Full-stack Authentication API with JWT, OTP 2FA, Role-based Access Control",
    },
    servers: [{ url: "/api", description: "API Server" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
