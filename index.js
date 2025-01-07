const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

// Enable CORS
const cors = require('cors');
app.use(cors());

// API endpoint to check the agent status
app.get('/check-agent', async (req, res) => {
  const { id } = req.query; // Get the ID from the query params
  const url = `https://ised-isde.canada.ca/cipo/trademark-search/${id}?lang=eng`;

  try {
    // Fetch the page content
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML into cheerio
    const $ = cheerio.load(html);

    // Check if the agent exists by searching for the <h3> element with class 'h3-normal' and its text
    const isAgentFound = $('h3.h3-normal').filter((i, el) => $(el).text().trim() === 'Agent').length > 0;

    // Return the result as a JSON response
    res.json({ agentStatus: isAgentFound ? 'TRUE' : 'FALSE' });
  } catch (error) {
    console.error('Error checking agent for ID:', error);
    res.status(500).json({ error: 'Error checking agent' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
