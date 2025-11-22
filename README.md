<<<<<<< HEAD
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

2. Open `html/index.html` in your browser or serve via HTTP server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000/html/
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
# alu_regex-data-extraction-Bior-Majok
=======
 **Regex Data Extraction Project
**
This is a Python-based project that validates different types of data using Regular Expressions (Regex). It reads test cases from an external text file of sample test inputs, organizes them into categories with headers(like emails, phone numbers, credit cards, etc.), and evaluates whether each test case is valid or not according to the defined regex pattern.

**Project Overview**

**Setup Instructions**

Usage

Testing

Sample Output

Regex Patterns

Contributing

Project Overview

**This project extracts the following data types from text:
**
Email addresses – e.g., user@example.com

URLs – e.g., https://www.example.com

Phone numbers – e.g., (123) 456-7890, 123-456-7890

Credit card numbers – e.g., 1234 5678 9012 3456

Time formats – e.g., 14:30 (24-hour), 2:30 PM (12-hour)

Currency amounts – e.g., $19.99, $1,234.56, 100 USD, 50 dollars

The tool is built with Python 3 and uses the re module—no external dependencies required.

**Setup Instructions**
Prerequisites

Python 3.7 or higher

Installation

**Clone the repository:**

git clone https://github.com Bior-Majok alu_regex-data-extraction-Bior-Majok
.git

cd alu_regex-data-extraction-Bior-Majok


**Run the main Python script**:

python Regex.py


Ensure the main file is named Regex.py.

Usage
Extract All Data Types
from Regex import DataExtractor

extractor = DataExtractor()

text = "Contact us at support@example.com or call (555) 123-4567"
results = extractor.extract_all(text)
print(results)

Extract Specific Data Types
emails = extractor.extract_emails(text)
phones = extractor.extract_phone_numbers(text)
urls = extractor.extract_urls(text)

Validate Individual Items
is_valid_email = extractor.validate_email("test@example.com")
is_valid_phone = extractor.validate_phone("(555) 123-4567")

**Testing**

The project includes comprehensive test cases for:

Valid formats for each data type

Edge cases and invalid inputs

Multiple items in a single text

Mixed content scenarios

Run the tests with:

python Regex.py

Sample Output
======================================================================
DATA EXTRACTION TOOL - 6 DATA TYPES IMPLEMENTED
======================================================================
Extracting: Emails, URLs, Phone Numbers, Credit Cards, Time, Currency
======================================================================

EMAIL ADDRESSES:
  ✓ support@example.com
  ✓ sales@company.co.uk
  ✓ admin@sub.domain.org

URLS:
  ✓ https://www.example.com
  ✓ https://subdomain.example.org/page

PHONE NUMBERS:
  ✓ (123) 456-7890 → (123) 456-7890
  ✓ 123-456-7890 → (123) 456-7890

Regex Patterns
Data Type	Pattern	Description
Email	\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b	Standard email formats
URL	https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)	HTTP/HTTPS URLs
Phone	`(?:
\d
3
\d3\s?	\d{3}[-.]?)?\d{3}[-.]?\d{4}`
Credit Card	\b(?:\d{4}[- ]?){3}\d{4}\b	16-digit cards with separators
Time 24hr	`\b(?:[01]?[0-9]	2[0-3]):[0-5][0-9]\b`
Time 12hr	`\b(?:1[0-2]	0?[1-9]):[0-5][0-9]\s?(?:AM
Currency	`$\d{1,3}(?:,\d{3})*(?:.\d{2})?	\b\d+\s*(?:dollars

**Contributing**

This project is for educational purposes. Contributions are welcome for improvements or bug fixes.


**Author:**
Bior-Majok
>>>>>>> e87fa692ceeb7e88cfbba3f68b6b6caedb0b9792
