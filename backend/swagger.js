const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Anonymous Social Feed API",
      version: "1.0.0",
      description:
        "API for creating anonymous posts, likes, comments, and comment replies."
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server"
      }
    ],

    components: {
      securitySchemes: {
        anonymousCookie: {
          type: "apiKey",
          in: "cookie",
          name: "anonymous_id"
        }
      }
    }
  },

  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;