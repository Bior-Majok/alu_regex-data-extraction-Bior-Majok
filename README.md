 Regex Data Extraction Project

This is a Python-based project that validates different types of data using Regular Expressions (Regex). It reads test cases from an external text file of sample test inputs, organizes them into categories with headers(like emails, phone numbers, credit cards, etc.), and evaluates whether each test case is valid or not according to the defined regex pattern.

Project Overview

Setup Instructions

Usage

Testing

Sample Output

Regex Patterns

Contributing

Project Overview

This project extracts the following data types from text:

Email addresses – e.g., user@example.com

URLs – e.g., https://www.example.com

Phone numbers – e.g., (123) 456-7890, 123-456-7890

Credit card numbers – e.g., 1234 5678 9012 3456

Time formats – e.g., 14:30 (24-hour), 2:30 PM (12-hour)

Currency amounts – e.g., $19.99, $1,234.56, 100 USD, 50 dollars

The tool is built with Python 3 and uses the re module—no external dependencies required.

Setup Instructions
Prerequisites

Python 3.7 or higher

Installation

Clone the repository:

git clone https://github.com Bior-Majok alu_regex-data-extraction-{YourUsername}.git
cd alu_regex-data-extraction-Bior-Majok


Run the main Python script:

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

Testing

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

Contributing

This project is for educational purposes. Contributions are welcome for improvements or bug fixes.

License

Created for ALU coursework and educational purposes.

Author: Bior-Majok
