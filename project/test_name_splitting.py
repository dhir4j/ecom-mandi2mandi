#!/usr/bin/env python3
"""
Test name splitting logic for Airpay
Tests various edge cases
"""
import re

def split_name_for_airpay(full_name):
    """
    Split full name into first and last name for Airpay
    """
    if not full_name or not full_name.strip():
        return ("User", "User")

    # Remove special characters (Airpay requires alphanumeric + spaces only)
    sanitized = re.sub(r'[^A-Za-z0-9\s]', '', full_name.strip())

    # Remove extra spaces
    sanitized = ' '.join(sanitized.split())

    if not sanitized:
        return ("User", "User")

    # Split name
    parts = sanitized.split(' ', 1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else parts[0]

    # Ensure both are at least 1 character (Airpay requirement)
    if not first_name:
        first_name = "User"
    if not last_name:
        last_name = first_name

    return (first_name, last_name)

# Test cases
test_cases = [
    # (input, expected_first, expected_last, description)
    ("John Doe", "John", "Doe", "Normal two-word name"),
    ("John", "John", "John", "Single word name"),
    ("John Michael Doe", "John", "Michael Doe", "Three-word name"),
    ("", "User", "User", "Empty name"),
    ("   ", "User", "User", "Whitespace only"),
    ("John@Doe", "JohnDoe", "JohnDoe", "Name with special char @ (becomes single word)"),
    ("John-Michael Doe", "JohnMichael", "Doe", "Name with hyphen"),
    ("Rajesh Kumar", "Rajesh", "Kumar", "Indian name"),
    ("李明", "User", "User", "Chinese name (non-alphanumeric)"),
    ("José García", "Jos", "Garca", "Name with accents"),
    ("O'Brien", "OBrien", "OBrien", "Name with apostrophe"),
    ("Mary-Jane Watson", "MaryJane", "Watson", "Compound first name with hyphen"),
    ("Mr. John Doe", "Mr", "John Doe", "Name with title"),
    ("123", "123", "123", "Numeric name"),
    ("John   Doe", "John", "Doe", "Extra spaces between words"),
]

print("="*80)
print("NAME SPLITTING TESTS FOR AIRPAY")
print("="*80)
print()

all_passed = True
for full_name, expected_first, expected_last, description in test_cases:
    first, last = split_name_for_airpay(full_name)
    passed = (first == expected_first and last == expected_last)
    all_passed = all_passed and passed

    status = "✓ PASS" if passed else "✗ FAIL"
    print(f"{status} | {description}")
    print(f"     Input: '{full_name}'")
    print(f"     Expected: first='{expected_first}', last='{expected_last}'")
    print(f"     Got:      first='{first}', last='{last}'")
    if not passed:
        print(f"     ❌ MISMATCH!")
    print()

print("="*80)
if all_passed:
    print("✓ ALL TESTS PASSED!")
else:
    print("✗ SOME TESTS FAILED!")
print("="*80)
