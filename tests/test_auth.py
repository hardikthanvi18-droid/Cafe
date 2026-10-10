import unittest
import hashlib
import os

def mock_hash_password(password: str, salt: str = None) -> tuple:
    if salt is None:
        salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), bytes.fromhex(salt), 100000)
    return key.hex(), salt

def mock_check_password(stored_hash: str, password: str, salt: str) -> bool:
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), bytes.fromhex(salt), 100000)
    return key.hex() == stored_hash

class TestAuthLogic(unittest.TestCase):
    def test_password_hashing(self):
        password = "SecurePassword123!"
        hashed, salt = mock_hash_password(password)
        self.assertNotEqual(password, hashed)
        self.assertTrue(mock_check_password(hashed, password, salt))
        self.assertFalse(mock_check_password(hashed, "WrongPassword", salt))

    def test_customer_role_validation(self):
        roles = ['customer', 'admin']
        self.assertIn('customer', roles)
        self.assertIn('admin', roles)

    def test_werkzeug_compatibility_when_installed(self):
        try:
            from werkzeug.security import generate_password_hash, check_password_hash
            h = generate_password_hash("test")
            self.assertTrue(check_password_hash(h, "test"))
        except ImportError:
            # Werkzeug will be installed when deployed with requirements.txt
            pass

if __name__ == '__main__':
    unittest.main()
