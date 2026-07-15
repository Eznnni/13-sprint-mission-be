import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Panda Market",
      version: "1.0.0",
      description: "판다마켓 중고마켓 & 커뮤니티 백엔드 API 명세서",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "개발 서버",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "여기에 로그인 후 발급받은 accessToken을 넣어주세요.",
        },
        //cookieAuth: {
        //type: "apiKey",
        //in: "cookie",
        //name: "accessToken",
        //description: "Access Token 쿠키",
        //},
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;
