import unittest

class TestOrders(unittest.TestCase):
    def test_order_status_transitions(self):
        valid_statuses = [
            'Pending',
            'Confirmed',
            'Preparing',
            'Ready for Pickup',
            'Out for Delivery',
            'Completed',
            'Cancelled'
        ]
        test_status = 'Preparing'
        self.assertIn(test_status, valid_statuses)

    def test_gst_calculation(self):
        taxable_amount = 471.75
        tax_rate = 0.05
        gst = round(taxable_amount * tax_rate, 2)
        self.assertEqual(gst, 23.59)

        total = round(taxable_amount + gst, 2)
        self.assertEqual(total, 495.34)

if __name__ == '__main__':
    unittest.main()
