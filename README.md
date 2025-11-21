# Job Market Monitor

A comprehensive job search platform that aggregates job listings from multiple APIs, providing users with powerful search, filtering, and application tracking capabilities.

## Purpose

Job Market Monitor addresses the real need for centralized job searching by:
- Aggregating jobs from multiple sources (JSearch, Adzuna, GitHub Jobs)
- Providing advanced filtering and search capabilities
- Offering job application tracking and management
- Delivering market analytics and insights

## Features

- **Multi-API Integration**: Real-time job data from multiple sources
- **Advanced Search**: Filter by salary, location, job type, experience level
- **Job Management**: Save jobs, track applications, set alerts
- **Analytics Dashboard**: Market trends, salary insights, skill demand
- **Responsive Design**: Works on desktop and mobile devices

## Local Setup

### Prerequisites
- Modern web browser
- Internet connection for API access

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Bior-Majok/Bior-Majok-web_infrastructures-Summative-Assessment.git
   cd news-aggregator
   ```

2. Open `public/index.html` in your browser or serve via HTTP server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000/public/
   ```

### API Configuration
1. Click the Settings button in the application
2. Configure API keys:
   - **JSearch API**: Get from [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
   - **Adzuna API**: Get from [Adzuna Developer Portal](https://developer.adzuna.com/)
3. Click "Save All Keys" and "Test Connection"

## Deployment

### Server Requirements
- Web01 and Web02: Standard web servers
- Lb01: Load balancer server

### Deployment Steps
1. **Deploy to Web Servers**:
   ```bash
   # Copy files to both servers
   scp -r * user@web01:/var/www/html/
   scp -r * user@web02:/var/www/html/
   ```

2. **Configure Load Balancer (Lb01)**:
   ```nginx
   upstream backend {
       server web01:80;
       server web02:80;
   }
   
   server {
       listen 80;
       location / {
           proxy_pass http://backend;
       }
   }
   ```

3. **Test Load Balancing**:
   - Access via load balancer IP
   - Verify traffic distribution between servers

## API Integration

### JSearch API
- **Purpose**: Primary job search data
- **Documentation**: [JSearch API Docs](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
- **Rate Limits**: Check RapidAPI dashboard
- **Credit**: Powered by JSearch API via RapidAPI

### Adzuna API
- **Purpose**: Additional job listings
- **Documentation**: [Adzuna API Docs](https://developer.adzuna.com/)
- **Rate Limits**: 1000 calls/month (free tier)
- **Credit**: Job data provided by Adzuna

### GitHub Jobs API
- **Purpose**: Tech job fallback
- **Documentation**: [GitHub Jobs API](https://jobs.github.com/api)
- **Note**: Service deprecated, used as fallback only
- **Credit**: GitHub Jobs API

## Usage

1. **Search Jobs**: Enter keywords and location
2. **Filter Results**: Use salary, type, experience filters
3. **Save Jobs**: Click save button on interesting positions
4. **Apply**: Use built-in application form or external links
5. **Track Applications**: View status in "My Applications"
6. **Set Alerts**: Create notifications for new matching jobs
7. **View Analytics**: Check market trends and insights

## Challenges & Solutions

### Challenge 1: API Rate Limits
**Solution**: Implemented caching and multiple API fallbacks

### Challenge 2: CORS Issues
**Solution**: Used server-side proxy for API calls

### Challenge 3: Data Consistency
**Solution**: Standardized job data format across all APIs

## Security

- API keys stored in localStorage (client-side)
- No sensitive data in repository
- Input validation for all user inputs
- Error handling for API failures

## Testing

- **Local Testing**: Open application and test all features
- **API Testing**: Use "Test Connection" in settings
- **Load Balancer Testing**: Access via Lb01 IP and verify distribution

## Credits

- **JSearch API**: Job search data via RapidAPI
- **Adzuna API**: Additional job listings
- **GitHub Jobs API**: Tech job fallback data
- **Font Awesome**: Icons (if used)
- **Google Fonts**: Typography (if used)

## License

This project is for educational purposes as part of Web Infrastructure assignment.

## Author

Bior Majok - Web Infrastructure Summative Assessment
