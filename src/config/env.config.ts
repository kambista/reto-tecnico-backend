export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
  },

  database: {
    mongodbUri: process.env.MONGODB_URI,
  },
});
