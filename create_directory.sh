# Tạo các thư mục cần thiết
mkdir config controllers models routes middlewares utils

# Tạo các tệp tin mẫu trong từng thư mục
touch config/dbConfig.js
touch controllers/studentController.js
touch controllers/courseController.js
touch controllers/registrationController.js
touch controllers/feeController.js
touch models/studentModel.js
touch models/courseModel.js
touch models/registrationModel.js
touch models/feeModel.js
touch routes/studentRoutes.js
touch routes/courseRoutes.js
touch routes/registrationRoutes.js
touch routes/feeRoutes.js
touch middlewares/authMiddleware.js
touch utils/helpers.js

# Tạo tệp tin chính của ứng dụng
touch index.js

# Tạo tệp tin package.json nếu chưa có
if [ ! -f package.json ]; then
  npm init -y
fi