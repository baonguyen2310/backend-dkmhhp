-- Thêm dữ liệu vào bảng Department (Khoa)
INSERT INTO Department (department_id, department_name) VALUES ('NNTH', N'Ngoại ngữ & Tin học');
INSERT INTO Department (department_id, department_name) VALUES ('BMC', N'Bộ môn chung');
INSERT INTO Department (department_id, department_name) VALUES ('GDMN', N'Giáo dục mầm non');

-- Thêm dữ liệu vào bảng Major (Ngành)
INSERT INTO Major (major_id, major_name, department_id) VALUES ('CNTT', N'Công nghệ thông tin', 'NNTH');
INSERT INTO Major (major_id, major_name, department_id) VALUES ('TA', N'Tiếng Anh', 'NNTH');
INSERT INTO Major (major_id, major_name, department_id) VALUES ('GDMN', N'Giáo dục mầm non', 'GDMN');
INSERT INTO Major (major_id, major_name, department_id) VALUES ('QTVP', N'Quản trị văn phòng', 'BMC');


-- Thêm dữ liệu vào bảng Class cho ngành Công nghệ thông tin (CNTT)
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('CNTT47', N'CNTT47', 'CNTT', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('CNTT48', N'CNTT48', 'CNTT', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('CNTT49', N'CNTT49', 'CNTT', '2023-2024');

-- Thêm dữ liệu vào bảng Class cho ngành Tiếng Anh (TA)
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('TA47', N'TA47', 'TA', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('TA48', N'TA48', 'TA', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('TA49', N'TA49', 'TA', '2023-2024');

-- Thêm dữ liệu vào bảng Class cho ngành Quản trị văn phòng (QTVP)
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('QTVP47', N'QTVP47', 'QTVP', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('QTVP48', N'QTVP48', 'QTVP', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('QTVP49', N'QTVP49', 'QTVP', '2023-2024');

-- Thêm dữ liệu vào bảng Class cho ngành Giáo dục mầm non (GDMN)
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN47A', N'GDMN47A', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN47B', N'GDMN47B', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN47C', N'GDMN47C', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN47D', N'GDMN47D', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN48A', N'GDMN48A', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN48B', N'GDMN48B', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN48C', N'GDMN48C', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN48D', N'GDMN48D', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN49A', N'GDMN49A', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN49B', N'GDMN49B', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN49C', N'GDMN49C', 'GDMN', '2023-2024');
INSERT INTO Class (class_id, class_name, major_id, academic_year) VALUES ('GDMN49D', N'GDMN49D', 'GDMN', '2023-2024');



-- Bảng Course
INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type) 
VALUES ('C101', N'Cơ Sở Dữ Liệu', 3, 30, N'Lý thuyết');
INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type) 
VALUES ('C102', N'Lập Trình Web', 3, 30, N'Thực hành');
INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type) 
VALUES ('C103', N'Khoa Học Máy Tính', 3, 30, N'Lý thuyết');
INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type) 
VALUES ('C104', N'Giáo Dục Thể Chất', 2, 20, N'Thực hành');
INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type) 
VALUES ('C105', N'Lập Trình Di Động', 3, 30, N'Lý thuyết');
INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type) 
VALUES ('C106', N'Mạng Máy Tính', 3, 30, N'Thực hành');
INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type) 
VALUES ('C107', N'Hệ Điều Hành', 3, 30, N'Lý thuyết');
INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type) 
VALUES ('C108', N'Công Nghệ Phần Mềm', 3, 30, N'Thực hành');
INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type) 
VALUES ('C109', N'Quản Trị Dự Án', 3, 30, N'Lý thuyết');
INSERT INTO Course (course_id, course_name, credits_num, lesson_num, course_type) 
VALUES ('C110', N'Lập Trình Python', 3, 30, N'Thực hành');


-- Bảng Prerequisite_Course
INSERT INTO Prerequisite_Course (course_id, prerequisite_course_id) VALUES ('C102', 'C101');
INSERT INTO Prerequisite_Course (course_id, prerequisite_course_id) VALUES ('C102', 'C106');
INSERT INTO Prerequisite_Course (course_id, prerequisite_course_id) VALUES ('C101', 'C103');



-- Thêm dữ liệu cho học kỳ 1 năm học 2023-2024
INSERT INTO Semesters (start_date, end_date, registration_deadline, payment_deadline, early_payment_deadline, semester_name)
VALUES ('2023-09-01', '2023-12-31', '2023-08-15', '2023-12-01', '2023-09-01', 'HK1-2023-2024');

-- Thêm dữ liệu cho học kỳ 2 năm học 2023-2024
INSERT INTO Semesters (start_date, end_date, registration_deadline, payment_deadline, early_payment_deadline, semester_name)
VALUES ('2024-01-15', '2024-05-31', '2024-01-01', '2024-05-01', '2024-02-01', 'HK2-2023-2024');

-- Thêm dữ liệu cho học kỳ 1 năm học 2024-2025
INSERT INTO Semesters (start_date, end_date, registration_deadline, payment_deadline, early_payment_deadline, semester_name)
VALUES ('2024-09-01', '2024-12-31', '2024-08-15', '2024-12-01', '2024-09-01', 'HK1-2024-2025');

-- Thêm dữ liệu cho học kỳ 2 năm học 2024-2025
INSERT INTO Semesters (start_date, end_date, registration_deadline, payment_deadline, early_payment_deadline, semester_name)
VALUES ('2025-01-15', '2025-05-31', '2025-01-01', '2025-05-01', '2025-02-01', 'HK2-2024-2025');



-- Thêm dữ liệu cho sinh viên, tất cả đều từ Tây Ninh và không có ưu tiên
INSERT INTO Students (student_id, first_name, last_name, date_of_birth, gender, hometown, priority, contact_address, class_id)
VALUES ('SV001', N'Nguyễn', N'Văn A', '2000-01-15', N'Nam', N'Tây Ninh', NULL, N'123 Đường ABC, Tây Ninh', 'CNTT47');

-- Cập nhật discount_id cho sinh viên Nguyễn Văn A
UPDATE Students
SET discount_id = 6
WHERE student_id = 'SV001';


INSERT INTO Students (student_id, first_name, last_name, date_of_birth, gender, hometown, priority, contact_address, class_id)
VALUES ('SV002', N'Trần', N'Thị B', '2001-02-20', N'Nữ', N'Tây Ninh', NULL, N'456 Đường DEF, Tây Ninh', 'TA48');

INSERT INTO Students (student_id, first_name, last_name, date_of_birth, gender, hometown, priority, contact_address, class_id)
VALUES ('SV003', N'Lê', N'Văn C', '2000-03-25', N'Nam', N'Tây Ninh', NULL, N'789 Đường GHI, Tây Ninh', 'QTVP49');

INSERT INTO Students (student_id, first_name, last_name, date_of_birth, gender, hometown, priority, contact_address, class_id)
VALUES ('SV004', N'Phạm', N'Thị D', '2001-04-30', N'Nữ', N'Tây Ninh', NULL, N'101 Đường JKL, Tây Ninh', 'GDMN47A');

INSERT INTO Students (student_id, first_name, last_name, date_of_birth, gender, hometown, priority, contact_address, class_id)
VALUES ('SV005', N'Hoàng', N'Văn E', '2000-05-05', N'Nam', N'Tây Ninh', NULL, N'202 Đường MNO, Tây Ninh', 'GDMN48B');

INSERT INTO Students (student_id, first_name, last_name, date_of_birth, gender, hometown, priority, contact_address, class_id)
VALUES ('SV006', N'Vũ', N'Thị F', '2000-06-10', N'Nữ', N'Tây Ninh', NULL, N'303 Đường PQR, Tây Ninh', 'CNTT47');


-- Thêm kết quả môn học cho sinh viên Nguyễn Văn A
INSERT INTO CourseResults (result_id, student_id, course_id, semester_id, grade)
VALUES ('CR001', 'SV001', 'C101', 1, '9');

INSERT INTO CourseResults (result_id, student_id, course_id, semester_id, grade)
VALUES ('CR002', 'SV001', 'C103', 1, '9');

INSERT INTO CourseResults (result_id, student_id, course_id, semester_id, grade)
VALUES ('CR003', 'SV001', 'C106', 1, '4');

-- Thêm kết quả môn học cho sinh viên Vũ Thị F
INSERT INTO CourseResults (result_id, student_id, course_id, semester_id, grade)
VALUES ('CR004', 'SV006', 'C101', 1, '4');

INSERT INTO CourseResults (result_id, student_id, course_id, semester_id, grade)
VALUES ('CR005', 'SV006', 'C103', 1, '5');


-- Thêm quy tắc tín chỉ cho lớp CNTT47, học kỳ 1
INSERT INTO Credit_Rules (rule_id, class_id, semester_id, min_credits, max_credits)
VALUES ('CRule001', 'CNTT47', 1, 1, 10);

-- Thêm quy tắc tín chỉ cho lớp CNTT47, học kỳ 2
INSERT INTO Credit_Rules (rule_id, class_id, semester_id, min_credits, max_credits)
VALUES ('CRule002', 'CNTT47', 2, 1, 10);

-- Thêm quy tắc tín chỉ cho lớp CNTT47, học kỳ 3
INSERT INTO Credit_Rules (rule_id, class_id, semester_id, min_credits, max_credits)
VALUES ('CRule003', 'CNTT47', 3, 1, 10);

-- Thêm quy tắc tín chỉ cho lớp CNTT47, học kỳ 4
INSERT INTO Credit_Rules (rule_id, class_id, semester_id, min_credits, max_credits)
VALUES ('CRule004', 'CNTT47', 4, 1, 10);


-- Bảng Fee_Rates
INSERT INTO Fee_Rates (course_type, fee_per_credit) VALUES (N'Lý thuyết', 27000);
INSERT INTO Fee_Rates (course_type, fee_per_credit) VALUES (N'Thực hành', 37000);


INSERT INTO Fee_Discounts (discount_type, discount_percent) VALUES (N'Con thương binh, liệt sĩ', 100.00);
INSERT INTO Fee_Discounts (discount_type, discount_percent) VALUES (N'Sinh viên dân tộc thiểu số', 50.00);
INSERT INTO Fee_Discounts (discount_type, discount_percent) VALUES (N'Sinh viên có hoàn cảnh khó khăn', 30.00);
INSERT INTO Fee_Discounts (discount_type, discount_percent) VALUES (N'Sinh viên đạt giải Olympic', 100.00);
INSERT INTO Fee_Discounts (discount_type, discount_percent) VALUES (N'Sinh viên đạt giải quốc gia', 50.00);
INSERT INTO Fee_Discounts (discount_type, discount_percent) VALUES (N'Sinh viên đạt giải khu vực', 25.00);



-- Insert roles into the Roles table
INSERT INTO Roles (role_name) VALUES ('admin');
INSERT INTO Roles (role_name) VALUES ('student');
INSERT INTO Roles (role_name) VALUES ('accounting staff');
INSERT INTO Roles (role_name) VALUES ('academic affairs staff');


-- Thêm nhân viên phòng tài vụ
INSERT INTO Employee (employee_id, first_name, last_name, date_of_birth, hire_date, job_title, department_id, salary, email, address, phone_number)
VALUES ('EMP001', N'Nguyễn', N'Thị Tài', '1985-05-10', '2010-06-15', N'Nhân viên tài vụ', 'BMC', 15000000, N'tai.nguyen@university.edu', N'123 Đường ABC, Hà Nội', '0123456789');

-- Thêm nhân viên phòng giáo vụ
INSERT INTO Employee (employee_id, first_name, last_name, date_of_birth, hire_date, job_title, department_id, salary, email, address, phone_number)
VALUES ('EMP002', N'Lê', N'Văn Giáo', '1990-08-20', '2015-09-01', N'Nhân viên giáo vụ', 'NNTH', 14000000, N'giao.le@university.edu', N'456 Đường DEF, Hồ Chí Minh', '0987654321');