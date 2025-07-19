#!/bin/bash

# Configuration
BASE_URL="http://localhost:3001/api"
ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdiODgwNmIzMjU2OTU1ZTM2NDAyMTQiLCJpYXQiOjE3NTI5Mjc5NDEsImV4cCI6MTc1MzUzMjc0MX0.dMOdYzg1t2jZHu08q8jioCVMTDqJ1uFIzX6spWyzlgg"
PRODUCT_ID="687b8a3c9d3e07d6591fa4ac"

echo "🚀 Starting Complete E-commerce Workflow Test"
echo ""

echo "1. Getting initial cart..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/cart" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "2. Adding product to cart..."
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d "{\"productId\": \"$PRODUCT_ID\", \"quantity\": 2}" \
  "$BASE_URL/cart/add" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "3. Getting updated cart..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/cart" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "4. Creating order from cart..."
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "street": "123 Test Street",
      "city": "Test City", 
      "state": "Test State",
      "zipCode": "12345",
      "country": "Test Country"
    },
    "paymentMethod": "upi"
  }' \
  "$BASE_URL/orders" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "5. Getting admin dashboard stats..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/dashboard" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "6. Getting all orders in admin..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/orders" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "✅ Complete workflow test finished!"
