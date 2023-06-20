const swaggerAutogen = require('swagger-autogen')();

const doc = {
   info: {
      title: 'Libraray API',
      description: 'API for a library',
   },
   host: 'localhost:3000',
   schemes: ['http'],
};

const outputFile = './public/files/swagger-output.json';
const endpointsFiles = ['./routes/index.js', './app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
