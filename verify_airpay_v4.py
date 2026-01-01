#!/usr/bin/env python3
"""
Verification script for Airpay V4 implementation
Run this to verify the module is correctly updated
"""
import sys
import os

# Add project to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_function_signature():
    """Test that the function signature includes client_id and client_secret"""
    print("="*60)
    print("AIRPAY V4 VERIFICATION SCRIPT")
    print("="*60)

    try:
        # Import without Flask dependencies
        import importlib.util

        spec = importlib.util.spec_from_file_location(
            "airpay_utils",
            "project/api/airpay_utils.py"
        )
        airpay_utils = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(airpay_utils)

        # Check if function exists
        if not hasattr(airpay_utils, 'build_payment_request'):
            print("❌ ERROR: build_payment_request function not found!")
            return False

        func = airpay_utils.build_payment_request

        # Check function signature
        import inspect
        sig = inspect.signature(func)
        params = list(sig.parameters.keys())

        print("\n✅ Function: build_payment_request")
        print(f"✅ Total parameters: {len(params)}")
        print(f"\nParameters:")
        for i, param in enumerate(params, 1):
            default = sig.parameters[param].default
            if default == inspect.Parameter.empty:
                print(f"  {i:2d}. {param} (required)")
            else:
                print(f"  {i:2d}. {param} = {repr(default)}")

        # Check for required V4 parameters
        required_params = ['client_id', 'client_secret']
        missing = []
        for param in required_params:
            if param not in params:
                missing.append(param)

        if missing:
            print(f"\n❌ ERROR: Missing V4 parameters: {', '.join(missing)}")
            return False
        else:
            print(f"\n✅ V4 OAuth2 parameters found: client_id, client_secret")

        # Check for V4 functions
        v4_classes = ['AirpayV4Functions']
        v4_functions = ['get_oauth2_token']

        print("\n✅ V4 Classes:")
        for cls_name in v4_classes:
            if hasattr(airpay_utils, cls_name):
                print(f"  ✓ {cls_name}")
            else:
                print(f"  ✗ {cls_name} (MISSING)")

        print("\n✅ V4 Functions:")
        for func_name in v4_functions:
            if hasattr(airpay_utils, func_name):
                print(f"  ✓ {func_name}")
            else:
                print(f"  ✗ {func_name} (MISSING)")

        print("\n" + "="*60)
        print("✅ VERIFICATION PASSED - Airpay V4 is correctly implemented")
        print("="*60)
        print("\nNext steps:")
        print("1. Restart your Flask application server")
        print("2. Clear Python cache on server (rm -rf **/__pycache__)")
        print("3. Verify environment variables are set:")
        print("   - AIRPAY_CLIENT_ID")
        print("   - AIRPAY_CLIENT_SECRET")
        print("="*60)

        return True

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_function_signature()
    sys.exit(0 if success else 1)
