const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose=require('mongoose')
dotenv.config();

const app = express();


app.use(cors({ origin: '*' }));
app.use(express.json());



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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
