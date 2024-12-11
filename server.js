// server.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('./cloudinaryConfig');  // Import Cloudinary config
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Middleware to parse incoming request body
app.use(express.json());

// Set up multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'media',
  password: 'vishal4012',
  port: 5432,
});

// API to upload video
app.post('/upload-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('No video file uploaded');
      return res.status(400).send('No video file uploaded');
    }

    console.log('Received video upload request');

    // Upload the video to Cloudinary
    console.log('Uploading video to Cloudinary...');
    cloudinary.uploader.upload_stream(
      { resource_type: 'video', public_id: `videos/${Date.now()}` },
      async (error, result) => {
        if (error) {
          console.error('Error uploading video to Cloudinary:', error);
          return res.status(500).send('Error uploading video to Cloudinary');
        }

        console.log('Video uploaded to Cloudinary successfully:', result);

        // Save video data to PostgreSQL
        const videoUrl = result.secure_url;
        const title = req.body.title || 'Untitled Video'; // Get title from request body

        console.log(`Saving video data to PostgreSQL: ${title}, ${videoUrl}`);

        const query = 'INSERT INTO videos (title, video_url) VALUES ($1, $2) RETURNING *';
        const values = [title, videoUrl];

        try {
          const dbResult = await pool.query(query, values);
          console.log('Video data saved to PostgreSQL:', dbResult.rows[0]);

          // Send a success response to the client
          res.status(200).json({
            message: 'Video uploaded and saved successfully',
            video: dbResult.rows[0],
          });
        } catch (err) {
          console.error('Error saving video to PostgreSQL:', err);
          res.status(500).send('Error saving video data to database');
        }
      }
    ).end(req.file.buffer);

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
