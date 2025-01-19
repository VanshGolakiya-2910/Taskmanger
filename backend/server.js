const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskroutes');
// const projectRoutes = require('./routes/projectRoutes');
// const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Middleware to parse JSON

app.use('/api', taskRoutes);
// app.use('/api', projectRoutes);
// app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
