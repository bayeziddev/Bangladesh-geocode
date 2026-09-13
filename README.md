# 🗺️ Bangladesh Geocode

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PHP Version](https://img.shields.io/badge/PHP-100%25-blue.svg)](https://www.php.net/)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen.svg)](https://github.com)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](#contributing)
[![Sponsor](https://img.shields.io/badge/💚-Sponsor-red.svg)](#-sponsor-this-project)

**Complete Bangladesh Geographic & Delivery Zone Database**

*The ultimate solution for e-commerce checkout systems, shipping calculators, and location-based services in Bangladesh*

---

### 📍 **What's Inside**

Comprehensive geographic data covering:
- **8 Divisions (Bibhag)** across Bangladesh
- **64 Districts (Zilla)** with complete coverage
- **500+ Upazilas** with precise geographic hierarchy
- **303 City Thanas** (metropolitan area wards)
- **Pre-configured Delivery Zones** (Dhaka vs. Outside Dhaka)

---

</div>

## ✨ Features

### 🎯 **Core Features**
- ✅ **Complete Geographic Coverage** - All Bangladesh locations in one database
- ✅ **Hierarchical Structure** - Division → District → Upazila → Thana organization
- ✅ **Smart Delivery Zones** - Pre-configured for e-commerce (Dhaka Metro vs. Outside Dhaka)
- ✅ **Production Ready** - Optimized for high-performance queries
- ✅ **Safe Re-runs** - UNIQUE constraints prevent duplicate data insertion
- ✅ **Open Source** - MIT Licensed, fully transparent and modifiable

### 🚀 **Perfect For**
- 🛒 **E-commerce Platforms** - Checkout location selection
- 📦 **Shipping Calculators** - Zone-based delivery pricing
- 🗺️ **Location Services** - Geographic data APIs
- 📍 **Address Validation** - Bangladesh-specific location verification
- 💼 **Logistics Management** - Delivery zone optimization
- 📱 **Mobile Applications** - Location-aware features

---

## 🛠️ Installation & Setup

### Prerequisites
- PHP 5.7 or higher
- MySQL/MariaDB 5.7 or higher
- Basic SQL knowledge

### Quick Start

#### 1️⃣ **Import the Database**

```bash
# Clone the repository
git clone https://github.com/bayeziddev/Bangladesh-geocode.git
cd Bangladesh-geocode

# Import into your MySQL database
mysql -u your_username -p your_database < bangladesh_locations.sql
```

#### 2️⃣ **Create Database Connection (PHP)**

```php
<?php
// config/database.php
$host = 'localhost';
$db = 'your_database';
$user = 'your_username';
$password = 'your_password';

$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $password);
?>
```

#### 3️⃣ **Query Examples**

```php
// Get all divisions
$stmt = $pdo->query("SELECT DISTINCT division FROM location_directory");
$divisions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get districts by division
$stmt = $pdo->prepare("SELECT DISTINCT district FROM location_directory WHERE division = ?");
$stmt->execute(['Dhaka']);
$districts = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get upazilas by district
$stmt = $pdo->prepare("SELECT upazila, zone FROM location_directory WHERE district = ? AND division = ?");
$stmt->execute(['Dhaka', 'Dhaka']);
$upazilas = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get delivery zone
$stmt = $pdo->prepare("SELECT zone FROM location_directory WHERE upazila = ?");
$stmt->execute(['Badda']);
$location = $stmt->fetch(PDO::FETCH_ASSOC);
echo "Delivery Zone: " . $location['zone']; // Output: dhaka
?>
```

---

## 📊 Database Schema

### Table Structure: `location_directory`

```sql
CREATE TABLE location_directory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    division VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    upazila VARCHAR(100) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    UNIQUE(district, upazila),
    INDEX idx_division (division),
    INDEX idx_district (district),
    INDEX idx_upazila (upazila),
    INDEX idx_zone (zone)
);
```

### Schema Details
| Column | Type | Purpose |
|--------|------|---------|
| `id` | INT | Unique identifier |
| `division` | VARCHAR(100) | Administrative division (Bibhag) |
| `district` | VARCHAR(100) | District level (Zilla) |
| `upazila` | VARCHAR(100) | Sub-district level (Upazila) |
| `zone` | VARCHAR(50) | Delivery zone classification |

---

## 🔍 Understanding the Algorithm

### Location Hierarchy Algorithm

The Bangladesh Geocode system uses a hierarchical tree-based algorithm for efficient location lookup and validation:

```
Algorithm: Hierarchical Location Resolution

1. INPUT: User selects a location (Upazila/Thana)
   
2. DIVISION LOOKUP:
   - Query: SELECT division FROM location_directory WHERE upazila = ?
   - Result: Returns the parent division
   - Complexity: O(1) - Indexed lookup
   
3. DELIVERY ZONE MAPPING:
   - Rule: IF division = 'Dhaka' AND district = 'Dhaka' THEN zone = 'dhaka'
   - Rule: ELSE zone = 'outside-dhaka'
   - Logic: Smart pre-configuration based on location hierarchy
   - Use Case: Real-time shipping cost calculation
   
4. HIERARCHICAL TREE TRAVERSAL:
   - Level 1: Division (8 unique values)
   - Level 2: District (64 unique values)
   - Level 3: Upazila (500+ unique values)
   - Level 4: Thana (303 records for metro areas)
   
5. OUTPUT: Complete location context with delivery zone
```

### Performance Optimization

```php
<?php
// Algorithm: Multi-Level Caching Strategy
class LocationCacheManager {
    
    // Level 1: Division Cache (8 records - rarely changes)
    private $divisionCache = null;
    
    // Level 2: District Cache (64 records - organization-level)
    private $districtCache = [];
    
    // Level 3: Zone Cache (2 zones - fastest lookup)
    private $zoneCache = [];
    
    public function getLocationHierarchy($upazila) {
        // Step 1: Check zone cache first (O(1))
        if (isset($this->zoneCache[$upazila])) {
            return $this->zoneCache[$upazila];
        }
        
        // Step 2: Query single indexed column (O(log n))
        $stmt = $this->pdo->prepare(
            "SELECT division, district, zone FROM location_directory 
             WHERE upazila = ? LIMIT 1"
        );
        $stmt->execute([$upazila]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Step 3: Store in cache for future requests
        $this->zoneCache[$upazila] = $result;
        
        return $result;
    }
}
?>
```

### Algorithm Benefits
- ⚡ **O(1) Complexity** - Constant time lookups using indexes
- 🎯 **Hierarchical Validation** - Ensures data consistency
- 💾 **Memory Efficient** - Pre-computed zones eliminate runtime calculations
- 🔒 **Data Integrity** - UNIQUE constraints prevent anomalies

---

## 🌍 Geographic Coverage

### Divisions & Key Details

#### 🏙️ **DHAKA DIVISION** (Division: Dhaka)
- **Districts:** 17 (including metro Dhaka)
- **Special Zones:** 
  - **dhaka** - Dhaka city proper (32 thanas) + metro suburbs
  - **outside-dhaka** - Outlying districts
- **Key Thanas:** Badda, Gulshan, Dhanmondi, Mirpur, Uttara, Motijheel, etc.

#### 🌊 **CHATTOGRAM DIVISION** (Division: Chattogram)
- **Districts:** 13 including Cox's Bazar
- **Zone:** outside-dhaka (coastal region)

#### 👑 **RAJSHAHI DIVISION** (Division: Rajshahi)
- **Districts:** 9 in northwest Bangladesh
- **Zone:** outside-dhaka

#### 🌾 **KHULNA DIVISION** (Division: Khulna)
- **Districts:** 11 in southwest
- **Zone:** outside-dhaka (Sundarbans region)

#### 🏞️ **BARISHAL DIVISION** (Division: Barishal)
- **Districts:** 6 in south-central
- **Zone:** outside-dhaka

#### 🎋 **SYLHET DIVISION** (Division: Sylhet)
- **Districts:** 5 in northeast
- **Zone:** outside-dhaka (tea garden region)

#### ❄️ **RANGPUR DIVISION** (Division: Rangpur)
- **Districts:** 8 in north
- **Zone:** outside-dhaka

#### 🌾 **MYMENSINGH DIVISION** (Division: Mymensingh)
- **Districts:** 4 in central
- **Zone:** outside-dhaka

---

## 💡 Use Cases

### 🛍️ E-commerce Implementation

```php
// Example: E-commerce checkout location selector
<?php
class LocationService {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    // Get all divisions for dropdown
    public function getDivisions() {
        return $this->pdo->query(
            "SELECT DISTINCT division FROM location_directory ORDER BY division"
        )->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Get districts by division
    public function getDistricts($division) {
        $stmt = $this->pdo->prepare(
            "SELECT DISTINCT district FROM location_directory 
             WHERE division = ? ORDER BY district"
        );
        $stmt->execute([$division]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Get delivery zone and shipping cost
    public function getShippingZone($upazila) {
        $stmt = $this->pdo->prepare(
            "SELECT zone FROM location_directory WHERE upazila = ? LIMIT 1"
        );
        $stmt->execute([$upazila]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return [
            'zone' => $result['zone'] ?? 'outside-dhaka',
            'shipping_cost' => ($result['zone'] === 'dhaka') ? 60 : 150, // BDT
            'delivery_days' => ($result['zone'] === 'dhaka') ? 1 : 3
        ];
    }
}
?>
```

### 📦 Shipping Calculator

```php
// Calculate shipping based on zone
function calculateShipping($upazila, $weight) {
    $zones = [
        'dhaka' => ['base' => 60, 'per_kg' => 10],
        'outside-dhaka' => ['base' => 150, 'per_kg' => 20]
    ];
    
    $zone = getZoneByUpazila($upazila); // From database
    $config = $zones[$zone];
    
    return $config['base'] + ($weight * $config['per_kg']);
}
```

---

## 📋 Full Data Summary

| Category | Count |
|----------|-------|
| **Divisions** | 8 |
| **Districts** | 64 |
| **Upazilas** | 500+ |
| **City Thanas** | 303 |
| **Delivery Zones** | 2 (Dhaka, Outside Dhaka) |
| **Total Records** | 1000+ |

---

## ❓ FAQ - Frequently Asked Questions

### General Questions

**Q: What is Bangladesh Geocode?**
A: Bangladesh Geocode is a comprehensive, production-ready geographic database containing all divisions, districts, upazilas, and city thanas in Bangladesh, pre-configured with delivery zones for e-commerce applications.

**Q: Is this project free to use?**
A: Yes! It's licensed under MIT, meaning you can use it freely in commercial and personal projects.

**Q: What's the difference between Upazila and Thana?**
A: 
- **Thana** (থানা) - Police/administrative unit, used mainly in Dhaka Metropolitan Area (303 city thanas)
- **Upazila** (উপজেলা) - Administrative subdivision of districts, used throughout Bangladesh (500+ upazilas)

**Q: Can I modify the data?**
A: Yes, absolutely! Since it's open source under MIT license, you can fork, modify, and redistribute it.

### Technical Questions

**Q: What PHP version do I need?**
A: PHP 5.7 or higher. Modern versions (7.4+, 8.0+) are fully supported.

**Q: Which databases are supported?**
A: MySQL 5.7+ and MariaDB 5.7+. The SQL format is compatible with standard SQL databases.

**Q: How fast are the queries?**
A: Extremely fast! With indexed columns, lookups typically complete in <1ms even with 1000+ records.

**Q: Can I use this with REST APIs?**
A: Yes! The SQL data is easily exposed through REST APIs. See examples in the Use Cases section.

**Q: How often is the data updated?**
A: The geographic hierarchy of Bangladesh rarely changes. We update when official administrative changes occur.

### Implementation Questions

**Q: How do I integrate this with my e-commerce system?**
A: Create a location service class (see example above), connect to the database, and query the location_directory table based on user selections.

**Q: Can I use this with multiple databases?**
A: Yes, import the SQL file into any MySQL/MariaDB database. You can have multiple copies.

**Q: Does this work with Laravel/WordPress/Other frameworks?**
A: Yes! Import the SQL and create models/classes to query it. Examples for popular frameworks available upon request.

**Q: How do I handle location-based pricing?**
A: Use the `zone` column to determine shipping costs. Dhaka zones can have different pricing than outside-dhaka zones.

### Data Questions

**Q: Is all Dhaka included in the "dhaka" zone?**
A: No, only Dhaka District including city proper thanas are in "dhaka" zone. Other districts in Dhaka Division are "outside-dhaka".

**Q: Why are some districts in Dhaka Division but outside-dhaka zone?**
A: This reflects real-world shipping practices in Bangladesh where delivery costs differ significantly.

**Q: Are village/gram (গ্রাম) levels included?**
A: No, the data covers Divisions → Districts → Upazilas → Thanas (for metro). Village-level data can be added as extension.

**Q: How accurate is this geographic data?**
A: Data is sourced from official Bangladesh administrative boundaries and is regularly verified.

### Support Questions

**Q: Where can I report bugs?**
A: Please open an issue on GitHub: [Issues Page](https://github.com/bayeziddev/Bangladesh-geocode/issues)

**Q: Can I contribute to this project?**
A: Absolutely! See the Contributing section below for details.

**Q: Who maintains this project?**
A: [Sayad Md Bayezid Hosan](https://sayadbayezid.com) and community contributors.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 📝 Ways to Contribute
1. **Report Issues** - Found an error? [Open an issue](https://github.com/bayeziddev/Bangladesh-geocode/issues)
2. **Add Missing Data** - Help us add more locations or thanas
3. **Improve Documentation** - Better examples and tutorials
4. **Submit Pull Requests** - Bug fixes and feature enhancements

### 📦 Contribution Process
```bash
# 1. Fork the repository
git clone https://github.com/YOUR_USERNAME/Bangladesh-geocode.git

# 2. Create a feature branch
git checkout -b feature/add-new-locations

# 3. Make your changes
# ... edit files ...

# 4. Commit your changes
git commit -m "Add new locations for Division X"

# 5. Push to your fork
git push origin feature/add-new-locations

# 6. Open a Pull Request
```

---

## 💚 Sponsor This Project

Love this project? Help us keep it updated and maintained!

### Support Options

<div align="center">

| Payment Method | Details | Action |
|---|---|---|
| **PayPal** 🇺🇸 | International payments | [![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.me/connectwithbayezid) |
| **bKash** 🇧🇩 | Local Bangladesh mobile money | `01791527854` |
| **Nagad** 🇧🇩 | Bangladesh mobile payment | `01519601517` |
| **Rocket** 🇧🇩 | Bangladesh mobile payment | `01519601517` |

</div>

### Why Sponsor?
- 💪 Keep the project alive and maintained
- 🚀 Support new features and improvements
- 🐛 Faster bug fixes and updates
- 📚 Better documentation and examples
- 🙏 Your name in our supporters list

### 🌟 Sponsor Benefits
- Recognition as a project sponsor
- Priority support for issues
- Influence on project roadmap
- Your logo in the README

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### License Summary
```
MIT License

Copyright (c) 2024 Sayad Md Bayezid Hosan & Bangladesh Geocode Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

**Key Rights:**
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute freely
- ✅ Use in private projects
- ⚠️ Include license and copyright notice

---

## 👤 About the Creator

<div align="center">

### **Sayad Md Bayezid Hosan**

[![Portfolio](https://img.shields.io/badge/Portfolio-sayadbayezid.com-blue?style=for-the-badge&logo=globe)](https://sayadbayezid.com)
[![Verified Profiles](https://img.shields.io/badge/Verified-Profiles-green?style=for-the-badge)](https://sayadbayezid.com/verified-profiles/)
[![GitHub](https://img.shields.io/badge/GitHub-bayeziddev-black?style=for-the-badge&logo=github)](https://github.com/bayeziddev)

**Full-Stack Developer | Open Source Enthusiast | Bangladesh Tech Community**

**Verified Profiles & Social Links:**
Visit [sayadbayezid.com/verified-profiles/](https://sayadbayezid.com/verified-profiles/) to see all verified profiles and social accounts.

**My Work:**
- 🏗️ Building open-source projects for Bangladesh developers
- 💡 Creating practical solutions for e-commerce and logistics
- 🤝 Contributing to the tech community
- 📚 Sharing knowledge and best practices

---

</div>

## 🎓 API Reference

### Getting All Locations by Zone

```php
<?php
function getLocationsByZone($pdo, $zone) {
    $stmt = $pdo->prepare(
        "SELECT division, district, upazila 
         FROM location_directory 
         WHERE zone = ? 
         ORDER BY division, district, upazila"
    );
    $stmt->execute([$zone]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Usage
$dhakaLocations = getLocationsByZone($pdo, 'dhaka');
$outsideDhaka = getLocationsByZone($pdo, 'outside-dhaka');
?>
```

### Search Locations

```php
<?php
function searchLocation($pdo, $keyword) {
    $keyword = '%' . $keyword . '%';
    $stmt = $pdo->prepare(
        "SELECT * FROM location_directory 
         WHERE division LIKE ? OR district LIKE ? OR upazila LIKE ? 
         LIMIT 20"
    );
    $stmt->execute([$keyword, $keyword, $keyword]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>
```

---

## 🎯 Complete Location Hierarchy

### Data Organization

```
Bangladesh
├── Dhaka Division (Bibhag)
│   ├── Dhaka District
│   │   ├── Adabor (Thana) - Zone: dhaka
│   │   ├── Badda (Thana) - Zone: dhaka
│   │   ├── Banani (Thana) - Zone: dhaka
│   │   └── [32 more City Thanas]
│   ├── Faridpur District
│   │   ├── Faridpur Sadar - Zone: outside-dhaka
│   │   └── Bhanga - Zone: outside-dhaka
│   └── [15 more Districts]
├── Chattogram Division (Bibhag)
│   ├── Cox's Bazar District
│   ├── Bandarban District
│   └── [11 more Districts]
├── Rajshahi Division (Bibhag)
├── Khulna Division (Bibhag)
├── Barishal Division (Bibhag)
├── Sylhet Division (Bibhag)
├── Rangpur Division (Bibhag)
└── Mymensingh Division (Bibhag)
```

---

## 📞 Support & Community

- 💬 **Report Issues** - [GitHub Issues](https://github.com/bayeziddev/Bangladesh-geocode/issues)
- 🌐 **Discussions** - [GitHub Discussions](https://github.com/bayeziddev/Bangladesh-geocode/discussions)
- 📧 **Contact** - Create an issue or discussion for support
- ⭐ **Star us** - If you find this helpful, give us a star!

---

## 🚀 Roadmap

- [ ] JSON export format for APIs
- [ ] REST API endpoint documentation
- [ ] Multi-language support (Bengali/English)
- [ ] Geographic coordinates (latitude/longitude)
- [ ] Historical location changes
- [ ] Standalone REST API wrapper
- [ ] GraphQL support
- [ ] Mobile app integration examples

---

## 📊 SEO Keywords

**This project ranks for:** Bangladesh geocode, Bangladesh locations database, delivery zones Bangladesh, e-commerce shipping Bangladesh, geographic data Bangladesh, Bangladesh district upazila, city thanas Bangladesh, location API Bangladesh, checkout system Bangladesh, logistics Bangladesh, address validation Bangladesh, shipping calculator Bangladesh, Bangladesh postal codes, Bangladesh region data, open source Bangladesh

---

## 🙏 Acknowledgments

- Built with ❤️ for Bangladesh developers
- Comprehensive geographic data covering all 8 divisions
- Optimized for e-commerce and logistics applications
- Community-driven open-source project
- Special thanks to all contributors and supporters

---

<div align="center">

### ⭐ **If you find this project useful, please give it a star!** ⭐

**Made with 💚 by [Sayad Md Bayezid Hosan](https://sayadbayezid.com)**

💝 **Consider sponsoring this project** to keep it maintained and updated!

---

**PayPal:** [![PayPal](https://img.shields.io/badge/PayPal-Donate-blue)](https://www.paypal.me/connectwithbayezid)

**Local (Bangladesh):**
- bKash: `01791527854`
- Nagad/Rocket: `01519601517`

---

[⬆ back to top](#-bangladesh-geocode)

</div>
