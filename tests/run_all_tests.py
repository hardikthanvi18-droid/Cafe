"""
Sip And Joy Automated Test Suite
Runs comprehensive test suites for authentication, catalog, shopping cart, server-side calculations, coupons, and orders.
"""
import unittest
import sys

def run_tests():
    loader = unittest.TestLoader()
    suite = loader.discover('tests', pattern='test_*.py')
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\n" + "="*50)
    print("SIP AND JOY TEST SUITE SUMMARY")
    print("="*50)
    print(f"Total Tests Run: {result.testsRun}")
    print(f"Passed: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print("Status: ALL PASS" if result.wasSuccessful() else "Status: SOME TESTS FAILED")
    print("="*50)
    
    return 0 if result.wasSuccessful() else 1

if __name__ == '__main__':
    sys.exit(run_tests())
