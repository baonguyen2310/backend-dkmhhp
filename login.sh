#!/bin/bash

# Function to login a user
login_user() {
  local username=$1
  local password=$2

  response=$(curl -s -X POST http://localhost:5004/api/auth/login \
       -H "Content-Type: application/json" \
       -d '{
             "username": "'"$username"'",
             "password": "'"$password"'"
           }')

  # Extract token from response
  token=$(echo $response | jq -r '.token')

  if [ "$token" != "null" ]; then
    echo "Login successful for user $username. Token: $token"
  else
    echo "Login failed for user $username. Response: $response"
  fi
}

# Login users
login_user "admin" "123456789"
login_user "student" "123456789"
login_user "accounting" "123456789"
login_user "academic" "123456789"