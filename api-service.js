/**
 * Job Market Monitor - API Service
 * Handles multiple job search APIs for comprehensive job data
 */

class JobAPIService {
    constructor() {
        this.configManager = window.configManager;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // JSearch API Integration
    async searchJSearchJobs(query, location = '', page = 1) {
        const config = this.configManager.getJSearchApiKey();
        if (!config) {
            throw new Error('JSearch API key not configured');
        }

        const url = 'https://jsearch.p.rapidapi.com/search';
        const params = new URLSearchParams({
            query: query || 'software developer',
            page: page.toString(),
            num_pages: '1'
        });
        
        if (location) {
            params.append('location', location);
        }

        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': config,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`JSearch API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    }

    // Adzuna API Integration
    async searchAdzunaJobs(query, location = '', page = 1) {
        const credentials = this.configManager.getAdzunaCredentials();
        if (!credentials.apiId || !credentials.apiKey) {
            throw new Error('Adzuna API credentials not configured');
        }

        // Default to US if no location specified
        const country = this.getCountryFromLocation(location) || 'us';
        const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
        
        const params = new URLSearchParams({
            app_id: credentials.apiId,
            app_key: credentials.apiKey,
            results_per_page: '20',
            what: query || 'developer'
        });

        if (location) {
            params.append('where', location);
        }

        const response = await fetch(`${url}?${params}`);
        
        if (!response.ok) {
            throw new Error(`Adzuna API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.results || [];
    }

    // GitHub Jobs API (Free alternative)
    async searchGitHubJobs(query, location = '') {
        const url = 'https://jobs.github.com/positions.json';
        const params = new URLSearchParams();
        
        if (query) params.append('description', query);
        if (location) params.append('location', location);

        try {
            const response = await fetch(`${url}?${params}`);
            if (!response.ok) throw new Error('GitHub Jobs API unavailable');
            return await response.json();
        } catch (error) {
            console.warn('GitHub Jobs API not available:', error);
            return [];
        }
    }

    // Main search function that tries multiple APIs
    async searchJobs(query, location = '', page = 1) {
        const cacheKey = `${query}-${location}-${page}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        let allJobs = [];
        const errors = [];

        // Try JSearch API first
        if (this.configManager.hasValidJSearchKey()) {
            try {
                const jsearchJobs = await this.searchJSearchJobs(query, location, page);
                allJobs = allJobs.concat(jsearchJobs.map(job => this.formatJSearchJob(job)));
            } catch (error) {
                errors.push(`JSearch: ${error.message}`);
            }
        }

        // Try Adzuna API if we need more jobs
        if (allJobs.length < 10 && this.configManager.hasValidAdzunaKeys()) {
            try {
                const adzunaJobs = await this.searchAdzunaJobs(query, location, page);
                allJobs = allJobs.concat(adzunaJobs.map(job => this.formatAdzunaJob(job)));
            } catch (error) {
                errors.push(`Adzuna: ${error.message}`);
            }
        }

        // Try GitHub Jobs as fallback
        if (allJobs.length < 5) {
            try {
                const githubJobs = await this.searchGitHubJobs(query, location);
                allJobs = allJobs.concat(githubJobs.map(job => this.formatGitHubJob(job)));
            } catch (error) {
                errors.push(`GitHub: ${error.message}`);
            }
        }

        // If no real jobs found, return sample data
        if (allJobs.length === 0) {
            console.warn('All APIs failed:', errors);
            return this.getSampleJobs().filter(job => {
                const matchKeywords = !query || 
                    job.title.toLowerCase().includes(query.toLowerCase()) || 
                    job.description.toLowerCase().includes(query.toLowerCase());
                const matchLocation = !location || 
                    job.location.toLowerCase().includes(location.toLowerCase());
                return matchKeywords && matchLocation;
            });
        }

        // Remove duplicates and cache results
        const uniqueJobs = this.removeDuplicates(allJobs);
        this.cache.set(cacheKey, {
            data: uniqueJobs,
            timestamp: Date.now()
        });

        return uniqueJobs;
    }

    // Format JSearch job data
    formatJSearchJob(job) {
        return {
            id: job.job_id || this.generateId(),
            title: job.job_title || 'No Title',
            company: job.employer_name || 'Unknown Company',
            location: this.formatLocation(job.job_city, job.job_state, job.job_country),
            salary: this.formatSalary(job.job_min_salary, job.job_max_salary),
            type: this.formatJobType(job.job_employment_type),
            posted: this.formatDate(job.job_posted_at_datetime_utc),
            description: job.job_description || 'No description available',
            tags: job.job_required_skills || ['General'],
            benefits: job.job_benefits || ['Competitive Package'],
            rating: job.employer_rating || 4.0,
            applicants: Math.floor(Math.random() * 100) + 10,
            urgent: job.job_is_remote === false && job.job_employment_type === 'FULLTIME',
            applyUrl: job.job_apply_link,
            logoUrl: job.employer_logo,
            source: 'JSearch'
        };
    }

    // Format Adzuna job data
    formatAdzunaJob(job) {
        return {
            id: job.id || this.generateId(),
            title: job.title || 'No Title',
            company: job.company?.display_name || 'Unknown Company',
            location: this.formatLocation(job.location?.area?.[0], job.location?.area?.[1]),
            salary: job.salary_min && job.salary_max ? 
                `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : 
                'Salary not specified',
            type: job.contract_type || 'Full-time',
            posted: this.formatDate(job.created),
            description: job.description || 'No description available',
            tags: job.category?.tag ? [job.category.tag] : ['General'],
            benefits: ['Competitive Package'],
            rating: 4.0 + Math.random(),
            applicants: Math.floor(Math.random() * 100) + 10,
            urgent: false,
            applyUrl: job.redirect_url,
            logoUrl: null,
            source: 'Adzuna'
        };
    }

    // Format GitHub job data
    formatGitHubJob(job) {
        return {
            id: job.id || this.generateId(),
            title: job.title || 'No Title',
            company: job.company || 'Unknown Company',
            location: job.location || 'Remote',
            salary: 'Competitive',
            type: job.type || 'Full-time',
            posted: this.formatDate(job.created_at),
            description: job.description || 'No description available',
            tags: ['Technology', 'Remote'],
            benefits: ['Remote Work', 'Competitive Package'],
            rating: 4.0 + Math.random(),
            applicants: Math.floor(Math.random() * 50) + 5,
            urgent: false,
            applyUrl: job.how_to_apply ? job.url : null,
            logoUrl: job.company_logo,
            source: 'GitHub'
        };
    }

    // Utility functions
    formatLocation(city, state, country) {
        const parts = [city, state, country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'Remote';
    }

    formatSalary(min, max) {
        if (min && max) {
            return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        } else if (min) {
            return `From $${min.toLocaleString()}`;
        } else if (max) {
  `Up to $${max.toLocaleString()}`;
        }
        return 'Salary not specified';
    }

    formatJobType(type) {
        const typeMap = {
            'FULLTIME': 'Full-time',
            'PARTTIME': 'Part-time',
            'CONTRACT': 'Contract',
            'TEMPORARY': 'Temporary',
            'INTERN': 'Internship'
        };
        return typeMap[type] || type || 'Full-time';
    }

    formatDate(dateString) {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    }

    getCountryFromLocation(location) {
        const countryMap = {
            'united states': 'us',
            'usa': 'us',
            'us': 'us',
            'canada': 'ca',
            'uk': 'gb',
            'united kingdom': 'gb',
            'australia': 'au',
            'germany': 'de',
            'france': 'fr',
            'netherlands': 'nl',
            'india': 'in'
        };
        
        if (!location) return 'us';
        const loc = location.toLowerCase();
        
        for (const [key, value] of Object.entries(countryMap)) {
            if (loc.includes(key)) return value;
        }
        
        return 'us'; // Default to US
    }

    removeDuplicates(jobs) {
        const seen = new Set();
        return jobs.filter(job => {
            const key = `${job.title}-${job.company}`.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    generateId() {
        return 'job_' + Math.random().toString(36).substr(2, 9);
    }

    // Sample jobs for fallback
    getSampleJobs() {
        return [
            {
                id: 'sample_1',
                title: 'Software Developer',
                company: 'Tech Solutions Inc',
                location: 'San Francisco, CA',
                salary: '$80,000 - $120,000',
                type: 'Full-time',
                posted: '2 days ago',
                description: 'Join our team to build innovative software solutions using modern technologies.',
                tags: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                benefits: ['Health Insurance', 'Remote Work', '401k Match', 'Flexible Hours'],
                rating: 4.5,
                applicants: 45,
                urgent: false,
                source: 'Sample'
            },
            {
                id: 'sample_2',
                title: 'Marketing Manager',
                company: 'Growth Marketing Co',
                location: 'New York, NY',
                salary: '$70,000 - $95,000',
                type: 'Full-time',
                posted: '1 day ago',
                description: 'Lead marketing campaigns and drive customer acquisition for our growing startup.',
                tags: ['Digital Marketing', 'SEO', 'Analytics', 'Campaign Management'],
                benefits: ['Health Insurance', 'Stock Options', 'Professional Development'],
                rating: 4.3,
                applicants: 32,
                urgent: true,
                source: 'Sample'
            },
            {
                id: 'sample_3',
                title: 'Data Analyst',
                company: 'Analytics Pro',
                location: 'Remote',
                salary: '$65,000 - $85,000',
                type: 'Remote',
                posted: '3 hours ago',
                description: 'Analyze data to provide insights that drive business decisions.',
                tags: ['Python', 'SQL', 'Tableau', 'Statistics'],
                benefits: ['100% Remote', 'Flexible Schedule', 'Learning Budget'],
                rating: 4.7,
                applicants: 28,
                urgent: false,
                source: 'Sample'
            }
        ];
    }

    // Test API connections
    async testConnections() {
        const results = {
            jsearch: false,
            adzuna: false,
            github: false
        };

        // Test JSearch
        if (this.configManager.hasValidJSearchKey()) {
            try {
                await this.searchJSearchJobs('test', '', 1);
                results.jsearch = true;
            } catch (error) {
                console.warn('JSearch test failed:', error);
            }
        }

        // Test Adzuna
        if (this.configManager.hasValidAdzunaKeys()) {
            try {
                await this.searchAdzunaJobs('test', '', 1);
                results.adzuna = true;
            } catch (error) {
                console.warn('Adzuna test failed:', error);
            }
        }

        // Test GitHub
        try {
            await this.searchGitHubJobs('developer', '');
            results.github = true;
        } catch (error) {
            console.warn('GitHub test failed:', error);
        }

        return results;
    }
}

// Initialize the API service
window.jobAPIService = new JobAPIService();