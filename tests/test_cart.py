import unittest

class TestCartAndDiscounts(unittest.TestCase):
    def test_cart_subtotal_calculation(self):
        items = [
            {"price": 195.0, "qty": 2}, # 390
            {"price": 165.0, "qty": 1}  # 165
        ]
        subtotal = sum(i["price"] * i["qty"] for i in items)
        self.assertEqual(subtotal, 555.0)

    def test_coupon_percentage_discount(self):
        subtotal = 555.0
        discount_percentage = 15.0
        max_discount = 150.0

        discount = (subtotal * discount_percentage) / 100.0
        if discount > max_discount:
            discount = max_discount

        self.assertAlmostEqual(discount, 83.25, places=2)

    def test_delivery_fee_threshold(self):
        threshold = 500.0
        fee = 40.0

        # Subtotal above threshold gets free delivery
        calc_fee_above = 0.0 if 550.0 >= threshold else fee
        self.assertEqual(calc_fee_above, 0.0)

        # Subtotal below threshold pays fee
        calc_fee_below = 0.0 if 350.0 >= threshold else fee
        self.assertEqual(calc_fee_below, 40.0)

    def test_invalid_negative_quantity(self):
        qty = -2
        self.assertFalse(qty > 0)

if __name__ == '__main__':
    unittest.main()
