"""
Test Script for Subscription Endpoint
This script tests the subscription update endpoint

Usage:
    python test_subscription_endpoint.py
"""

import requests
from datetime import datetime, timedelta
import json

# Configuration
BASE_URL = "https://www.mandi.ramhotravels.com/api/auth"
# For local testing, use:
# BASE_URL = "http://localhost:5000/api/auth"

# Test credentials (update with actual test account)
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "password123"


def test_login():
    """Test login and get session"""
    print("\n" + "="*60)
    print("Testing Login...")
    print("="*60)

    response = requests.post(
        f"{BASE_URL}/login",
        json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
    )

    if response.status_code == 200:
        print("✅ Login successful!")
        data = response.json()
        print(f"   User: {data['user']['name']}")
        print(f"   Email: {data['user']['email']}")
        print(f"   Role: {data['user']['role']}")
        print(f"   Has Subscription: {data['user'].get('hasSubscription', False)}")
        return response.cookies
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return None


def test_subscription_update(cookies):
    """Test subscription update endpoint"""
    print("\n" + "="*60)
    print("Testing Subscription Update...")
    print("="*60)

    # Prepare subscription data
    subscription_data = {
        "txnid": f"TEST_TXN_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "mihpayid": f"PAYU_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "amount": "199.00",
        "hasSubscription": True,
        "subscriptionExpiry": (datetime.now() + timedelta(days=30)).isoformat() + "Z"
    }

    print("\nRequest Data:")
    print(json.dumps(subscription_data, indent=2))

    response = requests.post(
        f"{BASE_URL}/update-subscription",
        json=subscription_data,
        cookies=cookies
    )

    print(f"\nResponse Status: {response.status_code}")

    if response.status_code == 200:
        print("✅ Subscription update successful!")
        data = response.json()
        print("\nResponse Data:")
        print(json.dumps(data, indent=2))

        # Verify subscription was updated
        user = data.get('user', {})
        print("\n✅ Verification:")
        print(f"   Has Subscription: {user.get('hasSubscription')}")
        print(f"   Expiry Date: {user.get('subscriptionExpiry')}")

    else:
        print(f"❌ Subscription update failed: {response.status_code}")
        print(f"   Response: {response.text}")


def test_status_check(cookies):
    """Check user status after subscription update"""
    print("\n" + "="*60)
    print("Testing Status Check...")
    print("="*60)

    response = requests.get(
        f"{BASE_URL}/status",
        cookies=cookies
    )

    if response.status_code == 200:
        print("✅ Status check successful!")
        data = response.json()
        if data.get('logged_in'):
            user = data['user']
            print(f"\n   User: {user['name']}")
            print(f"   Has Subscription: {user.get('hasSubscription', False)}")
            print(f"   Subscription Expiry: {user.get('subscriptionExpiry', 'N/A')}")
        else:
            print("❌ User not logged in")
    else:
        print(f"❌ Status check failed: {response.status_code}")


def test_without_auth():
    """Test endpoint without authentication (should fail)"""
    print("\n" + "="*60)
    print("Testing Without Authentication...")
    print("="*60)

    subscription_data = {
        "txnid": "TEST_TXN",
        "mihpayid": "PAYU_TEST",
        "amount": "199.00",
        "hasSubscription": True,
        "subscriptionExpiry": datetime.now().isoformat()
    }

    response = requests.post(
        f"{BASE_URL}/update-subscription",
        json=subscription_data
    )

    if response.status_code == 401:
        print("✅ Correctly rejected unauthenticated request")
    else:
        print(f"❌ Unexpected response: {response.status_code}")
        print(f"   Response: {response.text}")


def main():
    """Run all tests"""
    print("\n" + "🧪 "*20)
    print("SUBSCRIPTION ENDPOINT TEST SUITE")
    print("🧪 "*20)

    # Test 1: Login
    cookies = test_login()
    if not cookies:
        print("\n❌ Cannot proceed without valid login")
        return

    # Test 2: Update subscription
    test_subscription_update(cookies)

    # Test 3: Check status
    test_status_check(cookies)

    # Test 4: Test without authentication
    test_without_auth()

    print("\n" + "="*60)
    print("All tests completed!")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
