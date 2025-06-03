const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose=require('mongoose')
const cloudinary = require('cloudinary').v2
const userRoutes=require('./routes/UserRoutes')
dotenv.config();

const app = express();


app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/user',userRoutes)


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
});

const connectCloudinary = async () => {
  if (
    !process.env.CLOUDINARY_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET_KEY
  ) {
    console.error('Cloudinary environment variables are missing');
    throw new Error('Missing Cloudinary credentials');
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  });

  console.log('✅ Cloudinary configured successfully');
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectCloudinary()
});
