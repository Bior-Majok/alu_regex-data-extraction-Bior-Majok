/**
 * Job Market Monitor - Enhanced Application
 * A streamlined job search platform focused on user experience
 * Now powered by JSearch API for real job data
 */

// API Functions using the new JobAPIService
async function searchJobs(query, location = '', page = 1) {
    try {
        if (!window.jobAPIService) {
            throw new Error('API service not initialized');
        }
        
        const jobs = await window.jobAPIService.searchJobs(query, location, page);
        return jobs;
    } catch (error) {
        console.error('Job search error:', error);
        showNotification('Using sample data - API unavailable', 'warning');
        return getSampleJobs();
    }
}

// Legacy function for backward compatibility
function formatJSearchJob(job) {
    return job; // Jobs are already formatted by the API service
}

// API Settings Management
function showApiSettings() {
    const modal = document.getElementById('jobModal');
    const modalBody = document.getElementById('modalBody');
    
    const hasJSearchKey = window.configManager?.hasValidJSearchKey();
    const hasAdzunaKeys = window.configManager?.hasValidAdzunaKeys();
    
    modalBody.innerHTML = `
        <h2>⚙️ API Settings</h2>
        <div class="api-settings">
            <div class="api-section">
                <h3>JSearch API (RapidAPI)</h3>
                <p><strong>Status:</strong> ${hasJSearchKey ? '🟢 Configured' : '🔴 Not Configured'}</p>
                <div class="form-group">
                    <label for="jsearchApiKey">API Key:</label>
                    <input type="password" id="jsearchApiKey" placeholder="Enter JSearch API key" value="${hasJSearchKey ? '••••••••••••••••' : ''}">
                </div>
                <div class="api-info">
                    <p>Get your key from <a href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch" target="_blank">JSearch on RapidAPI</a></p>
                </div>
            </div>
            
            <div class="api-section">
                <h3>Adzuna API</h3>
                <p><strong>Status:</strong> ${hasAdzunaKeys ? '🟢 Configured' : '🔴 Not Configured'}</p>
                <div class="form-group">
                    <label for="adzunaApiId">App ID:</label>
                    <input type="text" id="adzunaApiId" placeholder="Enter Adzuna App ID" value="${hasAdzunaKeys ? '••••••••' : ''}">
                </div>
                <div class="form-group">
                    <label for="adzunaApiKey">App Key:</label>
                    <input type="password" id="adzunaApiKey" placeholder="Enter Adzuna App Key" value="${hasAdzunaKeys ? '••••••••••••••••' : ''}">
                </div>
                <div class="api-info">
                    <p>Get your credentials from <a href="https://developer.adzuna.com/" target="_blank">Adzuna Developer Portal</a></p>
                </div>
            </div>
            
            <div class="api-actions">
                <button onclick="saveAllApiKeys()" class="btn-apply">Save All Keys</button>
                <button onclick="clearAllApiKeys()" class="btn-clear">Clear All</button>
                <button onclick="testApiConnection()" class="btn-save">Test Connection</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Update modal buttons
    document.getElementById('saveJobBtn').style.display = 'none';
    document.getElementById('applyJobBtn').textContent = 'Close';
    document.getElementById('applyJobBtn').onclick = closeModal;
}

function saveAllApiKeys() {
    const jsearchKey = document.getElementById('jsearchApiKey').value.trim();
    const adzunaId = document.getElementById('adzunaApiId').value.trim();
    const adzunaKey = document.getElementById('adzunaApiKey').value.trim();
    
    let saved = false;
    
    if (jsearchKey && jsearchKey !== '••••••••••••••••') {
        window.configManager?.setJSearchApiKey(jsearchKey);
        saved = true;
    }
    
    if (adzunaId && adzunaKey && adzunaId !== '••••••••' && adzunaKey !== '••••••••••••••••') {
        window.configManager?.setAdzunaCredentials(adzunaId, adzunaKey);
        saved = true;
    }
    
    if (saved) {
        showNotification('API keys saved successfully! 🔑', 'success');
        closeModal();
    } else {
        showNotification('Please enter valid API credentials! ⚠️', 'warning');
    }
}

function clearAllApiKeys() {
    if (confirm('Are you sure you want to clear all API keys?')) {
        window.configManager?.clearAllKeys();
        closeModal();
    }
}

// Legacy functions for backward compatibility
function saveApiKey() {
    saveAllApiKeys();
}

function clearApiKey() {
    clearAllApiKeys();
}

async function testApiConnection() {
    const hasJSearch = window.configManager?.hasValidJSearchKey();
    const hasAdzuna = window.configManager?.hasValidAdzunaKeys();
    
    if (!hasJSearch && !hasAdzuna) {
        showNotification('No API keys configured! ⚠️', 'warning');
        return;
    }
    
    showNotification('Testing API connections... 🔄', 'info');
    
    try {
        const testJobs = await searchJobs('software developer', '', 1);
        if (testJobs && testJobs.length > 0) {
            const sources = [...new Set(testJobs.map(job => job.source))];
            showNotification(`API connection successful! Sources: ${sources.join(', ')} ✅`, 'success');
        } else {
            showNotification('APIs connected but no data returned 🤔', 'warning');
        }
    } catch (error) {
        showNotification('API connection test failed! ❌', 'error');
        console.error('API test error:', error);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Wait for config manager to load
    setTimeout(() => {
        initializeApp();
        setupEventListeners();
        loadSampleJobs();
        setupNotifications();
        setupKeyboardNavigation();
        setupAutoRefresh();
        
        // Welcome message
        setTimeout(() => {
            showNotification('Welcome to Job Market Monitor! 🚀', 'success');
        }, 1000);
        
        // Load recommendations after initial load
        setTimeout(loadRecommendations, 2000);
    }, 100);
});

function initializeApp() {
    // Load user preferences
    const preferredView = localStorage.getItem('preferredView') || 'list';
    toggleView(preferredView);
    
    // Load saved data
    loadJobAlerts();
    loadAnalytics();
}

function setupEventListeners() {
    // Navigation
    document.getElementById('dashboardTab').addEventListener('click', () => showSection('dashboard'));
    document.getElementById('savedJobsTab').addEventListener('click', () => showSection('savedJobs'));
    document.getElementById('alertsTab').addEventListener('click', () => showSection('alerts'));
    document.getElementById('analyticsTab').addEventListener('click', () => showSection('analytics'));

    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('keywordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    // Add location input if it doesn't exist
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }

    // Modals and filters
    document.getElementById('advancedFilters').addEventListener('click', showAdvancedFilters);
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });

    // Job alerts
    document.getElementById('createAlert').addEventListener('click', createJobAlert);
    document.getElementById('jobAlerts').addEventListener('click', showQuickAlert);

    // View toggles
    document.getElementById('listView').addEventListener('click', () => toggleView('list'));
    document.getElementById('gridView').addEventListener('click', () => toggleView('grid'));

    // Apply filters
    document.getElementById('applyFilters').addEventListener('click', applyAdvancedFilters);
    document.getElementById('clearFilters').addEventListener('click', clearAdvancedFilters);

    // Auto-save search preferences
    document.getElementById('keywordInput').addEventListener('input', debounce(saveSearchHistory, 500));
    document.getElementById('locationInput').addEventListener('input', debounce(saveSearchHistory, 500));
    
    // Activate filter dropdowns
    document.getElementById('salaryFilter').addEventListener('change', performSearch);
    document.getElementById('jobTypeFilter').addEventListener('change', performSearch);
    document.getElementById('experienceFilter').addEventListener('change', performSearch);
    
    // Real-time search suggestions
    document.getElementById('keywordInput').addEventListener('input', debounce(showSearchSuggestions, 300));
    
    // Job comparison feature
    setupJobComparison();
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + 'Section').classList.add('active');
    
    // Add active class to corresponding nav link
    document.getElementById(sectionName + 'Tab').classList.add('active');
    
    // Load section-specific data with smooth transition
    setTimeout(() => {
        if (sectionName === 'savedJobs') {
            loadSavedJobs();
        } else if (sectionName === 'alerts') {
            loadJobAlerts();
        } else if (sectionName === 'analytics') {
            loadAnalytics();
        }
    }, 150);
    
    // Show section-specific notification
    const sectionMessages = {
        'dashboard': 'Dashboard loaded 📊',
        'savedJobs': 'Saved jobs loaded 💾',
        'alerts': 'Job alerts loaded 🔔',
        'analytics': 'Analytics loaded 📈'
    };
    
    if (sectionMessages[sectionName]) {
        showNotification(sectionMessages[sectionName], 'info');
    }
}

function performSearch() {
    performAdvancedSearch();
}

function getSampleJobs() {
    return [
        {
            id: 1,
            title: 'Marketing Manager',
            company: 'Rwanda Development Board',
            location: 'Kigali, Rwanda',
            salary: '$25,000 - $35,000',
            type: 'Full-time',
            posted: '2 days ago',
            description: 'Lead marketing initiatives to promote Rwanda as a premier investment destination. Develop campaigns for tourism and business development.',
            tags: ['Marketing', 'Campaign Management', 'Tourism', 'Business Development'],
            benefits: ['Health Insurance', 'Housing Allowance', 'Professional Development', 'Annual Leave'],
            rating: 4.8,
            applicants: 45,
            urgent: false
        },
        {
            id: 2,
            title: 'Financial Analyst',
            company: 'Bank of Kigali',
            location: 'Kigali, Rwanda',
            salary: '$20,000 - $28,000',
            type: 'Full-time',
            posted: '1 day ago',
            description: 'Analyze financial data and market trends to support investment decisions. Prepare detailed financial reports and forecasts.',
            tags: ['Financial Analysis', 'Excel', 'Reporting', 'Market Research'],
            benefits: ['Health Insurance', 'Pension Plan', 'Training Programs', 'Performance Bonus'],
            rating: 4.6,
            applicants: 78,
            urgent: false
        },
        {
            id: 3,
            title: 'Hotel Manager',
            company: 'Serena Hotels',
            location: 'Lagos, Nigeria',
            salary: '$30,000 - $45,000',
            type: 'Full-time',
            posted: '3 hours ago',
            description: 'Oversee daily hotel operations ensuring exceptional guest experience. Manage staff, budgets, and maintain service standards.',
            tags: ['Hotel Management', 'Customer Service', 'Staff Management', 'Operations'],
            benefits: ['Accommodation', 'Health Insurance', 'Staff Meals', 'Career Growth'],
            rating: 4.9,
            applicants: 23,
            urgent: true
        },
        {
            id: 4,
            title: 'Agricultural Extension Officer',
            company: 'Ministry of Agriculture',
            location: 'Nairobi, Kenya',
            salary: '$18,000 - $25,000',
            type: 'Full-time',
            posted: '5 hours ago',
            description: 'Support smallholder farmers with modern farming techniques and crop management. Conduct training sessions and field demonstrations.',
            tags: ['Agriculture', 'Training', 'Rural Development', 'Crop Management'],
            benefits: ['Government Benefits', 'Health Insurance', 'Transport Allowance', 'Field Allowance'],
            rating: 4.7,
            applicants: 34,
            urgent: false
        },
        {
            id: 5,
            title: 'Human Resources Coordinator',
            company: 'African Union Commission',
            location: 'Addis Ababa, Ethiopia',
            salary: '$35,000 - $50,000',
            type: 'Full-time',
            posted: '1 day ago',
            description: 'Coordinate HR activities across African Union member states. Handle recruitment, staff development, and policy implementation.',
            tags: ['Human Resources', 'Policy Development', 'Recruitment', 'International Relations'],
            benefits: ['International Benefits', 'Health Insurance', 'Education Allowance', 'Diplomatic Status'],
            rating: 4.5,
            applicants: 67,
            urgent: false
        },
        {
            id: 6,
            title: 'Graphic Designer',
            company: 'Creative Africa Agency',
            location: 'Cape Town, South Africa',
            salary: '$22,000 - $32,000',
            type: 'Full-time',
            posted: '4 hours ago',
            description: 'Create visual content for African brands and cultural projects. Design marketing materials, logos, and digital content.',
            tags: ['Graphic Design', 'Adobe Creative Suite', 'Branding', 'Digital Marketing'],
            benefits: ['Creative Freedom', 'Health Insurance', 'Equipment Allowance', 'Flexible Hours'],
            rating: 4.8,
            applicants: 29,
            urgent: false
        },
        {
            id: 7,
            title: 'Supply Chain Coordinator',
            company: 'East African Breweries',
            location: 'Kampala, Uganda',
            salary: '$24,000 - $34,000',
            type: 'Full-time',
            posted: '6 hours ago',
            description: 'Manage supply chain operations across East Africa. Coordinate with suppliers, distributors, and logistics partners.',
            tags: ['Supply Chain', 'Logistics', 'Procurement', 'Operations Management'],
            benefits: ['Company Car', 'Health Insurance', 'Performance Bonus', 'Travel Allowance'],
            rating: 4.4,
            applicants: 52,
            urgent: true
        },
        {
            id: 8,
            title: 'Tourism Guide',
            company: 'Zanzibar Tourism Board',
            location: 'Stone Town, Tanzania',
            salary: '$15,000 - $22,000',
            type: 'Full-time',
            posted: '8 hours ago',
            description: 'Lead cultural and historical tours in Stone Town and surrounding areas. Share knowledge of local history, culture, and traditions.',
            tags: ['Tourism', 'Cultural Heritage', 'Languages', 'Customer Service'],
            benefits: ['Tips Income', 'Health Insurance', 'Training Programs', 'Seasonal Bonus'],
            rating: 4.6,
            applicants: 38,
            urgent: false
        },
        {
            id: 9,
            title: 'Environmental Consultant',
            company: 'Green Belt Movement',
            location: 'Accra, Ghana',
            salary: '$28,000 - $38,000',
            type: 'Full-time',
            posted: '12 hours ago',
            description: 'Assess environmental impact of development projects. Develop sustainability strategies and conservation programs.',
            tags: ['Environmental Science', 'Sustainability', 'Conservation', 'Impact Assessment'],
            benefits: ['Field Allowance', 'Health Insurance', 'Research Budget', 'Conference Attendance'],
            rating: 4.7,
            applicants: 41,
            urgent: true
        },
        {
            id: 10,
            title: 'Education Program Manager',
            company: 'UNICEF Rwanda',
            location: 'Kigali, Rwanda',
            salary: '$40,000 - $55,000',
            type: 'Full-time',
            posted: '1 day ago',
            description: 'Manage education programs for children across Rwanda. Coordinate with schools, communities, and government partners.',
            tags: ['Education', 'Program Management', 'Child Development', 'Community Outreach'],
            benefits: ['UN Benefits', 'Health Insurance', 'Education Support', 'Hardship Allowance'],
            rating: 4.9,
            applicants: 89,
            urgent: false
        },
        {
            id: 11,
            title: 'Backend Developer',
            company: 'ScaleUp Solutions',
            location: 'Denver, CO',
            salary: '$85,000 - $110,000',
            type: 'Full-time',
            posted: '2 days ago',
            description: 'Build robust APIs and microservices architecture. Experience with cloud platforms and database optimization required.',
            tags: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
            benefits: ['Health Insurance', 'Remote Work', '401k Match', 'Flexible Hours'],
            rating: 4.3,
            applicants: 56,
            urgent: false
        },
        {
            id: 12,
            title: 'QA Engineer',
            company: 'TestPro Systems',
            location: 'Portland, OR',
            salary: '$75,000 - $95,000',
            type: 'Full-time',
            posted: '3 days ago',
            description: 'Ensure software quality through automated and manual testing. Design test strategies and maintain CI/CD pipelines.',
            tags: ['Selenium', 'Jest', 'CI/CD', 'Automation'],
            benefits: ['Health Insurance', 'Professional Development', 'Flexible Schedule', 'Remote Work'],
            rating: 4.5,
            applicants: 33,
            urgent: false
        },
        {
            id: 13,
            title: 'Cloud Architect',
            company: 'CloudMasters Inc',
            location: 'Chicago, IL',
            salary: '$135,000 - $165,000',
            type: 'Full-time',
            posted: '1 day ago',
            description: 'Design and implement cloud infrastructure solutions. Lead cloud migration projects and optimize costs.',
            tags: ['AWS', 'Azure', 'Terraform', 'Architecture'],
            benefits: ['Stock Options', 'Health Insurance', 'Certification Budget', 'Bonus'],
            rating: 4.8,
            applicants: 72,
            urgent: true
        },
        {
            id: 14,
            title: 'Business Analyst',
            company: 'DataDriven Corp',
            location: 'Atlanta, GA',
            salary: '$70,000 - $90,000',
            type: 'Full-time',
            posted: '2 days ago',
            description: 'Analyze business requirements and translate them into technical specifications. Work with stakeholders to improve processes.',
            tags: ['SQL', 'Tableau', 'Business Process', 'Analytics'],
            benefits: ['Health Insurance', 'Professional Development', 'Flexible Hours', '401k Match'],
            rating: 4.2,
            applicants: 47,
            urgent: false
        },
        {
            id: 15,
            title: 'Site Reliability Engineer',
            company: 'ReliableTech',
            location: 'San Jose, CA',
            salary: '$125,000 - $155,000',
            type: 'Full-time',
            posted: '4 hours ago',
            description: 'Maintain system reliability and performance at scale. Implement monitoring, alerting, and incident response procedures.',
            tags: ['Kubernetes', 'Monitoring', 'Linux', 'Automation'],
            benefits: ['Stock Options', 'Health Insurance', 'On-call Bonus', 'Remote Work'],
            rating: 4.6,
            applicants: 61,
            urgent: true
        },
        {
            id: 16,
            title: 'Technical Writer',
            company: 'DocuTech Solutions',
            location: 'Remote',
            salary: '$65,000 - $85,000',
            type: 'Remote',
            posted: '1 day ago',
            description: 'Create comprehensive technical documentation and user guides. Collaborate with engineering teams to document APIs and features.',
            tags: ['Technical Writing', 'API Documentation', 'Markdown', 'Git'],
            benefits: ['100% Remote', 'Flexible Hours', 'Equipment Allowance', 'Professional Development'],
            rating: 4.4,
            applicants: 28,
            urgent: false
        },
        {
            id: 17,
            title: 'Scrum Master',
            company: 'AgileWorks',
            location: 'Phoenix, AZ',
            salary: '$85,000 - $105,000',
            type: 'Full-time',
            posted: '3 days ago',
            description: 'Facilitate agile ceremonies and remove impediments for development teams. Coach teams on agile best practices.',
            tags: ['Scrum', 'Agile', 'Jira', 'Team Leadership'],
            benefits: ['Health Insurance', 'Certification Budget', 'Flexible Hours', 'Remote Work'],
            rating: 4.3,
            applicants: 39,
            urgent: false
        },
        {
            id: 18,
            title: 'Database Administrator',
            company: 'DataVault Systems',
            location: 'Dallas, TX',
            salary: '$95,000 - $120,000',
            type: 'Full-time',
            posted: '2 days ago',
            description: 'Manage and optimize database systems for high-performance applications. Ensure data security and backup procedures.',
            tags: ['PostgreSQL', 'MySQL', 'Performance Tuning', 'Backup'],
            benefits: ['Health Insurance', 'On-call Bonus', 'Certification Budget', '401k Match'],
            rating: 4.5,
            applicants: 44,
            urgent: false
        },
        {
            id: 19,
            title: 'UI/UX Researcher',
            company: 'UserFirst Design',
            location: 'San Diego, CA',
            salary: '$80,000 - $105,000',
            type: 'Full-time',
            posted: '5 hours ago',
            description: 'Conduct user research and usability testing to inform design decisions. Create personas and user journey maps.',
            tags: ['User Research', 'Usability Testing', 'Personas', 'Analytics'],
            benefits: ['Health Insurance', 'Research Budget', 'Flexible Hours', 'Creative Freedom'],
            rating: 4.7,
            applicants: 35,
            urgent: true
        },
        {
            id: 20,
            title: 'Solutions Architect',
            company: 'Enterprise Solutions Ltd',
            location: 'Minneapolis, MN',
            salary: '$130,000 - $160,000',
            type: 'Full-time',
            posted: '1 day ago',
            description: 'Design enterprise-level solutions and guide technical implementation. Work with clients to understand requirements and propose solutions.',
            tags: ['Solution Design', 'Enterprise Architecture', 'Client Facing', 'Technical Leadership'],
            benefits: ['Stock Options', 'Health Insurance', 'Travel Allowance', 'Bonus'],
            rating: 4.6,
            applicants: 58,
            urgent: false
        }
    ];
}



async function loadSampleJobs() {
    try {
        // Try to load real jobs first
        const apiJobs = await searchJobs('software developer', '', 1);
        if (apiJobs && apiJobs.length > 0) {
            displayJobs(apiJobs);
            document.getElementById('jobsCount').textContent = `${apiJobs.length} jobs available`;
            
            // Show which APIs are working
            const sources = [...new Set(apiJobs.map(job => job.source))];
            showNotification(`Real job data loaded from: ${sources.join(', ')}! 🌐`, 'success');
            
            // Update API status indicator
            document.getElementById('apiStatus').textContent = `🌐 ${sources.join(' + ')} Active`;
        } else {
            throw new Error('No API data');
        }
    } catch (error) {
        // Fallback to sample jobs
        const jobs = getSampleJobs();
        displayJobs(jobs);
        document.getElementById('jobsCount').textContent = `${jobs.length} jobs available`;
        showNotification('Sample data loaded - Configure API keys for real data 📋', 'info');
        document.getElementById('apiStatus').textContent = '🔴 Sample Data Mode';
    }
}

function showJobDetails(jobId) {
    // Try to find job in current displayed jobs first
    const currentJobs = window.currentJobsData || [];
    let job = currentJobs.find(j => j.id === jobId);
    
    // Fallback to sample jobs if not found
    if (!job) {
        job = getSampleJobs().find(j => j.id === jobId);
    }
    
    if (!job) return;
    
    const modal = document.getElementById('jobModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>${job.title}</h2>
        <div class="job-details">
            <div class="detail-row"><strong>Company:</strong> ${job.company}</div>
            <div class="detail-row"><strong>Location:</strong> ${job.location}</div>
            <div class="detail-row"><strong>Salary:</strong> ${job.salary}</div>
            <div class="detail-row"><strong>Type:</strong> ${job.type}</div>
            <div class="detail-row"><strong>Posted:</strong> ${job.posted}</div>
            <div class="detail-row"><strong>Rating:</strong> ⭐ ${job.rating}</div>
            <div class="detail-row"><strong>Applicants:</strong> ${job.applicants}</div>
        </div>
        <div class="job-description">
            <h3>Description</h3>
            <p>${job.description}</p>
        </div>
        <div class="job-benefits">
            <h3>Benefits</h3>
            <ul>${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}</ul>
        </div>
        <div class="job-skills">
            <h3>Required Skills</h3>
            <div class="skills-tags">
                ${job.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Update modal buttons
    document.getElementById('saveJobBtn').onclick = () => saveJob(jobId);
    document.getElementById('applyJobBtn').onclick = () => applyToJob(jobId);
}

function saveJob(jobId) {
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (!savedJobs.includes(jobId)) {
        savedJobs.push(jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        showNotification('Job saved successfully! 💾', 'success');
    } else {
        showNotification('Job already saved! ✅', 'info');
    }
}

function applyToJob(jobId) {
    // Try to find job in current displayed jobs first
    const currentJobs = window.currentJobsData || [];
    let job = currentJobs.find(j => j.id === jobId);
    
    // Fallback to sample jobs if not found
    if (!job) {
        job = getSampleJobs().find(j => j.id === jobId);
    }
    
    if (!job) return;
    
    // Check if already applied
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const alreadyApplied = applications.some(app => app.jobId === jobId);
    
    if (alreadyApplied) {
        showNotification('You have already applied to this job! ✅', 'info');
        return;
    }
    
    // If job has external apply URL, open it
    if (job.applyUrl) {
        window.open(job.applyUrl, '_blank');
        showNotification('Redirected to external application! 🔗', 'info');
        return;
    }
    
    // Show application form
    showApplicationForm(job);
}

function showApplicationForm(job) {
    const modal = document.getElementById('jobModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="application-form">
            <h2>Apply for ${job.title}</h2>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
            
            <form id="applicationForm">
                <div class="form-group">
                    <label for="fullName">Full Name *</label>
                    <input type="text" id="fullName" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" required>
                </div>
                
                <div class="form-group">
                    <label for="phone">Phone Number *</label>
                    <input type="tel" id="phone" required>
                </div>
                
                <div class="form-group">
                    <label for="experience">Years of Experience *</label>
                    <select id="experience" required>
                        <option value="">Select experience</option>
                        <option value="0-1">0-1 years</option>
                        <option value="2-3">2-3 years</option>
                        <option value="4-5">4-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="coverLetter">Cover Letter</label>
                    <textarea id="coverLetter" rows="4" placeholder="Tell us why you're interested in this position..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="resume">Resume/CV *</label>
                    <input type="file" id="resume" accept=".pdf,.doc,.docx" required>
                    <small>Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
                </div>
                
                <div class="form-group">
                    <label for="portfolio">Portfolio/LinkedIn URL</label>
                    <input type="url" id="portfolio" placeholder="https://">
                </div>
                
                <div class="form-group">
                    <label for="availability">Available Start Date *</label>
                    <input type="date" id="availability" required>
                </div>
                
                <div class="form-group">
                    <label for="salaryExpectation">Salary Expectation</label>
                    <input type="text" id="salaryExpectation" placeholder="e.g., $80,000 - $100,000">
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" id="termsAccept" required>
                    <label for="termsAccept">I agree to the terms and conditions and privacy policy *</label>
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" id="emailUpdates">
                    <label for="emailUpdates">I would like to receive email updates about similar job opportunities</label>
                </div>
            </form>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Update modal buttons
    document.getElementById('saveJobBtn').style.display = 'none';
    document.getElementById('applyJobBtn').textContent = 'Submit Application';
    document.getElementById('applyJobBtn').onclick = () => submitApplication(job.id);
}

function submitApplication(jobId) {
    const form = document.getElementById('applicationForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const experience = document.getElementById('experience').value;
    const resume = document.getElementById('resume').files[0];
    const availability = document.getElementById('availability').value;
    const termsAccept = document.getElementById('termsAccept').checked;
    
    if (!fullName || !email || !phone || !experience || !resume || !availability || !termsAccept) {
        showNotification('Please fill in all required fields! ⚠️', 'warning');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address! ⚠️', 'warning');
        return;
    }
    
    // Validate file size (5MB limit)
    if (resume.size > 5 * 1024 * 1024) {
        showNotification('Resume file size must be less than 5MB! ⚠️', 'warning');
        return;
    }
    
    // Simulate application submission
    const job = getSampleJobs().find(j => j.id === jobId);
    
    // Track application
    let applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const applicationData = {
        jobId: jobId,
        jobTitle: job.title,
        company: job.company,
        appliedDate: new Date().toISOString(),
        status: 'Submitted',
        applicantName: fullName,
        applicantEmail: email,
        experience: experience,
        availability: availability,
        applicationId: 'APP-' + Date.now()
    };
    
    applications.push(applicationData);
    localStorage.setItem('applications', JSON.stringify(applications));
    
    // Show success message
    showApplicationSuccess(applicationData);
}

function showApplicationSuccess(applicationData) {
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="application-success">
            <div class="success-icon">🎉</div>
            <h2>Application Submitted Successfully!</h2>
            <p>Thank you for your interest in the ${applicationData.jobTitle} position at ${applicationData.company}.</p>
            
            <div class="application-details">
                <h3>Application Details:</h3>
                <p><strong>Application ID:</strong> ${applicationData.applicationId}</p>
                <p><strong>Submitted:</strong> ${new Date(applicationData.appliedDate).toLocaleString()}</p>
                <p><strong>Status:</strong> ${applicationData.status}</p>
            </div>
            
            <p>We will review your application and get back to you within 3-5 business days.</p>
            <p>You can track your application status in the "My Applications" section.</p>
        </div>
    `;
    
    // Update modal buttons
    document.getElementById('saveJobBtn').style.display = 'inline-block';
    document.getElementById('saveJobBtn').textContent = 'View My Applications';
    document.getElementById('saveJobBtn').onclick = () => {
        closeModal();
        viewMyApplications();
    };
    
    document.getElementById('applyJobBtn').textContent = 'Close';
    document.getElementById('applyJobBtn').onclick = closeModal;
    
    showNotification(`Application submitted for ${applicationData.jobTitle}! 🚀`, 'success');
}

function loadSavedJobs() {
    const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const allJobs = getSampleJobs();
    const savedJobs = allJobs.filter(job => savedJobIds.includes(job.id));
    
    const savedJobsList = document.getElementById('savedJobsList');
    if (savedJobs.length === 0) {
        savedJobsList.innerHTML = '<div class="no-jobs">No saved jobs yet. Start saving jobs you\'re interested in!</div>';
    } else {
        savedJobsList.innerHTML = savedJobs.map(job => `
            <div class="job-card">
                <h3>${job.title}</h3>
                <div class="job-company">${job.company}</div>
                <div class="job-location">📍 ${job.location}</div>
                <div class="job-salary">💰 ${job.salary}</div>
                <button onclick="removeSavedJob(${job.id})" class="btn-remove">Remove</button>
                <button onclick="showJobDetails(${job.id})" class="btn-view">View Details</button>
            </div>
        `).join('');
    }
}

function removeSavedJob(jobId) {
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    savedJobs = savedJobs.filter(id => id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    loadSavedJobs();
    showNotification('Job removed from saved list! 🗑️', 'info');
}

function toggleView(viewType) {
    localStorage.setItem('preferredView', viewType);
    
    document.getElementById('listView').classList.toggle('active', viewType === 'list');
    document.getElementById('gridView').classList.toggle('active', viewType === 'grid');
    
    const jobsList = document.getElementById('jobsList');
    jobsList.className = `jobs-list ${viewType}-view`;
}

function showAdvancedFilters() {
    document.getElementById('advancedFiltersModal').style.display = 'block';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function applyAdvancedFilters() {
    const companySize = document.getElementById('companySizeFilter').value;
    const industry = document.getElementById('industryFilter').value;
    const datePosted = document.getElementById('datePostedFilter').value;
    
    showNotification('Advanced filters applied! 🔍', 'success');
    closeModal();
    
    // Apply filters to current job list
    performSearch();
}

function clearAdvancedFilters() {
    document.getElementById('companySizeFilter').value = '';
    document.getElementById('industryFilter').value = '';
    document.getElementById('datePostedFilter').value = '';
    showNotification('Filters cleared! 🧹', 'info');
}

function createJobAlert() {
    const keywords = document.getElementById('alertKeywords').value;
    const location = document.getElementById('alertLocation').value;
    const frequency = document.getElementById('alertFrequency').value;
    
    if (!keywords && !location) {
        showNotification('Please enter keywords or location for the alert! ⚠️', 'warning');
        return;
    }
    
    let alerts = JSON.parse(localStorage.getItem('jobAlerts') || '[]');
    const newAlert = {
        id: Date.now(),
        keywords: keywords,
        location: location,
        frequency: frequency,
        created: new Date().toISOString()
    };
    
    alerts.push(newAlert);
    localStorage.setItem('jobAlerts', JSON.stringify(alerts));
    
    // Clear form
    document.getElementById('alertKeywords').value = '';
    document.getElementById('alertLocation').value = '';
    
    showNotification('Job alert created successfully! 🔔', 'success');
    loadJobAlerts();
}

function loadJobAlerts() {
    const alerts = JSON.parse(localStorage.getItem('jobAlerts') || '[]');
    const alertsList = document.getElementById('alertsList');
    
    if (alerts.length === 0) {
        alertsList.innerHTML = '<div class="no-alerts">No job alerts set up yet. Create your first alert above!</div>';
    } else {
        alertsList.innerHTML = alerts.map(alert => `
            <div class="alert-card">
                <div class="alert-info">
                    <strong>Keywords:</strong> ${alert.keywords || 'Any'}<br>
                    <strong>Location:</strong> ${alert.location || 'Any'}<br>
                    <strong>Frequency:</strong> ${alert.frequency}<br>
                    <strong>Created:</strong> ${new Date(alert.created).toLocaleDateString()}
                </div>
                <button onclick="deleteAlert(${alert.id})" class="btn-delete">Delete</button>
            </div>
        `).join('');
    }
}

function deleteAlert(alertId) {
    let alerts = JSON.parse(localStorage.getItem('jobAlerts') || '[]');
    alerts = alerts.filter(alert => alert.id !== alertId);
    localStorage.setItem('jobAlerts', JSON.stringify(alerts));
    loadJobAlerts();
    showNotification('Alert deleted! 🗑️', 'info');
}

function showQuickAlert() {
    const keywords = document.getElementById('keywordInput').value;
    const location = document.getElementById('locationInput').value;
    
    if (keywords || location) {
        document.getElementById('alertKeywords').value = keywords;
        document.getElementById('alertLocation').value = location;
        showSection('alerts');
        showNotification('Quick alert setup ready! 🚀', 'info');
    } else {
        createSmartAlert();
    }
}

function loadAnalytics() {
    // Market summary
    document.getElementById('marketSummary').innerHTML = `
        <div class="summary-stat">📈 Job Market Growth: +18%</div>
        <div class="summary-stat">💰 Average Salary: $32,000</div>
        <div class="summary-stat">🔥 Hottest Skill: Marketing</div>
        <div class="summary-stat">📍 Top Location: Kigali</div>
    `;
    
    // Top skills
    const skills = [
        { name: 'Marketing', demand: 92 },
        { name: 'Financial Analysis', demand: 85 },
        { name: 'Customer Service', demand: 78 },
        { name: 'Project Management', demand: 74 },
        { name: 'Agriculture', demand: 68 }
    ];
    
    document.getElementById('skillsList').innerHTML = skills.map(skill => `
        <div class="skill-item">
            <span class="skill-name">${skill.name}</span>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.demand}%"></div>
            </div>
            <span class="skill-demand">${skill.demand}%</span>
        </div>
    `).join('');
    
    // Live updates
    const updates = [
        '🆕 8 new Marketing Manager jobs posted',
        '📈 Tourism sector salaries up 12%',
        '🔥 Agricultural specialists in high demand',
        '💼 International organizations hiring +25%'
    ];
    
    document.getElementById('liveUpdates').innerHTML = updates.map(update => 
        `<div class="update-item">${update}</div>`
    ).join('');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function setupNotifications() {
    // Add notification styles if not present
    if (!document.querySelector('.notification-styles')) {
        const style = document.createElement('style');
        style.className = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification.success { background: #4CAF50; }
            .notification.error { background: #f44336; }
            .notification.warning { background: #ff9800; }
            .notification.info { background: #2196F3; }
        `;
        document.head.appendChild(style);
    }
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.getElementById('keywordInput').focus();
        }
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function saveSearchHistory() {
    const keywords = document.getElementById('keywordInput').value;
    const location = document.getElementById('locationInput').value;
    
    if (keywords || location) {
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const search = { keywords, location, timestamp: Date.now() };
        
        // Remove duplicates and add to beginning
        history = history.filter(h => h.keywords !== keywords || h.location !== location);
        history.unshift(search);
        
        // Keep only last 10 searches
        history = history.slice(0, 10);
        
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

function saveSearchToHistory(keywords, location) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const search = { keywords, location, timestamp: Date.now() };
    
    history = history.filter(h => h.keywords !== keywords || h.location !== location);
    history.unshift(search);
    history = history.slice(0, 10);
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

// Additional utility functions
function searchTrending(keyword) {
    document.getElementById('keywordInput').value = keyword;
    performSearch();
}

function applySorting() {
    const sortBy = document.getElementById('sortBy').value;
    if (sortBy) {
        showNotification(`Sorted by ${sortBy}! 📊`, 'info');
        performSearch();
    }
}

function calculateSalary() {
    const jobTitle = document.getElementById('jobTitleCalc').value;
    const experience = document.getElementById('experienceCalc').value;
    const location = document.getElementById('locationCalc').value;
    
    if (!jobTitle) {
        showNotification('Please enter a job title! 💼', 'warning');
        return;
    }
    
    // Mock salary calculation
    const baseSalaries = {
        'marketing manager': 30000,
        'financial analyst': 24000,
        'hotel manager': 37000,
        'agricultural officer': 21000,
        'tourism guide': 18000,
        'environmental consultant': 33000,
        'education manager': 47000,
        'hr coordinator': 42000,
        'graphic designer': 27000,
        'supply chain coordinator': 29000
    };
    
    const experienceMultiplier = {
        'entry': 0.8,
        'mid': 1.0,
        'senior': 1.3
    };
    
    const locationMultiplier = {
        'kigali': 1.0,
        'lagos': 1.2,
        'nairobi': 1.1,
        'addis ababa': 1.0,
        'cape town': 1.3,
        'kampala': 0.9,
        'stone town': 0.8,
        'accra': 1.1,
        'remote': 1.0
    };
    
    const baseKey = jobTitle.toLowerCase();
    const baseSalary = baseSalaries[baseKey] || 25000;
    const expMultiplier = experienceMultiplier[experience] || 1.0;
    const locMultiplier = locationMultiplier[location.toLowerCase()] || 1.0;
    
    const estimatedSalary = Math.round(baseSalary * expMultiplier * locMultiplier);
    const range = Math.round(estimatedSalary * 0.15);
    
    document.getElementById('salaryResult').innerHTML = `
        <h4>💰 Estimated Salary Range</h4>
        <div class="salary-range">$${(estimatedSalary - range).toLocaleString()} - $${(estimatedSalary + range).toLocaleString()}</div>
        <div class="salary-note">Based on ${experience} level experience in ${location || 'average market'}</div>
    `;
    
    document.getElementById('salaryResult').style.display = 'block';
    showNotification('Salary calculated! 💰', 'success');
}

function exportJobData() {
    const jobs = getSampleJobs();
    const csvContent = "data:text/csv;charset=utf-8," + 
        "Title,Company,Location,Salary,Type,Posted,Rating,Applicants\n" +
        jobs.map(job => `"${job.title}","${job.company}","${job.location}","${job.salary}","${job.type}","${job.posted}","${job.rating}","${job.applicants}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "jobs_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Job data exported! 📄', 'success');
}

function viewMyApplications() {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    if (applications.length === 0) {
        showNotification('No applications yet! Start applying to jobs! 🚀', 'info');
        return;
    }
    
    const modal = document.getElementById('jobModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>My Applications (${applications.length})</h2>
        <div class="applications-list">
            ${applications.map(app => `
                <div class="application-item">
                    <div class="app-header">
                        <h3>${app.jobTitle}</h3>
                        <span class="app-status ${app.status.toLowerCase()}">${app.status}</span>
                    </div>
                    <div><strong>Company:</strong> ${app.company}</div>
                    <div><strong>Application ID:</strong> ${app.applicationId}</div>
                    <div><strong>Applied:</strong> ${new Date(app.appliedDate).toLocaleDateString()}</div>
                    <div><strong>Experience Level:</strong> ${app.experience}</div>
                    <div><strong>Available From:</strong> ${new Date(app.availability).toLocaleDateString()}</div>
                    <div class="app-actions">
                        <button onclick="withdrawApplication('${app.applicationId}')" class="btn-remove">Withdraw</button>
                        <button onclick="trackApplication('${app.applicationId}')" class="btn-apply">Track Status</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Update modal buttons
    document.getElementById('saveJobBtn').style.display = 'none';
    document.getElementById('applyJobBtn').textContent = 'Close';
    document.getElementById('applyJobBtn').onclick = closeModal;
}

function withdrawApplication(applicationId) {
    if (confirm('Are you sure you want to withdraw this application?')) {
        let applications = JSON.parse(localStorage.getItem('applications') || '[]');
        applications = applications.filter(app => app.applicationId !== applicationId);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        showNotification('Application withdrawn successfully! 🗑️', 'info');
        viewMyApplications(); // Refresh the view
    }
}

function trackApplication(applicationId) {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const app = applications.find(a => a.applicationId === applicationId);
    
    if (app) {
        // Simulate status updates
        const statuses = ['Submitted', 'Under Review', 'Interview Scheduled', 'Final Review', 'Offer Extended', 'Hired'];
        const currentIndex = statuses.indexOf(app.status);
        
        if (currentIndex < statuses.length - 1) {
            app.status = statuses[currentIndex + 1];
            app.lastUpdated = new Date().toISOString();
            
            // Update in localStorage
            const updatedApplications = applications.map(a => 
                a.applicationId === applicationId ? app : a
            );
            localStorage.setItem('applications', JSON.stringify(updatedApplications));
            
            showNotification(`Status updated to: ${app.status}! 📈`, 'success');
            viewMyApplications(); // Refresh the view
        } else {
            showNotification('Application is at final stage! ✅', 'info');
        }
    }
}



// Enhanced job display with urgent jobs and better UI
function displayJobs(jobs) {
    // Store current jobs data globally for access by other functions
    window.currentJobsData = jobs;
    
    const jobsList = document.getElementById('jobsList');
    const currentView = localStorage.getItem('preferredView') || 'list';
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '<div class="no-jobs">No jobs found. Try adjusting your search criteria.</div>';
        return;
    }
    
    // Sort jobs - urgent jobs first
    const sortedJobs = jobs.sort((a, b) => {
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        return 0;
    });
    
    jobsList.className = `jobs-list ${currentView}-view`;
    jobsList.innerHTML = sortedJobs.map(job => {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const hasApplied = applications.some(app => app.jobId === job.id);
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        const isSaved = savedJobs.includes(job.id);
        
        return `
            <div class="job-card ${job.urgent ? 'urgent-job' : ''}" onclick="showJobDetails(${job.id})">
                ${job.urgent ? '<div class="urgent-badge">🔥 URGENT</div>' : ''}
                <div class="job-header">
                    <h3 class="job-title">${job.title}</h3>
                    <div class="job-rating">⭐ ${job.rating}</div>
                </div>
                <div class="job-company">${job.company}</div>
                <div class="job-location">📍 ${job.location}</div>
                <div class="job-salary">💰 ${job.salary}</div>
                <div class="job-type">${job.type}</div>
                <div class="job-posted">🕒 ${job.posted}</div>
                <div class="job-applicants">👥 ${job.applicants} applicants</div>
                <div class="job-tags">
                    ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="job-benefits">
                    ${job.benefits.slice(0, 3).map(benefit => `<span class="benefit-tag">${benefit}</span>`).join('')}
                    ${job.benefits.length > 3 ? `<span class="benefit-more">+${job.benefits.length - 3} more</span>` : ''}
                </div>
                <div class="job-actions">
                    <button onclick="event.stopPropagation(); saveJob(${job.id})" class="btn-save ${isSaved ? 'saved' : ''}">
                        ${isSaved ? '✅ Saved' : '💾 Save'}
                    </button>
                    <button onclick="event.stopPropagation(); applyToJob(${job.id})" class="btn-apply ${hasApplied ? 'applied' : ''}">
                        ${hasApplied ? '✅ Applied' : 'Apply Now'}
                    </button>
                    <button onclick="event.stopPropagation(); shareJob(${job.id})" class="btn-share">🔗 Share</button>
                </div>
            </div>
        `;
    }).join('');
}

// Share job functionality
function shareJob(jobId) {
    const job = getSampleJobs().find(j => j.id === jobId);
    if (job) {
        const shareText = `Check out this job: ${job.title} at ${job.company} - ${job.location}`;
        
        if (navigator.share) {
            navigator.share({
                title: job.title,
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('Job details copied to clipboard! 📋', 'success');
            });
        }
    }
}

// Enhanced search with filters
async function performAdvancedSearch() {
    const keywords = document.getElementById('keywordInput').value;
    const location = document.getElementById('locationInput').value;
    const salaryFilter = document.getElementById('salaryFilter').value;
    const jobTypeFilter = document.getElementById('jobTypeFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value;
    
    document.getElementById('loading').style.display = 'block';
    
    try {
        // Use JSearch API for real job data
        const apiJobs = await searchJobs(keywords, location);
        let jobs = apiJobs.map(formatJSearchJob);
        
        // Apply additional filters
        jobs = jobs.filter(job => {
            const matchSalary = !salaryFilter || (() => {
                const salaryNum = parseInt(job.salary.replace(/[^\d]/g, ''));
                return salaryNum >= parseInt(salaryFilter);
            })();
            
            const matchType = !jobTypeFilter || job.type.toLowerCase().includes(jobTypeFilter.toLowerCase());
            
            return matchSalary && matchType;
        });
        
        document.getElementById('loading').style.display = 'none';
        displayJobs(jobs);
        document.getElementById('jobsCount').textContent = `${jobs.length} jobs found`;
        
        if (jobs.length === 0) {
            showNotification('No jobs found. Try different filters! 🤔', 'info');
        } else {
            showNotification(`Found ${jobs.length} real jobs! 🎉`, 'success');
        }
        
        saveSearchToHistory(keywords, location);
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        console.error('Search error:', error);
        showNotification('Search failed. Using sample data. 🔄', 'warning');
        
        // Fallback to sample data
        let jobs = getSampleJobs().filter(job => {
            const matchKeywords = !keywords || 
                job.title.toLowerCase().includes(keywords.toLowerCase()) || 
                job.description.toLowerCase().includes(keywords.toLowerCase()) ||
                job.tags.some(tag => tag.toLowerCase().includes(keywords.toLowerCase()));
            
            const matchLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
            
            return matchKeywords && matchLocation;
        });
        
        displayJobs(jobs);
        document.getElementById('jobsCount').textContent = `${jobs.length} jobs found`;
    }
}

// Job recommendations based on search history
function loadRecommendations() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    if (searchHistory.length === 0 && applications.length === 0) {
        return;
    }
    
    // Get keywords from search history and applications
    const keywords = new Set();
    searchHistory.forEach(search => {
        if (search.keywords) {
            search.keywords.split(' ').forEach(word => keywords.add(word.toLowerCase()));
        }
    });
    
    applications.forEach(app => {
        if (app.jobTitle) {
            app.jobTitle.split(' ').forEach(word => keywords.add(word.toLowerCase()));
        }
    });
    
    // Find matching jobs
    const allJobs = getSampleJobs();
    const recommendedJobs = allJobs.filter(job => {
        return Array.from(keywords).some(keyword => 
            job.title.toLowerCase().includes(keyword) ||
            job.tags.some(tag => tag.toLowerCase().includes(keyword))
        );
    }).slice(0, 3);
    
    if (recommendedJobs.length > 0) {
        const recommendationsSection = document.getElementById('recommendationsSection');
        const recommendationsList = document.getElementById('recommendationsList');
        
        recommendationsList.innerHTML = recommendedJobs.map(job => `
            <div class="recommendation-card" onclick="showJobDetails(${job.id})">
                <h4>${job.title}</h4>
                <div>${job.company} - ${job.location}</div>
                <div class="job-salary">${job.salary}</div>
            </div>
        `).join('');
        
        recommendationsSection.style.display = 'block';
    }
}

// Window click event to close modals
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

// Search suggestions functionality
function showSearchSuggestions() {
    const input = document.getElementById('keywordInput').value.toLowerCase();
    if (input.length < 2) return;
    
    const allJobs = getSampleJobs();
    const suggestions = new Set();
    
    allJobs.forEach(job => {
        // Add job titles that match
        if (job.title.toLowerCase().includes(input)) {
            suggestions.add(job.title);
        }
        // Add matching tags
        job.tags.forEach(tag => {
            if (tag.toLowerCase().includes(input)) {
                suggestions.add(tag);
            }
        });
    });
    
    // Show suggestions (limit to 5)
    const suggestionsList = Array.from(suggestions).slice(0, 5);
    if (suggestionsList.length > 0) {
        // You can implement a dropdown here if needed
        console.log('Suggestions:', suggestionsList);
    }
}

// Job comparison functionality
let comparisonList = [];

function setupJobComparison() {
    // Add comparison functionality to job cards
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('compare-btn')) {
            const jobId = parseInt(e.target.dataset.jobId);
            toggleJobComparison(jobId);
        }
    });
}

function toggleJobComparison(jobId) {
    const index = comparisonList.indexOf(jobId);
    if (index > -1) {
        comparisonList.splice(index, 1);
        showNotification('Job removed from comparison! 📋', 'info');
    } else {
        if (comparisonList.length >= 3) {
            showNotification('Maximum 3 jobs can be compared! ⚠️', 'warning');
            return;
        }
        comparisonList.push(jobId);
        showNotification('Job added to comparison! 📋', 'success');
    }
    
    updateComparisonUI();
}

function updateComparisonUI() {
    // Update comparison button visibility
    const compareSection = document.getElementById('compareSection');
    if (comparisonList.length > 1) {
        if (!compareSection) {
            createComparisonSection();
        }
    } else if (compareSection) {
        compareSection.remove();
    }
}

function createComparisonSection() {
    const section = document.createElement('div');
    section.id = 'compareSection';
    section.className = 'comparison-section';
    section.innerHTML = `
        <div class="comparison-header">
            <h3>Job Comparison (${comparisonList.length})</h3>
            <button onclick="showJobComparison()" class="btn-apply">Compare Jobs</button>
            <button onclick="clearComparison()" class="btn-clear">Clear All</button>
        </div>
    `;
    
    document.querySelector('.stats-bar').after(section);
}

function showJobComparison() {
    const jobs = getSampleJobs().filter(job => comparisonList.includes(job.id));
    const modal = document.getElementById('jobModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>Job Comparison</h2>
        <div class="comparison-table">
            <table>
                <thead>
                    <tr>
                        <th>Criteria</th>
                        ${jobs.map(job => `<th>${job.title}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Company</strong></td>
                        ${jobs.map(job => `<td>${job.company}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Location</strong></td>
                        ${jobs.map(job => `<td>${job.location}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Salary</strong></td>
                        ${jobs.map(job => `<td>${job.salary}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Type</strong></td>
                        ${jobs.map(job => `<td>${job.type}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Rating</strong></td>
                        ${jobs.map(job => `<td>⭐ ${job.rating}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Applicants</strong></td>
                        ${jobs.map(job => `<td>${job.applicants}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Skills</strong></td>
                        ${jobs.map(job => `<td>${job.tags.join(', ')}</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    modal.style.display = 'block';
}

function clearComparison() {
    comparisonList = [];
    updateComparisonUI();
    showNotification('Comparison cleared! 🗑️', 'info');
}

// Auto-refresh functionality
function setupAutoRefresh() {
    // Simulate new jobs being added
    setInterval(() => {
        const randomChance = Math.random();
        if (randomChance < 0.1) { // 10% chance every 30 seconds
            showNotification('🆕 New jobs available! Refresh to see them.', 'info');
        }
    }, 30000); // 30 seconds
}

// Enhanced analytics with real-time updates
function updateLiveAnalytics() {
    const updates = [
        '🆕 5 new Marketing Manager jobs posted in Kigali',
        '📈 Tourism sector salaries increased by 8% this month',
        '🔥 Agricultural specialists are in extremely high demand',
        '🌍 International NGO opportunities increased by 30%',
        '💼 12 African companies are actively hiring this week',
        '⭐ Average job rating improved to 4.7/5',
        '📍 Kigali leads in job postings across East Africa',
        '💰 Average salary range: $20k - $45k'
    ];
    
    const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
    const liveUpdates = document.getElementById('liveUpdates');
    
    if (liveUpdates) {
        const updateElement = document.createElement('div');
        updateElement.className = 'update-item';
        updateElement.innerHTML = `
            <div class="update-text">${randomUpdate}</div>
            <div class="update-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        liveUpdates.insertBefore(updateElement, liveUpdates.firstChild);
        
        // Keep only last 5 updates
        while (liveUpdates.children.length > 5) {
            liveUpdates.removeChild(liveUpdates.lastChild);
        }
    }
}

// Update analytics every 2 minutes
setInterval(updateLiveAnalytics, 120000);

// Enhanced job alerts with smart matching
function createSmartAlert() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    if (searchHistory.length === 0 && applications.length === 0) {
        showNotification('Search for jobs first to create smart alerts! 💡', 'info');
        return;
    }
    
    // Auto-populate alert form based on user behavior
    const commonKeywords = new Set();
    const commonLocations = new Set();
    
    searchHistory.forEach(search => {
        if (search.keywords) commonKeywords.add(search.keywords);
        if (search.location) commonLocations.add(search.location);
    });
    
    applications.forEach(app => {
        if (app.jobTitle) {
            app.jobTitle.split(' ').forEach(word => commonKeywords.add(word));
        }
    });
    
    const suggestedKeywords = Array.from(commonKeywords).slice(0, 3).join(', ');
    const suggestedLocation = Array.from(commonLocations)[0] || '';
    
    document.getElementById('alertKeywords').value = suggestedKeywords;
    document.getElementById('alertLocation').value = suggestedLocation;
    
    showSection('alerts');
    showNotification('Smart alert created based on your activity! 🤖', 'success');
}