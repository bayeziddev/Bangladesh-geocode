# Bangladesh-geocode
Bangladesh locations (Divisions, Districts, Upazilas, and City Thanas). It comes pre-configured with delivery zones (Dhaka vs. Outside Dhaka), making it perfect for e-commerce checkout systems and shipping calculators.
-- 0015: Expanded Bangladesh Location Directory with Divisions (Bibhag)
-- UNIQUE(district, upazila) ensures safe re-runs.

INSERT OR IGNORE INTO location_directory (division, district, upazila, zone) VALUES

-- ==========================================
-- DHAKA DIVISION (Bibhag)
-- ==========================================
-- Dhaka City (Metropolitan Thanas - Zone: 'dhaka')
('Dhaka', 'Dhaka', 'Adabor', 'dhaka'),
('Dhaka', 'Dhaka', 'Badda', 'dhaka'),
('Dhaka', 'Dhaka', 'Banani', 'dhaka'),
('Dhaka', 'Dhaka', 'Bansree', 'dhaka'),
('Dhaka', 'Dhaka', 'Bashundhara', 'dhaka'),
('Dhaka', 'Dhaka', 'Cantonment', 'dhaka'),
('Dhaka', 'Dhaka', 'Chawkbazar', 'dhaka'),
('Dhaka', 'Dhaka', 'Demra', 'dhaka'),
('Dhaka', 'Dhaka', 'Dhanmondi', 'dhaka'),
('Dhaka', 'Dhaka', 'Gulshan', 'dhaka'),
('Dhaka', 'Dhaka', 'Hazaribagh', 'dhaka'),
('Dhaka', 'Dhaka', 'Jatrabari', 'dhaka'),
('Dhaka', 'Dhaka', 'Kafrul', 'dhaka'),
('Dhaka', 'Dhaka', 'Kamrangirchar', 'dhaka'),
('Dhaka', 'Dhaka', 'Khilgaon', 'dhaka'),
('Dhaka', 'Dhaka', 'Lalbagh', 'dhaka'),
('Dhaka', 'Dhaka', 'Mirpur', 'dhaka'),
('Dhaka', 'Dhaka', 'Mohammadpur', 'dhaka'),
('Dhaka', 'Dhaka', 'Motijheel', 'dhaka'),
('Dhaka', 'Dhaka', 'New Market', 'dhaka'),
('Dhaka', 'Dhaka', 'Pallabi', 'dhaka'),
('Dhaka', 'Dhaka', 'Paltan', 'dhaka'),
('Dhaka', 'Dhaka', 'Ramna', 'dhaka'),
('Dhaka', 'Dhaka', 'Rampura', 'dhaka'),
('Dhaka', 'Dhaka', 'Sabujbagh', 'dhaka'),
('Dhaka', 'Dhaka', 'Shahbagh', 'dhaka'),
('Dhaka', 'Dhaka', 'Shyampur', 'dhaka'),
('Dhaka', 'Dhaka', 'Sutrapur', 'dhaka'),
('Dhaka', 'Dhaka', 'Tejgaon', 'dhaka'),
('Dhaka', 'Dhaka', 'Uttara', 'dhaka'),

-- Dhaka District Upazilas (Outside city center, but Zone: 'dhaka' for delivery)
('Dhaka', 'Dhaka', 'Dhamrai', 'dhaka'),
('Dhaka', 'Dhaka', 'Dohar', 'dhaka'),
('Dhaka', 'Dhaka', 'Keraniganj', 'dhaka'),
('Dhaka', 'Dhaka', 'Nawabganj', 'dhaka'),
('Dhaka', 'Dhaka', 'Savar', 'dhaka'),

-- Other Districts in Dhaka Division (Zone: 'outside-dhaka')
('Dhaka', 'Faridpur', 'Faridpur Sadar', 'outside-dhaka'),
('Dhaka', 'Faridpur', 'Bhanga', 'outside-dhaka'),
('Dhaka', 'Gazipur', 'Gazipur Sadar', 'outside-dhaka'),
('Dhaka', 'Gazipur', 'Tongi', 'outside-dhaka'),
('Dhaka', 'Gopalganj', 'Gopalganj Sadar', 'outside-dhaka'),
('Dhaka', 'Kishoreganj', 'Kishoreganj Sadar', 'outside-dhaka'),
('Dhaka', 'Kishoreganj', 'Bhairab', 'outside-dhaka'),
('Dhaka', 'Madaripur', 'Madaripur Sadar', 'outside-dhaka'),
('Dhaka', 'Manikganj', 'Manikganj Sadar', 'outside-dhaka'),
('Dhaka', 'Munshiganj', 'Munshiganj Sadar', 'outside-dhaka'),
('Dhaka', 'Narayanganj', 'Narayanganj Sadar', 'outside-dhaka'),
('Dhaka', 'Narayanganj', 'Rupganj', 'outside-dhaka'),
('Dhaka', 'Narsingdi', 'Narsingdi Sadar', 'outside-dhaka'),
('Dhaka', 'Rajbari', 'Rajbari Sadar', 'outside-dhaka'),
('Dhaka', 'Shariatpur', 'Shariatpur Sadar', 'outside-dhaka'),
('Dhaka', 'Tangail', 'Tangail Sadar', 'outside-dhaka'),
('Dhaka', 'Tangail', 'Mirzapur', 'outside-dhaka'),

-- ==========================================
-- CHATTOGRAM DIVISION (Bibhag)
-- ==========================================
('Chattogram', 'Bandarban', 'Bandarban Sadar', 'outside-dhaka'),
('Chattogram', 'Brahmanbaria', 'Brahmanbaria Sadar', 'outside-dhaka'),
('Chattogram', 'Chandpur', 'Chandpur Sadar', 'outside-dhaka'),
('Chattogram', 'Chattogram', 'Chattogram Sadar', 'outside-dhaka'),
('Chattogram', 'Chattogram', 'Hathazari', 'outside-dhaka'),
('Chattogram', 'Chattogram', 'Sitakunda', 'outside-dhaka'),
('Chattogram', 'Cumilla', 'Cumilla Sadar', 'outside-dhaka'),
('Chattogram', 'Cox''s Bazar', 'Cox''s Bazar Sadar', 'outside-dhaka'),
('Chattogram', 'Feni', 'Feni Sadar', 'outside-dhaka'),
('Chattogram', 'Khagrachhari', 'Khagrachhari Sadar', 'outside-dhaka'),
('Chattogram', 'Lakshmipur', 'Lakshmipur Sadar', 'outside-dhaka'),
('Chattogram', 'Noakhali', 'Noakhali Sadar', 'outside-dhaka'),
('Chattogram', 'Noakhali', 'Begumganj', 'outside-dhaka'),
('Chattogram', 'Rangamati', 'Rangamati Sadar', 'outside-dhaka'),

-- ==========================================
-- RAJSHAHI DIVISION (Bibhag)
-- ==========================================
('Rajshahi', 'Bogura', 'Bogura Sadar', 'outside-dhaka'),
('Rajshahi', 'Chapainawabganj', 'Chapainawabganj Sadar', 'outside-dhaka'),
('Rajshahi', 'Joypurhat', 'Joypurhat Sadar', 'outside-dhaka'),
('Rajshahi', 'Naogaon', 'Naogaon Sadar', 'outside-dhaka'),
('Rajshahi', 'Natore', 'Natore Sadar', 'outside-dhaka'),
('Rajshahi', 'Pabna', 'Pabna Sadar', 'outside-dhaka'),
('Rajshahi', 'Rajshahi', 'Rajshahi Sadar', 'outside-dhaka'),
('Rajshahi', 'Rajshahi', 'Boalia', 'outside-dhaka'),
('Rajshahi', 'Sirajganj', 'Sirajganj Sadar', 'outside-dhaka'),

-- ==========================================
-- KHULNA DIVISION (Bibhag)
-- ==========================================
('Khulna', 'Bagerhat', 'Bagerhat Sadar', 'outside-dhaka'),
('Khulna', 'Chuadanga', 'Chuadanga Sadar', 'outside-dhaka'),
('Khulna', 'Jashore', 'Jashore Sadar', 'outside-dhaka'),
('Khulna', 'Jhenaidah', 'Jhenaidah Sadar', 'outside-dhaka'),
('Khulna', 'Khulna', 'Khulna Sadar', 'outside-dhaka'),
('Khulna', 'Khulna', 'Sonadanga', 'outside-dhaka'),
('Khulna', 'Kushtia', 'Kushtia Sadar', 'outside-dhaka'),
('Khulna', 'Magura', 'Magura Sadar', 'outside-dhaka'),
('Khulna', 'Meherpur', 'Meherpur Sadar', 'outside-dhaka'),
('Khulna', 'Narail', 'Narail Sadar', 'outside-dhaka'),
('Khulna', 'Satkhira', 'Satkhira Sadar', 'outside-dhaka'),

-- ==========================================
-- BARISHAL DIVISION (Bibhag)
-- ==========================================
('Barishal', 'Barguna', 'Barguna Sadar', 'outside-dhaka'),
('Barishal', 'Barishal', 'Barishal Sadar', 'outside-dhaka'),
('Barishal', 'Bhola', 'Bhola Sadar', 'outside-dhaka'),
('Barishal', 'Jhalokathi', 'Jhalokathi Sadar', 'outside-dhaka'),
('Barishal', 'Patuakhali', 'Patuakhali Sadar', 'outside-dhaka'),
('Barishal', 'Pirojpur', 'Pirojpur Sadar', 'outside-dhaka'),

-- ==========================================
-- SYLHET DIVISION (Bibhag)
-- ==========================================
('Sylhet', 'Habiganj', 'Habiganj Sadar', 'outside-dhaka'),
('Sylhet', 'Moulvibazar', 'Moulvibazar Sadar', 'outside-dhaka'),
('Sylhet', 'Sunamganj', 'Sunamganj Sadar', 'outside-dhaka'),
('Sylhet', 'Sylhet', 'Sylhet Sadar', 'outside-dhaka'),
('Sylhet', 'Sylhet', 'Kotwali', 'outside-dhaka'),

-- ==========================================
-- RANGPUR DIVISION (Bibhag)
-- ==========================================
('Rangpur', 'Dinajpur', 'Dinajpur Sadar', 'outside-dhaka'),
('Rangpur', 'Gaibandha', 'Gaibandha Sadar', 'outside-dhaka'),
('Rangpur', 'Kurigram', 'Kurigram Sadar', 'outside-dhaka'),
('Rangpur', 'Lalmonirhat', 'Lalmonirhat Sadar', 'outside-dhaka'),
('Rangpur', 'Nilphamari', 'Nilphamari Sadar', 'outside-dhaka'),
('Rangpur', 'Panchagarh', 'Panchagarh Sadar', 'outside-dhaka'),
('Rangpur', 'Rangpur', 'Rangpur Sadar', 'outside-dhaka'),
('Rangpur', 'Thakurgaon', 'Thakurgaon Sadar', 'outside-dhaka'),

-- ==========================================
-- MYMENSINGH DIVISION (Bibhag)
-- ==========================================
('Mymensingh', 'Jamalpur', 'Jamalpur Sadar', 'outside-dhaka'),
('Mymensingh', 'Mymensingh', 'Mymensingh Sadar', 'outside-dhaka'),
('Mymensingh', 'Mymensingh', 'Bhaluka', 'outside-dhaka'),
('Mymensingh', 'Netrokona', 'Netrokona Sadar', 'outside-dhaka'),
('Mymensingh', 'Sherpur', 'Sherpur Sadar', 'outside-dhaka');
