import unittest

class TestProducts(unittest.TestCase):
    def setUp(self):
        self.sample_products = [
            {"id": 1, "name": "Classic Cappuccino", "price": 195.0, "is_available": True},
            {"id": 2, "name": "Iced Caramel Latte", "price": 240.0, "is_available": True},
            {"id": 3, "name": "Strawberry Cheesecake", "price": 290.0, "is_available": False}
        ]

    def test_product_availability_filter(self):
        available = [p for p in self.sample_products if p["is_available"]]
        self.assertEqual(len(available), 2)
        self.assertNotIn("Strawberry Cheesecake", [p["name"] for p in available])

    def test_product_pricing_positive(self):
        for p in self.sample_products:
            self.assertGreater(p["price"], 0)

if __name__ == '__main__':
    unittest.main()
