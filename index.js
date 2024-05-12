const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const channelRoute = require("./routes/channelRoute");
const authRoute = require("./routes/authRoutes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const basePath = "/v1/api";

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  next();
});

app.use('/v1/api/users', userRoute);
app.use('/v1/api/channels', channelRoute);
app.use('/v1/api/auth', authRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
