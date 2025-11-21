// API Configuration Example
// Copy this file to api-config.js and add your actual API keys

const API_CONFIG = {
    // JSearch API (RapidAPI)
    // Get your key from: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
    JSEARCH_API_KEY: 'your_jsearch_api_key_here',
    
    // Adzuna API
    // Get your credentials from: https://developer.adzuna.com/
    ADZUNA_API_ID: 'your_adzuna_app_id_here',
    ADZUNA_API_KEY: 'your_adzuna_app_key_here'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} else {
    window.API_CONFIG = API_CONFIG;
}