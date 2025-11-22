# ALU Regex Data Extraction Project

A comprehensive data extraction tool using Regular Expressions to extract 6 different data types from text.

##  Project Overview

This project implements a Python-based data extraction system that uses regex patterns to identify and extract:

1. **Email addresses** - user@example.com, firstname.lastname@company.co.uk
2. **URLs** - https://www.example.com, https://subdomain.example.org/page
3. **Phone numbers** - (123) 456-7890, 123-456-7890, 123.456.7890
4. **Credit card numbers** - 1234 5678 9012 3456, 1234-5678-9012-3456
5. **Time formats** - 14:30 (24-hour), 2:30 PM (12-hour)
6. **Currency amounts** - $19.99, $1,234.56, 100 USD, 50 dollars

##  Setup Instructions

### Prerequisites
- Python 3.7 or higher
- No external dependencies required (uses built-in `re` module)

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/alu_regex-data-extraction-{YourUsername}.git
   cd alu_regex-data-extraction-{YourUsername}
   ```

2. Run the main script:
   ```bash
   python Regex
   ```

## 💻 Usage

### Basic Usage
```python
from Regex import DataExtractor

# Create extractor instance
extractor = DataExtractor()

# Extract all data types
text = "Contact us at support@example.com or call (555) 123-4567"
results = extractor.extract_all(text)
print(results)
```

### Individual Extraction
```python
# Extract specific data types
emails = extractor.extract_emails(text)
phones = extractor.extract_phone_numbers(text)
urls = extractor.extract_urls(text)
```

### Validation
```python
# Validate individual items
is_valid_email = extractor.validate_email("test@example.com")
is_valid_phone = extractor.validate_phone("(555) 123-4567")
```

##  Testing

The project includes comprehensive test cases covering:
- Valid formats for each data type
- Edge cases and invalid inputs
- Multiple items in single text
- Mixed content scenarios

Run tests by executing the main script:
```bash
python Regex
```

## 📊Sample Output

```
======================================================================
DATA EXTRACTION TOOL - 6 DATA TYPES IMPLEMENTED
======================================================================
Extracting: Emails, URLs, Phone Numbers, Credit Cards, Time, Currency
======================================================================

 EMAIL ADDRESSES:
  ✓ support@example.com
  ✓ sales@company.co.uk
  ✓ admin@sub.domain.org

 URLs:
  ✓ https://www.example.com
  ✓ https://subdomain.example.org/page

 PHONE NUMBERS:
  ✓ (123) 456-7890 → (123) 456-7890
  ✓ 123-456-7890 → (123) 456-7890
```

## 🔍 Regex Patterns

| Data Type | Pattern | Description |
|-----------|---------|-------------|
| Email | `\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b` | Matches standard email formats |
| URL | `https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)` | HTTP/HTTPS URLs with optional www |
| Phone | `(?:\(\d{3}\)\s?\|\d{3}[-.]?)?\d{3}[-.]?\d{4}` | Various US phone number formats |
| Credit Card | `\b(?:\d{4}[- ]?){3}\d{4}\b` | 16-digit cards with separators |
| Time 24hr | `\b(?:[01]?[0-9]\|2[0-3]):[0-5][0-9]\b` | 24-hour time format |
| Time 12hr | `\b(?:1[0-2]\|0?[1-9]):[0-5][0-9]\s?(?:AM\|PM\|am\|pm)\b` | 12-hour time with AM/PM |
| Currency | `\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\|\b\d+\s*(?:dollars\|USD)\b` | USD amounts in various formats |

## ✅ Assignment Requirements Met

- [x] **Regex Accuracy**: 6/8 data types implemented (exceeds minimum of 4)
- [x] **Code Quality**: Clean, readable, well-documented code
- [x] **Edge Cases**: Handles malformed input and multiple formats
- [x] **Output Presentation**: Comprehensive demonstrations and test cases
- [x] **Repository**: Proper structure and documentation

##  Project Structure

```
alu_regex-data-extraction-{YourUsername}/
├── Regex                    # Main Python file with DataExtractor class
├── README.md               # This documentation
└── .gitignore             # Git ignore file
```

##  Contributing

This is an individual assignment project. For educational purposes only.

##  License

This project is created for ALU coursework and educational purposes.

-

**Author**: Bior Majok  
**Course**: ALU Full Stack Development  
**Assignment**: Regex Data Extraction Project