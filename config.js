// Configuration loader for Job Market Monitor
// This file handles API configuration securely

class ConfigManager {
    constructor() {
        this.config = {
            jsearchApiKey: '',
            jsearchApiHost: 'jsearch.p.rapidapi.com',
            adzunaApiId: '',
            adzunaApiKey: ''
        };
        this.loadConfig();
    }

    loadConfig() {
        // Load from localStorage if available
        const savedKey = localStorage.getItem('jsearch_api_key');
        if (savedKey) {
            this.config.jsearchApiKey = savedKey;
        }
        
        const savedAdzunaId = localStorage.getItem('adzuna_api_id');
        const savedAdzunaKey = localStorage.getItem('adzuna_api_key');
        if (savedAdzunaId && savedAdzunaKey) {
            this.config.adzunaApiId = savedAdzunaId;
            this.config.adzunaApiKey = savedAdzunaKey;
        }
    }

    setJSearchApiKey(apiKey) {
        this.config.jsearchApiKey = apiKey;
        localStorage.setItem('jsearch_api_key', apiKey);
        if (typeof showNotification === 'function') {
            showNotification('JSearch API key configured! 🔑', 'success');
        }
    }

    setAdzunaCredentials(apiId, apiKey) {
        this.config.adzunaApiId = apiId;
        this.config.adzunaApiKey = apiKey;
        localStorage.setItem('adzuna_api_id', apiId);
        localStorage.setItem('adzuna_api_key', apiKey);
        if (typeof showNotification === 'function') {
            showNotification('Adzuna API credentials configured! 🔑', 'success');
        }
    }

    getJSearchApiKey() {
        return this.config.jsearchApiKey;
    }

    getJSearchApiHost() {
        return this.config.jsearchApiHost;
    }

    getAdzunaCredentials() {
        return {
            apiId: this.config.adzunaApiId,
            apiKey: this.config.adzunaApiKey
        };
    }

    clearAllKeys() {
        this.config.jsearchApiKey = '';
        this.config.adzunaApiId = '';
        this.config.adzunaApiKey = '';
        localStorage.removeItem('jsearch_api_key');
        localStorage.removeItem('adzuna_api_id');
        localStorage.removeItem('adzuna_api_key');
        if (typeof showNotification === 'function') {
            showNotification('All API keys cleared! 🗑️', 'info');
        }
    }

    hasValidJSearchKey() {
        return this.config.jsearchApiKey && this.config.jsearchApiKey.length > 0;
    }

    hasValidAdzunaKeys() {
        return this.config.adzunaApiId && this.config.adzunaApiKey && 
               this.config.adzunaApiId.length > 0 && this.config.adzunaApiKey.length > 0;
    }

    // Legacy methods for backward compatibility
    setApiKey(apiKey) {
        this.setJSearchApiKey(apiKey);
    }

    getApiKey() {
        return this.getJSearchApiKey();
    }

    getApiHost() {
        return this.getJSearchApiHost();
    }

    clearApiKey() {
        this.clearAllKeys();
    }

    hasValidApiKey() {
        return this.hasValidJSearchKey() || this.hasValidAdzunaKeys();
    }
}

// Global config instance
window.configManager = new ConfigManager();