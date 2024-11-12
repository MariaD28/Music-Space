const axios = require('axios');
const GENIUS_API_BASE_URL = 'https://api.genius.com';
const ACCESS_TOKEN = 'h2hj685nVwTP5S_PdEq34KhtrlnIZJPEOV_Ihk-6qtICl_lOsvwWJJort-DuRKvH'; // Replace with your Genius API access token

const geniusApi = axios.create({
    baseURL: GENIUS_API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
});

const searchSongs = async (query) => {
    try {
        const response = await geniusApi.get('/search', {
            params: { q: query }
        });
        return response.data.response.hits.map(hit => hit.result);
    } catch (error) {
        console.error('Error fetching data from Genius API:', error);
        throw error;
    }
};

const getSongLyrics = async (songPath) => {
    try {
        const response = await axios.get(`https://genius.com${songPath}`);
        // Parse lyrics from the response
        // Note: Genius API does not provide direct lyrics data. You need to scrape or parse the lyrics from the song page HTML
        const lyrics = response.data.match(/<div class="lyrics">(.*?)<\/div>/)[1];
        return lyrics;
    } catch (error) {
        console.error('Error fetching song lyrics:', error);
        throw error;
    }
};

module.exports = { searchSongs, getSongLyrics };
