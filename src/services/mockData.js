// Initial seed data for standalone frontend demo

export const initialSettings = {
  schoolName: 'Greenwood International School',
  tagline: 'Excellence in Education, Character & Innovation',
  affiliationNumber: 'CBSE/AFF/2026/91024',
  address: 'Plot 42, Knowledge Boulevard, Sector 18, Bangalore, KA - 560100',
  phone: '+91 80 4123 4567',
  altPhone: '+91 98765 00112',
  email: 'admin@greenwoodschool.edu',
  website: 'www.greenwoodschool.edu',
  academicYear: '2026-2027',
  currencySymbol: '₹',
  dateFormat: 'DD/MM/YYYY',
};

export const initialClasses = [
  { _id: 'cls_1', name: 'LKG', order: 1, description: 'Lower Kindergarten' },
  { _id: 'cls_2', name: 'UKG', order: 2, description: 'Upper Kindergarten' },
  { _id: 'cls_3', name: '1st', order: 3, description: 'Standard 1st' },
  { _id: 'cls_4', name: '2nd', order: 4, description: 'Standard 2nd' },
  { _id: 'cls_5', name: '3rd', order: 5, description: 'Standard 3rd' },
  { _id: 'cls_6', name: '4th', order: 6, description: 'Standard 4th' },
  { _id: 'cls_7', name: '5th', order: 7, description: 'Standard 5th' },
  { _id: 'cls_8', name: '6th', order: 8, description: 'Standard 6th' },
  { _id: 'cls_9', name: '7th', order: 9, description: 'Standard 7th' },
  { _id: 'cls_10', name: '8th', order: 10, description: 'Standard 8th' },
  { _id: 'cls_11', name: '9th', order: 11, description: 'Standard 9th' },
  { _id: 'cls_12', name: '10th', order: 12, description: 'Standard 10th' },
];

export const initialDivisions = [
  // LKG
  { _id: 'div_1_a', classId: 'cls_1', name: 'A', roomNumber: 'Room-101', capacity: 40 },
  { _id: 'div_1_b', classId: 'cls_1', name: 'B', roomNumber: 'Room-102', capacity: 40 },
  // UKG
  { _id: 'div_2_a', classId: 'cls_2', name: 'A', roomNumber: 'Room-103', capacity: 40 },
  { _id: 'div_2_b', classId: 'cls_2', name: 'B', roomNumber: 'Room-104', capacity: 40 },
  // 1st
  { _id: 'div_3_a', classId: 'cls_3', name: 'A', roomNumber: 'Room-105', capacity: 40 },
  { _id: 'div_3_b', classId: 'cls_3', name: 'B', roomNumber: 'Room-106', capacity: 40 },
  // 2nd
  { _id: 'div_4_a', classId: 'cls_4', name: 'A', roomNumber: 'Room-201', capacity: 40 },
  { _id: 'div_4_b', classId: 'cls_4', name: 'B', roomNumber: 'Room-202', capacity: 40 },
  // 3rd
  { _id: 'div_5_a', classId: 'cls_5', name: 'A', roomNumber: 'Room-203', capacity: 40 },
  { _id: 'div_5_b', classId: 'cls_5', name: 'B', roomNumber: 'Room-204', capacity: 40 },
  // 4th
  { _id: 'div_6_a', classId: 'cls_6', name: 'A', roomNumber: 'Room-205', capacity: 40 },
  { _id: 'div_6_b', classId: 'cls_6', name: 'B', roomNumber: 'Room-206', capacity: 40 },
  // 5th
  { _id: 'div_7_a', classId: 'cls_7', name: 'A', roomNumber: 'Room-301', capacity: 40 },
  { _id: 'div_7_b', classId: 'cls_7', name: 'B', roomNumber: 'Room-302', capacity: 40 },
  // 6th
  { _id: 'div_8_a', classId: 'cls_8', name: 'A', roomNumber: 'Room-303', capacity: 40 },
  { _id: 'div_8_b', classId: 'cls_8', name: 'B', roomNumber: 'Room-304', capacity: 40 },
  // 7th
  { _id: 'div_9_a', classId: 'cls_9', name: 'A', roomNumber: 'Room-305', capacity: 40 },
  { _id: 'div_9_b', classId: 'cls_9', name: 'B', roomNumber: 'Room-306', capacity: 40 },
  // 8th
  { _id: 'div_10_a', classId: 'cls_10', name: 'A', roomNumber: 'Room-401', capacity: 40 },
  { _id: 'div_10_b', classId: 'cls_10', name: 'B', roomNumber: 'Room-402', capacity: 40 },
  // 9th
  { _id: 'div_11_a', classId: 'cls_11', name: 'A', roomNumber: 'Room-403', capacity: 40 },
  { _id: 'div_11_b', classId: 'cls_11', name: 'B', roomNumber: 'Room-404', capacity: 40 },
  // 10th
  { _id: 'div_12_a', classId: 'cls_12', name: 'A', roomNumber: 'Room-405', capacity: 40 },
  { _id: 'div_12_b', classId: 'cls_12', name: 'B', roomNumber: 'Room-406', capacity: 40 },
];

export const initialStaff = [
  {
    _id: 'stf_1',
    staffId: 'STF-001',
    name: 'Mrs. Sunita Verma',
    gender: 'Female',
    dob: '1982-05-14',
    phone: '+91 98450 11223',
    email: 'sunita.verma@greenwoodschool.edu',
    address: 'Flat 302, Palm Meadows, Bangalore',
    joiningDate: '2019-06-01',
    designation: 'Principal & Senior Educator',
    department: 'Administration',
    qualification: 'M.Ed, Ph.D in Educational Leadership',
    employmentStatus: 'active',
    basicSalary: 85000,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'stf_2',
    staffId: 'STF-002',
    name: 'Mr. Anand Kulkarni',
    gender: 'Male',
    dob: '1986-09-22',
    phone: '+91 98450 22334',
    email: 'anand.k@greenwoodschool.edu',
    address: '12, Sunrise Avenue, Indiranagar, Bangalore',
    joiningDate: '2020-04-15',
    designation: 'Head of Mathematics Department',
    department: 'Teaching',
    qualification: 'M.Sc Mathematics, B.Ed',
    employmentStatus: 'active',
    basicSalary: 55000,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'stf_3',
    staffId: 'STF-003',
    name: 'Ms. Priya Nambiar',
    gender: 'Female',
    dob: '1990-11-08',
    phone: '+91 98450 33445',
    email: 'priya.nambiar@greenwoodschool.edu',
    address: 'B-404, Green Glen Layout, Bellandur, Bangalore',
    joiningDate: '2021-07-10',
    designation: 'Senior Science Teacher (Physics & Chem)',
    department: 'Teaching',
    qualification: 'M.Sc Physics, B.Ed',
    employmentStatus: 'active',
    basicSalary: 48000,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'stf_4',
    staffId: 'STF-004',
    name: 'Mr. David Fernandez',
    gender: 'Male',
    dob: '1988-03-17',
    phone: '+91 98450 44556',
    email: 'david.f@greenwoodschool.edu',
    address: '77, Richmond Town, Bangalore',
    joiningDate: '2021-02-01',
    designation: 'English Language & Literature Teacher',
    department: 'Teaching',
    qualification: 'M.A English, Cambridge CELTA',
    employmentStatus: 'active',
    basicSalary: 46000,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'stf_5',
    staffId: 'STF-005',
    name: 'Mrs. Kavita Rathi',
    gender: 'Female',
    dob: '1989-12-03',
    phone: '+91 98450 55667',
    email: 'kavita.rathi@greenwoodschool.edu',
    address: '108, Koramangala 4th Block, Bangalore',
    joiningDate: '2022-01-15',
    designation: 'Head Accountant & Finance Manager',
    department: 'Finance',
    qualification: 'M.Com, Chartered Accountant Inter',
    employmentStatus: 'active',
    basicSalary: 52000,
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'stf_6',
    staffId: 'STF-006',
    name: 'Mr. Ramesh Babu',
    gender: 'Male',
    dob: '1984-08-30',
    phone: '+91 98450 66778',
    email: 'ramesh.babu@greenwoodschool.edu',
    address: '22, HSR Layout Sector 2, Bangalore',
    joiningDate: '2020-10-01',
    designation: 'Computer Science & Robotics Instructor',
    department: 'Teaching',
    qualification: 'MCA, B.Sc Computer Science',
    employmentStatus: 'active',
    basicSalary: 45000,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'stf_7',
    staffId: 'STF-007',
    name: 'Mrs. Deepa Hegde',
    gender: 'Female',
    dob: '1992-04-18',
    phone: '+91 98450 77889',
    email: 'deepa.hegde@greenwoodschool.edu',
    address: '45, Malleshwaram 15th Cross, Bangalore',
    joiningDate: '2023-06-01',
    designation: 'Primary Section Coordinator',
    department: 'Teaching',
    qualification: 'B.A, Montessori Certified Diploma',
    employmentStatus: 'active',
    basicSalary: 40000,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'stf_8',
    staffId: 'STF-008',
    name: 'Mr. Suresh Kumar',
    gender: 'Male',
    dob: '1980-02-14',
    phone: '+91 98450 88990',
    email: 'suresh.admin@greenwoodschool.edu',
    address: '14, Jayanagar 7th Block, Bangalore',
    joiningDate: '2019-03-01',
    designation: 'Office Admin & Transport In-Charge',
    department: 'Administration',
    qualification: 'B.Com, Logistics Diploma',
    employmentStatus: 'active',
    basicSalary: 35000,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
];

export const initialStudents = [
  // 10th - Div A
  { _id: 'std_1', admissionNo: 'ADM-2026-1001', name: 'Aarav Sharma', gender: 'Male', rollNo: '01', classId: 'cls_12', divisionId: 'div_12_a', fatherName: 'Vikram Sharma', motherName: 'Meera Sharma', parentPhone: '+91 98801 10001', dob: '2011-04-12', bloodGroup: 'O+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '45, Palm Enclave, Bangalore', previousSchool: 'National Public Primary School', course: 'General' },
  { _id: 'std_2', admissionNo: 'ADM-2026-1002', name: 'Ananya Iyer', gender: 'Female', rollNo: '02', classId: 'cls_12', divisionId: 'div_12_a', fatherName: 'Srinivasan Iyer', motherName: 'Lakshmi Iyer', parentPhone: '+91 98801 10002', dob: '2011-06-25', bloodGroup: 'A+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '12, Sunrise View, Bangalore', previousSchool: 'National Public Primary School', course: 'General' },
  { _id: 'std_3', admissionNo: 'ADM-2026-1003', name: 'Rohan Gupta', gender: 'Male', rollNo: '03', classId: 'cls_12', divisionId: 'div_12_a', fatherName: 'Rajeev Gupta', motherName: 'Anita Gupta', parentPhone: '+91 98801 10003', dob: '2011-02-18', bloodGroup: 'B+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '77, Richmond Town, Bangalore', previousSchool: 'National Public Primary School', course: 'General' },
  { _id: 'std_4', admissionNo: 'ADM-2026-1004', name: 'Diya Patel', gender: 'Female', rollNo: '04', classId: 'cls_12', divisionId: 'div_12_a', fatherName: 'Bhavesh Patel', motherName: 'Nisha Patel', parentPhone: '+91 98801 10004', dob: '2011-08-30', bloodGroup: 'AB+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '108, Koramangala, Bangalore', previousSchool: 'National Public Primary School', course: 'General' },
  { _id: 'std_5', admissionNo: 'ADM-2026-1005', name: 'Aditya Reddy', gender: 'Male', rollNo: '05', classId: 'cls_12', divisionId: 'div_12_a', fatherName: 'Chandra Reddy', motherName: 'Radha Reddy', parentPhone: '+91 98801 10005', dob: '2011-01-09', bloodGroup: 'O-', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '22, HSR Layout, Bangalore', previousSchool: 'National Public Primary School', course: 'General' },

  // 10th - Div B
  { _id: 'std_6', admissionNo: 'ADM-2026-1006', name: 'Kavya Nair', gender: 'Female', rollNo: '01', classId: 'cls_12', divisionId: 'div_12_b', fatherName: 'Manoj Nair', motherName: 'Shalini Nair', parentPhone: '+91 98801 10006', dob: '2011-05-15', bloodGroup: 'B+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '45, Malleshwaram, Bangalore', previousSchool: 'St. Xavier School', course: 'General' },
  { _id: 'std_7', admissionNo: 'ADM-2026-1007', name: 'Kabir Mehta', gender: 'Male', rollNo: '02', classId: 'cls_12', divisionId: 'div_12_b', fatherName: 'Gautam Mehta', motherName: 'Pooja Mehta', parentPhone: '+91 98801 10007', dob: '2011-07-21', bloodGroup: 'A+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '14, Jayanagar, Bangalore', previousSchool: 'St. Xavier School', course: 'General' },
  { _id: 'std_8', admissionNo: 'ADM-2026-1008', name: 'Tanvi Deshmukh', gender: 'Female', rollNo: '03', classId: 'cls_12', divisionId: 'div_12_b', fatherName: 'Prashant Deshmukh', motherName: 'Swati Deshmukh', parentPhone: '+91 98801 10008', dob: '2011-09-11', bloodGroup: 'O+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '33, Indiranagar, Bangalore', previousSchool: 'St. Xavier School', course: 'General' },

  // 9th - Div A
  { _id: 'std_9', admissionNo: 'ADM-2026-1009', name: 'Arjun Das', gender: 'Male', rollNo: '01', classId: 'cls_11', divisionId: 'div_11_a', fatherName: 'Subhash Das', motherName: 'Debolina Das', parentPhone: '+91 98801 20001', dob: '2012-03-14', bloodGroup: 'A+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '50, Whitefield, Bangalore', previousSchool: 'Delhi Public School', course: 'General' },
  { _id: 'std_10', admissionNo: 'ADM-2026-1010', name: 'Sanya Malhotra', gender: 'Female', rollNo: '02', classId: 'cls_11', divisionId: 'div_11_a', fatherName: 'Rakesh Malhotra', motherName: 'Kiran Malhotra', parentPhone: '+91 98801 20002', dob: '2012-10-05', bloodGroup: 'B+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '62, Marathahalli, Bangalore', previousSchool: 'Delhi Public School', course: 'General' },

  // 8th - Div A
  { _id: 'std_11', admissionNo: 'ADM-2026-1011', name: 'Ishaan Joshi', gender: 'Male', rollNo: '01', classId: 'cls_10', divisionId: 'div_10_a', fatherName: 'Hemant Joshi', motherName: 'Vidya Joshi', parentPhone: '+91 98801 30001', dob: '2013-02-28', bloodGroup: 'AB+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '18, Bellandur, Bangalore', previousSchool: 'National Public Primary School', course: 'General' },
  { _id: 'std_12', admissionNo: 'ADM-2026-1012', name: 'Meera Menon', gender: 'Female', rollNo: '02', classId: 'cls_10', divisionId: 'div_10_a', fatherName: 'Venugopal Menon', motherName: 'Girija Menon', parentPhone: '+91 98801 30002', dob: '2013-06-16', bloodGroup: 'A+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '88, Sarjapur Road, Bangalore', previousSchool: 'National Public Primary School', course: 'General' },

  // 5th - Div A
  { _id: 'std_13', admissionNo: 'ADM-2026-1013', name: 'Reyansh Singhal', gender: 'Male', rollNo: '01', classId: 'cls_7', divisionId: 'div_7_a', fatherName: 'Amit Singhal', motherName: 'Neha Singhal', parentPhone: '+91 98801 40001', dob: '2016-01-14', bloodGroup: 'O+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '44, Bannerghatta Road, Bangalore', previousSchool: 'National Public Primary School', course: 'General' },
  { _id: 'std_14', admissionNo: 'ADM-2026-1014', name: 'Avni Agarwal', gender: 'Female', rollNo: '02', classId: 'cls_7', divisionId: 'div_7_a', fatherName: 'Sanjay Agarwal', motherName: 'Preeti Agarwal', parentPhone: '+91 98801 40002', dob: '2016-04-20', bloodGroup: 'B+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '99, Electronic City, Bangalore', previousSchool: 'National Public Primary School', course: 'General' },

  // 1st - Div A
  { _id: 'std_15', admissionNo: 'ADM-2026-1015', name: 'Dhruv Kapoor', gender: 'Male', rollNo: '01', classId: 'cls_3', divisionId: 'div_3_a', fatherName: 'Varun Kapoor', motherName: 'Natasha Kapoor', parentPhone: '+91 98801 50001', dob: '2020-07-08', bloodGroup: 'O+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '23, Kanakapura Road, Bangalore', previousSchool: 'Greenwood Kindergarten', course: 'General' },
  { _id: 'std_16', admissionNo: 'ADM-2026-1016', name: 'Myra Bhatia', gender: 'Female', rollNo: '02', classId: 'cls_3', divisionId: 'div_3_a', fatherName: 'Tarun Bhatia', motherName: 'Ritu Bhatia', parentPhone: '+91 98801 50002', dob: '2020-09-12', bloodGroup: 'A+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '55, Hebbal, Bangalore', previousSchool: 'Greenwood Kindergarten', course: 'General' },

  // UKG - Div A
  { _id: 'std_17', admissionNo: 'ADM-2026-1017', name: 'Advik Pillai', gender: 'Male', rollNo: '01', classId: 'cls_2', divisionId: 'div_2_a', fatherName: 'Mahesh Pillai', motherName: 'Deepika Pillai', parentPhone: '+91 98801 60001', dob: '2021-03-10', bloodGroup: 'B+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '71, Yelahanka, Bangalore', previousSchool: 'Little Angels Playhome', course: 'General' },
  { _id: 'std_18', admissionNo: 'ADM-2026-1018', name: 'Sara Khan', gender: 'Female', rollNo: '02', classId: 'cls_2', divisionId: 'div_2_a', fatherName: 'Imran Khan', motherName: 'Zoya Khan', parentPhone: '+91 98801 60002', dob: '2021-08-04', bloodGroup: 'AB+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '19, Frazer Town, Bangalore', previousSchool: 'Little Angels Playhome', course: 'General' },

  // LKG - Div A & B
  { _id: 'std_19', admissionNo: 'ADM-2026-1019', name: 'Ayaan Siddiqui', gender: 'Male', rollNo: '01', classId: 'cls_1', divisionId: 'div_1_a', fatherName: 'Farhan Siddiqui', motherName: 'Alia Siddiqui', parentPhone: '+91 98801 70001', dob: '2022-02-14', bloodGroup: 'A+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '30, Benson Town, Bangalore', previousSchool: 'Direct Entry', course: 'General' },
  { _id: 'std_20', admissionNo: 'ADM-2026-1020', name: 'Tara Sen', gender: 'Female', rollNo: '02', classId: 'cls_1', divisionId: 'div_1_a', fatherName: 'Abhishek Sen', motherName: 'Payal Sen', parentPhone: '+91 98801 70002', dob: '2022-05-22', bloodGroup: 'O+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '84, Ulsoor, Bangalore', previousSchool: 'Direct Entry', course: 'General' },
  { _id: 'std_21', admissionNo: 'ADM-2026-1021', name: 'Yuvan Roy', gender: 'Male', rollNo: '01', classId: 'cls_1', divisionId: 'div_1_b', fatherName: 'Debanjan Roy', motherName: 'Shreya Roy', parentPhone: '+91 98801 70003', dob: '2022-01-30', bloodGroup: 'B+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '10, Domlur, Bangalore', previousSchool: 'Direct Entry', course: 'General' },
  { _id: 'std_22', admissionNo: 'ADM-2026-1022', name: 'Zara Fernandes', gender: 'Female', rollNo: '02', classId: 'cls_1', divisionId: 'div_1_b', fatherName: 'Anthony Fernandes', motherName: 'Maria Fernandes', parentPhone: '+91 98801 70004', dob: '2022-04-18', bloodGroup: 'O+', academicYear: '2026-2027', admissionDate: '2026-04-01', status: 'active', address: '9, Cox Town, Bangalore', previousSchool: 'Direct Entry', course: 'General' },
];

export const initialSalaries = [
  { _id: 'sal_1', staffId: 'stf_1', salaryMonth: '2026-10', basicSalary: 85000, bonus: 2000, deduction: 0, otherAmount: 0, netSalary: 87000, paymentDate: '2026-10-01', paymentMethod: 'Bank', paymentStatus: 'Paid', transactionRef: 'TXN-NEFT-918231', notes: 'Monthly salary disbursed' },
  { _id: 'sal_2', staffId: 'stf_2', salaryMonth: '2026-10', basicSalary: 55000, bonus: 1500, deduction: 500, otherAmount: 0, netSalary: 56000, paymentDate: '2026-10-01', paymentMethod: 'Bank', paymentStatus: 'Paid', transactionRef: 'TXN-NEFT-918232', notes: 'Monthly salary disbursed' },
  { _id: 'sal_3', staffId: 'stf_3', salaryMonth: '2026-10', basicSalary: 48000, bonus: 1000, deduction: 0, otherAmount: 500, netSalary: 49500, paymentDate: '2026-10-01', paymentMethod: 'Bank', paymentStatus: 'Paid', transactionRef: 'TXN-NEFT-918233', notes: 'Monthly salary disbursed' },
  { _id: 'sal_4', staffId: 'stf_4', salaryMonth: '2026-10', basicSalary: 46000, bonus: 1000, deduction: 0, otherAmount: 0, netSalary: 47000, paymentDate: '2026-10-01', paymentMethod: 'Bank', paymentStatus: 'Paid', transactionRef: 'TXN-NEFT-918234', notes: 'Monthly salary disbursed' },
  { _id: 'sal_5', staffId: 'stf_5', salaryMonth: '2026-10', basicSalary: 52000, bonus: 1500, deduction: 0, otherAmount: 0, netSalary: 53500, paymentDate: '2026-10-01', paymentMethod: 'Bank', paymentStatus: 'Paid', transactionRef: 'TXN-NEFT-918235', notes: 'Monthly salary disbursed' },
];

export const initialIncomes = [
  { _id: 'inc_1', title: 'Term 1 Tuition Fee - Grade 10 Batch', category: 'Tuition Fee', amount: 350000, date: '2026-09-28', paymentMethod: 'Online / UPI', receivedFrom: 'Class 10 Parents Batch', receiptNo: 'REC-2026-001', description: 'Quarterly academic fee' },
  { _id: 'inc_2', title: 'New Admission Fee & Registration', category: 'Admission Fee', amount: 180000, date: '2026-09-25', paymentMethod: 'Bank', receivedFrom: 'Grade 1 & LKG Admissions', receiptNo: 'REC-2026-002', description: 'Registration & prospectus fee' },
  { _id: 'inc_3', title: 'Term 1 Transport & Bus Fleet Fee', category: 'Transport Fee', amount: 95000, date: '2026-09-20', paymentMethod: 'Online / UPI', receivedFrom: 'Bus Route 1-6 Parents', receiptNo: 'REC-2026-003', description: 'Transportation fee' },
  { _id: 'inc_4', title: 'Annual Book Set & Uniform Sales', category: 'Books', amount: 120000, date: '2026-09-18', paymentMethod: 'Cash', receivedFrom: 'School Bookstore Counters', receiptNo: 'REC-2026-004', description: 'Study material and uniform kits' },
  { _id: 'inc_5', title: 'Mid-Term Examination & Lab Assessment Fee', category: 'Exam Fee', amount: 45000, date: '2026-09-15', paymentMethod: 'Online / UPI', receivedFrom: 'Senior Students (8th-10th)', receiptNo: 'REC-2026-005', description: 'Assessment overheads' },
  { _id: 'inc_6', title: 'Education Trust Contribution', category: 'Donation', amount: 75000, date: '2026-09-10', paymentMethod: 'Bank', receivedFrom: 'Greenwood Trust Fund', receiptNo: 'REC-2026-006', description: 'Scholarship endowment' },
];

export const initialExpenses = [
  { _id: 'exp_1', title: 'Campus Electricity & Power Grid Bill', category: 'Electricity', amount: 38000, date: '2026-09-26', paymentMethod: 'Bank', paidTo: 'State Electricity Board', voucherNo: 'VOU-2026-01', description: 'Monthly electricity bill' },
  { _id: 'exp_2', title: 'High Speed Optical Fiber & Campus Wi-Fi', category: 'Internet', amount: 8500, date: '2026-09-24', paymentMethod: 'Online / UPI', paidTo: 'Airtel Broadband Ltd', voucherNo: 'VOU-2026-02', description: 'Campus broadband' },
  { _id: 'exp_3', title: 'Classroom Smart Board & Laboratory Maintenance', category: 'Maintenance', amount: 24000, date: '2026-09-21', paymentMethod: 'Bank', paidTo: 'TechEdu Solutions', voucherNo: 'VOU-2026-03', description: 'Smartboard repairs' },
  { _id: 'exp_4', title: 'Quarterly Office Printing & Stationery Supply', category: 'Stationery', amount: 16500, date: '2026-09-19', paymentMethod: 'Cash', paidTo: 'Navneet Stationers', voucherNo: 'VOU-2026-04', description: 'Registers, papers and supplies' },
  { _id: 'exp_5', title: 'School Campus Sanitization & Daily Cleaning', category: 'Cleaning', amount: 14000, date: '2026-09-16', paymentMethod: 'Cash', paidTo: 'CleanCare Services', voucherNo: 'VOU-2026-05', description: 'Sanitation contractor' },
  { _id: 'exp_6', title: 'Annual Sports & Cultural Meet Logistics', category: 'Events', amount: 42000, date: '2026-09-12', paymentMethod: 'Bank', paidTo: 'Olympus Event Organizers', voucherNo: 'VOU-2026-06', description: 'Sports day grounds' },
  { _id: 'exp_7', title: 'School Bus Fleet Fuel & Servicing', category: 'Transport', amount: 31000, date: '2026-09-08', paymentMethod: 'Bank', paidTo: 'Indian Oil & Service Hub', voucherNo: 'VOU-2026-07', description: 'Bus diesel and lubrication' },
];

export const initialAttendances = [
  {
    _id: 'att_1',
    date: new Date().toISOString().split('T')[0],
    academicYear: '2026-2027',
    classId: 'cls_12',
    divisionId: 'div_12_a',
    records: [
      { studentId: 'std_1', status: 'Present', reason: '' },
      { studentId: 'std_2', status: 'Absent', reason: 'Viral Fever' },
      { studentId: 'std_3', status: 'Present', reason: '' },
      { studentId: 'std_4', status: 'Late', reason: 'Bus delay' },
      { studentId: 'std_5', status: 'Present', reason: '' },
    ],
  },
];
