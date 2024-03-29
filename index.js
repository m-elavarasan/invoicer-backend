const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const channelRoute = require("./routes/channelRoute");
const authRoute = require("./routes/authRoutes");
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const basePath = "/v1/api";

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// app.use('/api', require('./routes/index'));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/v1/api/users', userRoute);
app.use('/v1/api/channels', channelRoute);
app.use('/v1/api/auth', authRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
