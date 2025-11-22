Project Overview
A comprehensive Python data extraction tool that uses Regular Expressions to identify and extract six different data types from text content. This tool is designed to process large volumes of text and extract structured information efficiently.

Features
Email Address Extraction: user@example.com, firstname.lastname@company.co.uk

URL Extraction: https://www.example.com, https://subdomain.example.org/page

Phone Number Extraction: (123) 456-7890, 123-456-7890, 123.456.7890

Credit Card Number Extraction: 1234 5678 9012 3456, 1234-5678-9012-3456

Time Format Extraction: 14:30 (24-hour), 2:30 PM (12-hour)

Currency Amount Extraction: $19.99, $1,234.56, 100 USD, 50 dollars

Installation
Prerequisites
Python 3.7 or higher

No external dependencies required (uses Python's built-in re module)

Setup
Clone this repository:

bash
git clone https://github.com/yourusername/alu_regex-data-extraction-YourUsername.git
cd alu_regex-data-extraction-YourUsername
Run the main script:

bash
python Regex.py
Usage
Basic Usage
python
from Regex import DataExtractor

# Create extractor instance
extractor = DataExtractor()

# Sample text containing various data types
text = "Contact us at support@example.com or call (555) 123-4567. Visit https://example.com"

# Extract all data types at once
results = extractor.extract_all(text)
print(results)
Individual Data Extraction
python
# Extract specific data types
emails = extractor.extract_emails(text)
phone_numbers = extractor.extract_phone_numbers(text)
urls = extractor.extract_urls(text)
credit_cards = extractor.extract_credit_cards(text)
time_formats = extractor.extract_time_formats(text)
currency_amounts = extractor.extract_currency(text)
Data Validation
python
# Validate individual items
is_valid_email = extractor.validate_email("test@example.com")
is_valid_phone = extractor.validate_phone("(555) 123-4567")
is_valid_url = extractor.validate_url("https://example.com")
is_valid_credit_card = extractor.validate_credit_card("1234-5678-9012-3456")
Utility Methods
python
# Clean credit card numbers by removing separators
cleaned_card = extractor.clean_credit_card("1234-5678-9012-3456")
# Returns: "1234567890123456"

# Format phone numbers consistently
formatted_phone = extractor.format_phone_number("1234567890", "standard")
# Returns: "(123) 456-7890"
Testing
The project includes comprehensive test cases that cover:

Valid formats for each data type

Edge cases and invalid inputs

Multiple items within single text blocks

Mixed content scenarios

Run the complete test suite by executing:

bash
python Regex.py
Sample Output
text
======================================================================
DATA EXTRACTION TOOL - 6 DATA TYPES IMPLEMENTED
======================================================================
Extracting: Emails, URLs, Phone Numbers, Credit Cards, Time, Currency
======================================================================

EMAIL ADDRESSES:
  [VALID] support@example.com
  [VALID] sales@company.co.uk
  [VALID] admin@sub.domain.org

URLS:
  [VALID] https://www.example.com
  [VALID] https://subdomain.example.org/page

PHONE NUMBERS:
  [VALID] (123) 456-7890 -> (123) 456-7890
  [VALID] 123-456-7890 -> (123) 456-7890

CREDIT CARD NUMBERS:
  [VALID] 1234 5678 9012 3456 -> 1234567890123456
  [VALID] 1234-5678-9012-3456 -> 1234567890123456

EXTRACTION STATISTICS
======================================================================
Total items extracted: 23
Emails: 5
Urls: 4
Phone Numbers: 4
Credit Cards: 3
Time Formats: 4
Currency: 3
Regular Expression Patterns
Email Addresses
text
\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b
Matches standard email formats including subdomains and special characters.

URLs
text
https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)
Matches HTTP and HTTPS URLs with optional www subdomain and path components.

Phone Numbers
text
(?:\(\d{3}\)\s?|\d{3}[-.]?)?\d{3}[-.]?\d{4}
Matches various US phone number formats with optional area code.

Credit Card Numbers
text
\b(?:\d{4}[- ]?){3}\d{4}\b
Matches 16-digit credit card numbers with space or hyphen separators.

Time Formats
24-hour: \b([01]?[0-9]|2[0-3]):[0-5][0-9]\b

12-hour: \b(1[0-2]|0?[1-9]):[0-5][0-9]\s?(?:AM|PM|am|pm)\b

Currency Amounts
text
\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\b\d+\s*(?:dollars|USD)\b
Matches USD currency in both symbolic ($) and word-based formats.
Performance
Optimized regex patterns for efficient text processing

Suitable for processing large volumes of text data

Memory-efficient operations for batch processing

Single-pass extraction capabilities

Author
Bior Majok 

