import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v1.0.0",
    title: "Swagger Demo Project",
    description: "Implementation of Swagger with TypeScript",
  },
  tags: [
    {
      name: "Users",
      description: "Users"
    },
    {
      name: "Auth",
      description: "Auth"
    },
    {
      name: "Meals",
      description: "Meals"
    },
  ],
  servers: [
    {
      url: "http://localhost:3333",
      description: "",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
};

const outputFile = "../swagger_output.json";
const endpointsFiles = ["./src/router/index.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
