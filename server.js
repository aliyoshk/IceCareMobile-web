import express from 'express';
import path from 'path';
import cors from 'cors'; 
import { fileURLToPath } from 'url';

const app = express();

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for your frontend domain
const allowedOrigins = ['https://ice-care-web-ada4a7f432c7.herokuapp.com'];

app.use(cors({
  origin: allowedOrigins,  // Allow specific frontend domain
  methods: 'GET,POST,PUT,DELETE,OPTIONS',  // Allow specific HTTP methods
  allowedHeaders: 'Content-Type, Authorization',  // Allow specific headers
  credentials: true,  // Allow credentials (e.g., cookies, headers, etc.)
}));

// Handle preflight requests for CORS (OPTIONS)
app.options('*', cors({
  origin: allowedOrigins,
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
}));

// Serve static files from the dist directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Handle SPA: Return index.html for all unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
