#!/bin/bash

# Configuration
BASE_URL="http://localhost:3001/api"
ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdiODgwNmIzMjU2OTU1ZTM2NDAyMTQiLCJpYXQiOjE3NTI5Mjc5NDEsImV4cCI6MTc1MzUzMjc0MX0.dMOdYzg1t2jZHu08q8jioCVMTDqJ1uFIzX6spWyzlgg"
PRODUCT_ID="687b8a3c9d3e07d6591fa4ac"

echo "🚀 Testing UPI Payment Integration"
echo ""

echo "1. Adding product to cart for payment test..."
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d "{\"productId\": \"$PRODUCT_ID\", \"quantity\": 1}" \
  "$BASE_URL/cart/add" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "2. Testing UPI order creation..."
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "street": "123 Payment Test Street",
      "city": "Test City", 
      "state": "Test State",
      "zipCode": "12345",
      "country": "India"
    }
  }' \
  "$BASE_URL/payments/create-upi-order" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "3. Testing test payment simulation (Development mode)..."
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "orderId": "test_upi_order_123",
    "shippingAddress": {
      "street": "123 Test Street",
      "city": "Test City", 
      "state": "Test State",
      "zipCode": "12345",
      "country": "India"
    }
  }' \
  "$BASE_URL/payments/simulate-test-verification" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "4. Testing test UPI payment creation..."
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "amount": 1299,
    "orderId": "test_payment_456"
  }' \
  "$BASE_URL/payments/create-test-payment" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "5. Getting updated admin dashboard with new order..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/dashboard" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "✅ UPI Payment Integration Test Complete!"
