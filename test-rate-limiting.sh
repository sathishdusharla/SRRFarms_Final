#!/bin/bash

# Test script to check rate limiting and retry behavior
echo "🧪 Testing Rate Limiting and Retry Logic"
echo "========================================="

API_URL="https://srrfarms-backend.onrender.com/api"

echo "1. Testing normal registration request..."
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User Rate Limit",
    "email": "test-rate-limit@example.com",
    "phone": "+91 9876543210",
    "password": "TestPassword123!",
    "confirmPassword": "TestPassword123!",
    "address": {
      "street": "123 Test Street",
      "city": "Test City",
      "state": "Test State",
      "pincode": "123456"
    },
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n\n"

echo "2. Testing with potential rate limiting (multiple rapid requests)..."
for i in {1..5}; do
  echo "Request $i:"
  curl -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
      \"fullName\": \"Test User $i\",
      \"email\": \"test-rate-$i@example.com\",
      \"phone\": \"+91 98765432$i\",
      \"password\": \"TestPassword123!\",
      \"confirmPassword\": \"TestPassword123!\",
      \"address\": {
        \"street\": \"123 Test Street\",
        \"city\": \"Test City\",
        \"state\": \"Test State\",
        \"pincode\": \"123456\"
      },
      \"dateOfBirth\": \"1990-01-01\",
      \"gender\": \"male\"
    }" \
    -w "\nStatus: %{http_code} | Time: %{time_total}s\n" \
    -s || echo "Request failed"
  
  sleep 0.5  # Small delay between requests
done

echo -e "\n3. Checking current rate limit status..."
curl -I "$API_URL/health" 2>/dev/null | grep -i "ratelimit\|rate-limit" || echo "No rate limit headers found"

echo -e "\n✅ Rate limiting test completed!"
echo "Note: HTTP 409 (user exists) or 422 (validation error) are expected for duplicate emails"
echo "HTTP 429 indicates rate limiting is working"
