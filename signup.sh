#!/bin/bash

# Function to create a user
create_user() {
  local userId=$1
  local username=$2
  local password=$3
  local email=$4
  local firstName=$5
  local lastName=$6
  local role=$7

  curl -X POST http://localhost:5004/api/auth/signup \
       -H "Content-Type: application/json" \
       -d '{
             "userId": "'"$userId"'",
             "username": "'"$username"'",
             "password": "'"$password"'",
             "email": "'"$email"'",
             "firstName": "'"$firstName"'",
             "lastName": "'"$lastName"'",
             "role": "'"$role"'"
           }'
  echo -e "\nUser $username with role $role created."
}

# Create users with different roles
create_user "user-001" "admin" "123456789" "admin@example.com" "Admin" "User" "admin"
create_user "user-002" "student" "123456789" "student@example.com" "Student" "User" "student"
create_user "user-003" "accounting" "123456789" "accounting@example.com" "Accounting" "User" "accounting staff"
create_user "user-004" "academic" "123456789" "academic@example.com" "Academic" "User" "academic affairs staff"