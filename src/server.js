// const express = require('express');
// const serveStatic = require('serve-static');
// const path = require('path');

// const app = express();

// app.use('/', serveStatic(path.join(__dirname, '/dist')))

// const PORT = process.env.PORT || 5000;

// app.listen(PORT);

// console.log('Listening on port'+ PORT)


import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
