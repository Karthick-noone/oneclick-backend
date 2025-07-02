-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 02, 2025 at 04:13 AM
-- Server version: 10.6.21-MariaDB-cll-lve
-- PHP Version: 8.3.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oneclick`
--

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_admin`
--

CREATE TABLE `oneclick_admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_admin`
--

INSERT INTO `oneclick_admin` (`id`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'admin', 'admin', 'karthick.mindtek@gmail.com', '2024-08-27 08:42:48');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_careers`
--

CREATE TABLE `oneclick_careers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `position` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `resumeLink` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_common_coupon`
--

CREATE TABLE `oneclick_common_coupon` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `min_purchase_limit` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_contact_details`
--

CREATE TABLE `oneclick_contact_details` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `subject` varchar(455) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_contact_details`
--

INSERT INTO `oneclick_contact_details` (`id`, `name`, `email`, `phone`, `message`, `created_at`, `subject`) VALUES
(8, 'Brook B', 'brook@gmail.com', '9486672492', 'na', '2024-09-28 11:00:01', 'na'),
(9, 'kevin O', 'kevin@gmail.com', '8989898989', 'na', '2024-10-03 08:16:21', 'na'),
(16, 'Tues A', 'tuesa@gmail.com', '9898989898', 'na', '2024-10-30 08:26:19', 'na'),
(17, 'Karthick A', 'karthick.123@gmail.com', '8778315186', 'need mobile', '2024-11-16 10:56:23', 'I need your help'),
(18, 'test tests', 'muthu@mail.com', '8569745896', 'Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.', '2025-02-07 11:23:58', 'Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.'),
(19, 'Gary Charles', 'garycharles@dominatingkeywords.com', '8054002077', 'Let me demonstrate to you how you can get guaranteed thousands of clicks to your website without SEO and without Pay Per Click.\nYou will start getting keyword targeted traffic in less than 48 hours.\nJust send us your keywords and we\'ll tell you how much monthly clicks we can guarantee without paying for each click and waiting for SEO results.\nYou will get exclusive ownership of keywords you choose for flat fee (no Pay Per Click)...', '2025-04-21 17:49:13', 'Dominating Keywords');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_coupons`
--

CREATE TABLE `oneclick_coupons` (
  `coupon_id` int(11) NOT NULL,
  `coupon_code` varchar(50) NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `expiry_date` date NOT NULL,
  `product_id` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_coupons`
--

INSERT INTO `oneclick_coupons` (`coupon_id`, `coupon_code`, `discount_value`, `expiry_date`, `product_id`) VALUES
(23, 'OFF399', 399.00, '2024-12-12', 'PRD37922'),
(24, 'OCT100', 100.00, '2024-12-10', 'PRD67278'),
(25, 'OCT10', 10.00, '2024-12-13', 'PRD18914'),
(26, 'HFG456', 456.00, '2024-12-14', 'PRD76028'),
(27, 'FHR', 666.00, '2024-12-14', 'PRD76028'),
(29, 'OCT', 134.00, '2024-12-18', 'PRD77770'),
(30, 'OFF', 500.00, '2024-12-27', 'PRD77770'),
(31, 'OFF', 1899.00, '2024-12-27', 'PRD72279'),
(32, 'HAPPYXMAS', 499.00, '2024-12-25', 'PRD41989'),
(33, 'HAPPYXMAS', 499.00, '2024-12-25', 'PRD24233'),
(34, 'HAPPYXMAS', 499.00, '2024-12-25', 'PRD78106'),
(35, 'HAPPYXMAS', 499.00, '2024-12-25', 'PRD21291'),
(36, 'DDEDE', 5000.00, '2025-01-04', 'PRD72279'),
(37, 'WWEDR', 2000.00, '2024-12-31', 'PRD72933'),
(38, 'ERFSDD', 4000.00, '2025-01-10', 'PRD21291'),
(39, 'WERRGF', 4000.00, '2024-12-31', 'PRD21291'),
(40, 'OFF', 600.00, '2025-02-21', 'PRD95945'),
(41, 'OFFTV', 200.00, '2025-02-27', 'PRD31325'),
(42, 'MUTHU', 2000.00, '2025-03-05', 'PRD99729'),
(43, 'MATHI', 2000.00, '2025-05-07', 'PRD17675'),
(44, 'LIAM', 5000.00, '2025-03-05', 'PRD93233'),
(45, 'Mathi', 2000.00, '2025-03-18', 'PRD21124'),
(48, 'PAWZL', 2000.00, '2025-03-15', 'PRD93233'),
(52, 'PAWZL', 500.00, '2025-03-15', 'PRD12650'),
(53, 'PAWZL', 1000.00, '2025-03-14', 'PRD20891'),
(54, 'OFFER', 2000.00, '2025-03-19', 'PRD56243'),
(55, 'mathi', 250.00, '2025-03-19', 'PRD23001'),
(56, 'MATHI', 1000.00, '2025-03-19', 'PRD54724'),
(57, '%$#@!', 500.00, '2025-05-06', 'PRD45757'),
(58, 'specker', 400.00, '2025-05-07', 'PRD73909'),
(59, 'specker', 500.00, '2025-05-07', 'PRD38503'),
(60, '%$#@!', 50.00, '2025-05-07', 'PRD20374'),
(61, 'MUTHU', 200.00, '2025-05-20', 'PRD65506'),
(62, 'Hiii', 200.00, '2025-05-20', 'PRD87534'),
(65, 'Offer', 500.00, '2025-06-28', 'PRD41380'),
(66, 'Offer', 500.00, '2025-06-30', 'PRD59837');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_doubleadpage`
--

CREATE TABLE `oneclick_doubleadpage` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_doubleadpage`
--

INSERT INTO `oneclick_doubleadpage` (`id`, `title`, `description`, `image`, `created_at`, `category`) VALUES
(1, 'Best Prices on Electronics!', 'Shop the latest electronics with unbeatable prices.', 'ad1_1_11zon_1725356209881.jpg', '2024-09-05 05:46:37', 'Mobiles'),
(2, 'Exclusive Deals for You!', 'Don\'t miss out on our exclusive deals and offers.', 'ad2_2_11zon_1725356218518.jpg', '2024-09-03 08:49:02', 'Headphones'),
(3, 'Exclusive Deals for You!', 'Incredible Prices on All Your Favorite Items Get more for less on selected brands', '91fonhAtoAL_1727427900410.jpg', '2024-09-27 09:04:41', 'Mobiles'),
(4, 'Best Prices', 'Incredible Prices on All Your Favorite Items Get more for less on selected brands', '61G3StVpOhL._AC_UF1000,1000_QL80__1727427969154.jpg', '2024-09-27 09:06:09', 'Headphones'),
(5, 'Best sale', 'Incredible sale on All Your Favorite Items Get more for less on selected brands', '1729931336498.png', '2024-09-27 09:06:56', 'Computers'),
(8, 'Best sale', 'Incredible sale on All Your Favorite Items Get more for less on selected brands', '1744189185277', '2024-09-28 10:06:04', 'Headphones'),
(13, 'Exclusive Deals for You!', 'Incredible Prices on All Your Favorite Items Get more for less on selected brands', '1750410610514.png', '2024-10-03 11:54:03', 'Mobiles'),
(14, 'Exclusive Deals for You!', 'Incredible Prices on All Your Favorite Items Get more for less on selected brands', '1751381916889.jpg', '2024-10-18 12:01:36', 'CCTV'),
(24, '', NULL, '1750410595246.png', '2024-11-04 04:50:17', 'Computers');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_edithomepage`
--

CREATE TABLE `oneclick_edithomepage` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_edithomepage`
--

INSERT INTO `oneclick_edithomepage` (`id`, `title`, `description`, `image`, `created_at`, `category`) VALUES
(154, '', NULL, '1751382563011.jpg', '2025-07-01 15:04:50', 'CCTV'),
(155, '', NULL, '1751450938706.jpg', '2025-07-01 15:18:04', 'Headphones'),
(156, '', NULL, '1751450928780.jpg', '2025-07-01 15:21:22', 'Computers');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_mobile_features`
--

CREATE TABLE `oneclick_mobile_features` (
  `feature_id` int(11) NOT NULL,
  `prod_id` varchar(50) NOT NULL,
  `memory` varchar(50) NOT NULL,
  `storage` varchar(50) NOT NULL,
  `processor` varchar(50) NOT NULL,
  `camera` varchar(50) NOT NULL,
  `display` varchar(50) NOT NULL,
  `battery` varchar(50) NOT NULL,
  `os` varchar(50) NOT NULL,
  `network` varchar(50) NOT NULL,
  `others` text NOT NULL,
  `productType` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_mobile_features`
--

INSERT INTO `oneclick_mobile_features` (`feature_id`, `prod_id`, `memory`, `storage`, `processor`, `camera`, `display`, `battery`, `os`, `network`, `others`, `productType`) VALUES
(9, 'PRD84628', '8bg', '128gb', 'snap', '', '6.6 inch -AMOLED', '', 'os', '', 'nil', ''),
(10, 'PRD69542', '8GB', '128GB', 'SNAPDRAGON', '50 MP + 2MP+ 5MP', '5.6 INCH 199 HZ', '5000 MAH', 'ANDROID 13', '5G, 4G ,3G', '', ''),
(11, 'PRD67278', '4 GB', '64 GB', 'Helio G85,  CPU Core Count  8,  Process Node  12 n', 'Front 8 MP / Rear 50 MP + 0.08 MP, Aperture  Front', 'Size  16.66 cm (6.56 inches)  Resolution  1612 × 7', 'Battery  5000 mAh (TYP)  Charging Power  15W  Batt', 'Operating System  Funtouch OS 14  Android Version ', 'Card Slot  2 nano SIMs + 1 microSD  Standby Mode  ', 'Wi-Fi\r\n\r\n2.4 GHz, 5 GHz\r\n\r\nBluetooth\r\n\r\nBluetooth 5.0\r\n\r\nUSB\r\n\r\nUSB 2.0\r\n\r\nGPS\r\n\r\nSupported\r\n\r\nOTG\r\n\r\nSupported\r\n\r\nFM\r\n\r\nSupported\r\nIn the Box\r\nModel\r\n\r\nY18\r\n\r\nQuick Start Guide\r\n\r\nIncluded\r\n\r\nUSB Cable\r\n\r\nIncluded\r\n\r\nCharger\r\n\r\nNot Included\r\n\r\nEject Tool\r\n\r\nIncluded\r\n\r\nPhone Case\r\n\r\nNot Included\r\n\r\nProtective Film (applied)\r\n\r\nIncluded\r\n\r\nWarranty Card\r\n\r\nIncluded', ''),
(12, 'PRD83375', '4GB', '128GB', 'Helio G85, CPU Core Count 8, Process Node 12 n', 'Front 8 MP / Rear 50 MP + 0.08 MP, Aperture Front', 'Size 16.66 cm (6.56 inches) Resolution 1612 × 7', 'Battery 5000 mAh (TYP) Charging Power 15W Batt', 'Funtouch OS 14 Android Version', 'Card Slot 2 nano SIMs + 1 microSD Standby Mode', 'Wi-Fi 2.4 GHz, 5 GHz Bluetooth Bluetooth 5.0 USB USB 2.0 GPS Supported OTG Supported FM Supported In the Box Model Y18 Quick Start Guide Included USB Cable Included Charger Not Included Eject Tool Included Phone Case Not Included Protective Film (applied) Included Warranty Card Included', ''),
(13, 'PRD18914', '4GB', '64GB', 'Processor  Dimensity 6300  CPU Core Count  8  Proc', 'Camera  Front 5 MP / Rear 13 MP + 0.08 MP  Apertur', 'Size  (16.6624 cm) 6.56 inches  Resolution  1612 ×', 'Battery  5000 mAh (TYP)  Charging Power  15W  Batt', 'Operating System  Funtouch OS 14  Android Version ', 'Card Slot  1 nano SIM + 1 nano SIM / microSD  Stan', 'In the Box\r\nModel\r\n\r\nY28e 5G\r\n\r\nQuick Start Guide\r\n\r\nSupported\r\n\r\nUSB Cable\r\n\r\nSupported\r\n\r\nCharger\r\n\r\nNot Supported\r\n\r\nEject Tool\r\n\r\nSupported\r\n\r\nPhone Case\r\n\r\nSupported\r\n\r\nProtective Film (applied)\r\n\r\nSupported\r\n\r\nWarranty Card\r\n\r\nSupported', ''),
(14, 'PRD77116', '', '', '', '', '', '', '', '', '', ''),
(15, 'PRD66089', '', '', '', '', '', '', '', '', '', ''),
(16, 'PRD82771', '', '', '', '', '', '', '', '', '', ''),
(17, 'PRD72279', '8', '512', 'Intel Celeron N4500', '', '15.6 INCH', '', 'Windows 11 Home', '', 'Colour	Black\nVideo Processor	Intel\nChipset Type	Intel\nGraphics Description	Integrated\nItem Weight	1700 Grams\nHard Drive Size	512 GB\nOperating System	Windows 11 Home\nGraphics Ram Type	VRAM\nAutomatic Backup Software Included	Microsoft Office 365\nProduct Features	Portable\nHard Disk Description	SSD\nCompatible Devices	Laptop\nSpecific Uses For Product	Student, Business\nForm Factor	Netbook\nItem Dimensions L x W x Thickness	35.9L x 24.2W x 1.8Th Centimeters', ''),
(18, 'PRD61390', '4GB', '128 GB', 'Mediatek', '13MP Rear Camera', '16.66 cm (6.56 inch) Display', '5000 mAh Battery', '', '5G, 4G VOLTE, 4G, 3G, 2G', 'Camera: Dual 13MP+0.08MP Rear Camera | 5MP Selfie Camera Display: 16.6624 cm (6.56\" inch) LCD Capacitive multi-touch display 90Hz refresh rate, 269 ppi Memory & SIM: 4GB RAM | 64GB internal memory; LPDDR4X | eMMC 5.1 Battery & charging: 5000 mAh with 15W charging Side-mounted capacitive fingerprint sensor Processor: Dimensity 6300 5G processor Rear camera: Night, Portrait, Photo, Video, Pano, Documents, Slo-mo, Time-lapse, Pro, Live Photo Front camera: Night, Portrait, Photo, Video, Live Photo This product is rated as IP54 for splash, water, and dust resistance under IEC standard 60529 and was tested under controlled laboratory conditions. The resistance to splashes, water and dust is not permanent and may be reduced due to daily use.\r\n', ''),
(19, 'PRD29492', '4GB', '128 GB', 'Processor Brand Mediatek Processor Type Dimensity ', '50MP + 0.08MP', 'Display Size 16.66 cm (6.56 inch) Resolution 1612 ', 'Battery Capacity 5000 mAh Battery Type Lithium-ion', 'Operating System Android 14', 'Network Type 5G, 4G, 3G, 2G Supported Networks 5G,', 'Smartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nGraphics PPI\r\n269 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Motor, Side Mounted Capacitive Fingerprint Sensor\r\nOther Features\r\nIngress Protection Rating: IP64, eMMC 5.1 ROM, Expandable RAM Capacity: 4 GB, Charging Power: 15W, Back Cover Material: Composite Plastic Sheet, Light Emitting Material: LED\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS', ''),
(20, 'PRD37492', '6 GB', '128GB', 'Processor Brand Mediatek Processor Type Dimensity ', '50MP + 0.08MP | 8MP Front Camera', ' Display Size 16.66 cm (6.56 inch) Resolution 1612', 'Battery Capacity 5000 mAh Battery Type Lithium-ion', 'Funtouch OS 14 (Based on Android 14)', ' Network Type 5G, 4G, 3G, 2G Supported Networks 5G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSocial Networking Phone\r\nYes\r\nInstant Message\r\nYes', ''),
(21, 'PRD29763', '8 GB', '256 GB', 'Processor Brand Snapdragon Processor Type 4 Gen 2 ', 'Primary Camera Available Yes Primary Camera 50MP +', 'Display Size 16.94 cm (6.67 inch) Resolution 2400 ', '5000 mAh', 'Android 14', 'Network Type 5G, 4G, 3G, 2G Supported Networks 5G,', '\r\nSmartphone\r\nYes\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, In-Display Fingerprint Sensor, Gyroscope\r\nOther Features\r\n80W Fast Charging, UFS 2.2 ROM, IP Rating: IP64, Material: Plastic Composite Sheet\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, NAVIC, GNSS', ''),
(22, 'PRD15288', '8GB', '128GB', 'Mediatek  Dimensity 6300', 'Main camera 50MP + 0.08MP  Front Camera: 8MP', ' Display Size 16.66 cm (6.56 inch) Resolution 1612', 'attery Capacity 5000 mAh Battery Type Lithium-ion', ' Android 14', ' 5G, 4G, 3G, 2G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nGraphics PPI\r\n269 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Motor, Side Mounted Capacitive Fingerprint Sensor\r\nOther Features\r\nIngress Protection Rating: IP64, eMMC 5.1 ROM, Expandable RAM Capacity: 8 GB, Charging Power: 15W, Back Cover Material: Composite Plastic Sheet, Light Emitting Material: LED\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(23, 'PRD56157', '8GB', '128GB', 'Processor Brand Snapdragon Processor Type 695 Proc', 'Primary Camera 50MP + 2MP Primary Camera Features ', 'Display Size 17.22 cm (6.78 inch) Resolution 2400 ', 'Battery Capacity 5000 mAh', 'Android 14', 'Network Type 2G, 3G, 4G, 5G Supported Networks 4G ', 'Smartphone\r\nYes\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, In-Display Fingerprint Sensor, Gyroscope\r\nOther Features\r\n44W Fast Charging, IP Rating: IP54, Material: Composite Plastic Sheet\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, NAVIC', ''),
(24, 'PRD32272', '8GB', '128GB', ' Snapdragon 4 Gen 2', 'Primary Camera 50MP + 2MP  Secondary Camera 32MP F', ' Display Size 16.94 cm (6.67 inch) Resolution 2400', ' 5000 mAh', ' Android 14', '5G, 4G, 3G, 2G', '\r\nSmartphone\r\nYes\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, In-Display Fingerprint Sensor, Gyroscope\r\nOther Features\r\n80W Fast Charging, UFS 2.2 ROM, IP Rating: IP64, Material: Plastic Composite Sheet\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, NAVIC, GNSS', ''),
(25, 'PRD37221', '4 GB', '64 GB', 'Processor Brand Mediatek Processor Type Helio G85 ', 'Primary Camera 8MP + 2MP Primary Camera Features D', 'Display Size 16.66 cm (6.56 inch) Resolution 1612 ', 'Battery Capacity 5000 mAh', 'ColorOS 13.1 (Based on Android 13)', 'Network Type 4G, 3G, 2G Supported Networks 4G LTE,', 'Sensors\r\nGeomagnetic Sensor, Light Sensor, Optical Proximity Sensor, Accelerometer, Step Counter, Fingerprint Sensor, Facial Recoginition Sensor\r\nOther Features\r\nEMMC 5.1, Supports Phone Storage, Bluetooth Audio Codec: SBC, AAC, aptX HD, LDAC\r\nGPS Type\r\nAssisted GPS (A-GPS), Beidou: B11, GPS: L1, GLONASS: G1, GALILEO: E1, QZSS: L1, WLAN and Cellular Network Positioning', ''),
(26, 'PRD77770', '4GB', '128GB', 'rocessor Brand Mediatek Processor Type Helio G70 (', 'Primary Camera 50MP + 2MP Primary Camera Features ', 'Display Size 16.66 cm (6.56 inch) Resolution 1612 ', '5000 mAh Battery', 'ColorOS 13.1 (Based on Android 13)', '4G LTE: B1/B3/B5/B8/B38/B40/B41, 3G WCDMA: B1/B5/B', '\r\nFM Radio\r\nYes\r\nFM Radio Recording\r\nYes\r\nAudio Formats\r\nMP3, AAC, WAV', ''),
(27, 'PRD41989', '12 GB', '512 GB', 'Processor  Dimensity 9400  CPU Core Count  Octa-co', 'Camera  Front 32 MP/Rear 50 MP + 50 MP + 200 MP  A', 'Size  6.78? (17.22 cm)  Resolution  2800 × 1260  R', 'Battery  [Overseas (except Austria and Hungary)] T', 'Android 15', '2G GSM  850/900/1800/1900 MHz  3G WCDMA  B1/B2/B4/', 'Accelerometer\r\n\r\nSupported\r\n\r\nAmbient Light Sensor\r\n\r\nSupported\r\n\r\nE-compass\r\n\r\nSupported\r\n\r\nProximity Sensor\r\n\r\nSupported\r\n\r\nColor Temperature Sensor\r\n\r\nFront color temperature sensor\r\n\r\nMotor\r\n\r\nLinear motor\r\n\r\nGyroscope\r\n\r\nGyroscope supported\r\n\r\nOthers\r\n\r\nLaser focusing sensor; Infrared blaster; Flicker sensor; Multispectral sensor', ''),
(28, 'PRD24233', '12 GB', '256 GB', 'Processor Brand Mediatek Processor Type Dimensity ', 'Primary Camera Available Yes Primary Camera 50MP +', 'Display Size 16.94 cm (6.67 inch) Resolution 2800 ', 'Battery Capacity 5800 mAh', 'Android 15', 'etwork Type 5G, 4G, 3G, 2G Supported Networks 5G, ', 'SIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, In Display Optical Fingerprint Sensor, Color Temperature Sensor, Laser Focus Sensor, Infrared Blaster, Flicker Sensor, Gyroscope\r\nOther Features\r\nUFS 4.0, 90W FlashCharge, Frame Material: Aluminium Alloy, IP (Ingress Protection) Rating: IP68, IP69, Display Protection: SCHOTT Xensation a, Bluetooth Audio Specification: SBC, AAC, aptX, aptX HD, LDAC, Supports Voice Recording\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, NAVIC, A-GPS, Cellular Positioning, Wi-Fi Positioning', ''),
(29, 'PRD78106', '16 GB', '512 GB', 'Processor Brand Mediatek Processor Type Dimensity ', 'Primary Camera Available Yes Primary Camera 50MP +', 'Display Size 16.94 cm (6.67 inch) Resolution 2800 ', 'Battery Capacity 5800 mAh', 'Android 15', 'Network Type 5G, 4G, 3G, 2G Supported Networks 5G,', '1 Year Warranty on Handset and 6 Months Warranty on Accessories\r\n', ''),
(30, 'PRD21291', '16 GB', '512 GB', 'Processor Brand Mediatek Processor Type Dimensity ', 'Primary Camera Available Yes Primary Camera 50MP +', 'Display Size 17.22 cm (6.78 inch) Resolution 2800 ', '6000 mAh Battery', 'Android 15', 'Network Type 5G, 4G, 3G, 2G Supported Networks 5G,', '1 Year Warranty on Handset and 6 Months Warranty on Accessories', ''),
(31, 'PRD70748', '', '', '', '', '', '', '', '', '', ''),
(32, 'PRD25284', '16 GB', '512 GB', 'Processor Brand Mediatek Processor Type Dimensity', 'Primary Camera Available Yes Primary Camera 50MP ', 'Display Size 16.94 cm (6.67 inch) Resolution 2800', 'Battery Capacity 5800 mAh', 'Android 15', 'Network Type 5G, 4G, 3G, 2G Supported Networks 5G,', '1 Year Warranty on Handset and 6 Months Warranty on Accessories', ''),
(33, 'PRD95945', '16 GB', '512 GB', 'i5 12th Gen 1235U', '', '14 Inches', '', 'Windows 11 Pro', '', 'HD Audio, Lightweight, Anti Glare Coating, Numeric Keypad Weighing just 1.6 kg, this laptop offers excellent portability, making it an ideal companion whether at home or on the go. Its sleek design ensures it easily fits into your bag, allowing for hassle-free transportation. Engineered for mobility, you can conveniently take your device wherever your work or leisure activities require. Enhance productivity while maintaining comfort with this efficient laptop.\r\nEquipped with an Intel Core i5 processor from the 12th generation, this laptop ensures smooth and efficient multitasking. With its advanced computing capabilities, it is suitable for processing various tasks without any lag. The 8 GB of DDR4 RAM further supports seamless operation, enabling you to run multiple applications simultaneously. Whether you are working on complex tasks or simply browsing the web, this laptop delivers consistent and reliable performance.\r\nFeaturing a 35.56 cm display with a resolution of 1920 x 1080 pixels, this laptop offers a crisp and clear viewing experience. The Full HD screen enhances visual clarity, making it suitable for both work and entertainment. Enjoy movies, video calls, and more with vibrant details and accurate colours. The screen\'s quality ensures a comfortable visual experience, reducing strain during extended use.', ''),
(34, 'PRD69484', '', '', '', '', '', '', '', '', '', ''),
(35, 'PRD14989', '', '', '', '', '', '5000Ahm', '', '', '', ''),
(36, 'PRD61648', '16 GB LPDDR5X-6400MT/s (Soldered)', '512 GB SSD M.2 2242 PCIe Gen4 QLC', 'AMD Ryzen™ 7 7735HS Processor (3.20 GHz up to 4.75', '', '33.78cms (13.3) WUXGA (1920 x 1200), IPS, Anti-Gla', '', 'Windows 11 Home Single Language 64', '', 'Windows 11 Home Single Language 64', ''),
(37, 'PRD93161', '16 GB LPDDR5X-6400MT/s (Soldered)', '512 GB SSD M.2 2242 PCIe Gen4 QLC', 'AMD Ryzen™ 7 7735HS Processor (3.20 GHz up to 4.75', '', '33.78cms (13.3) WUXGA (1920 x 1200), IPS, Anti-Gla', '', 'Windows 11 Home Single Language 64', '', 'Windows 11 Home Single Language 64', ''),
(38, 'PRD21705', '26GB', '512GB', 'Intel Celeron N4500', '200MP', '15.6 INCH', '5000Ahm', 'Windows 11 Home', '5G', 'fgdfgd', ''),
(39, 'PRD80580', '16 GB', '512 GB', 'Intel Celeron N4500', '', '14 Inches', '', 'Windows 11 Home', '', 'uyuuyuy', ''),
(40, 'PRD43033', '4GB', '64 GB', 'i5 12th Gen 1235U', '200MP', '14 Inches', '5000 mAh Battery', 'Windows 11 Pro', '5G', 'thtryhety', ''),
(41, 'PRD26753', '8 GB', '128 GB', 'Octa Core', '', ' 17.07 cm (6.72 inch)', '', ' Android 13', '', '', ''),
(42, 'PRD56409', '8 GB', '128 GB', 'Octa Core', '', ' 16.94 cm (6.67 inch)', '', 'Android Oxygen', '', '\r\nCamera: 50 MP Main Camera with EIS; 2MP Depth-Assist Lens and 2MP Macro Lens; Front (Selfie) Camera: 16MP Rear Camera Mode: Hi-res 50MP mode, 3x Lossles Zoom, Photo, Video, Nightscape, Expert, Panoramic, Portrait, Macro, Time-lapse, Slow-motion, Long exposure, Dual-view video, Text Scanner, 1080p/720p@30fps, Video zoom: 1080P@30fps, 720P@30fps, Slow motion: 720P@120fps, Time-Lapse: 1080P@30fps, Steady Video EIS support Display: 6.72 Inches; 120 Hz Adaptive refresh rate; FHD+(1080x2400), ', ''),
(43, 'PRD37959', '8 GB', '256 GB', 'Deca Core', '', ' 17.02 cm (6.7 inch)', '', ' Android 14', '', '', ''),
(44, 'PRD94305', '12 GB', '256 GB', ' Octa Core', '', ' 17.02 cm (6.7 inch)', '', 'Android 14', '', '', ''),
(45, 'PRD23734', '8 GB', '128 GB', ' Hexa Core', '', '15.49 cm (6.1 inch)', '', ' iOS 18', '', '', ''),
(46, 'PRD29722', '8 GB', '128 GB', ' Hexa Core', '', '15.49 cm (6.1 inch)', '', 'iOS 15', '', '', ''),
(47, 'PRD16397', '12 GB', '256 GB', ' Octa Core', '', ' 17.22 cm (6.78 inch)', '', ' Android 14', '', '', ''),
(48, 'PRD73293', '6 GB', '128 GB', 'Snapdragon', '', '17.06 cm (6.7165354 inch)', '', ' Android 14', '', '', ''),
(49, 'PRD97805', '8 GB', ' 256 GB', ' Mediatek', '', ' 16.74 cm (6.59 inch)', '', ' Android 15', '', '', ''),
(50, 'PRD81063', '8 GB', ' 128 GB', ' Octa Core', '50mp', ' 17.07 cm (6.72 inch)', '5000Ah', ' Android 13', '5G', '', ''),
(51, 'PRD79311', '8 GB', '128 GB', ' Octa Core', '24 MP', ' 16.94 cm (6.67 inch)', '5000Ah', 'Android Oxygen', '5G', '', ''),
(52, 'PRD30268', ' 8 GB', ' 256 GB', 'Deca Core', '50MP', ' 17.02 cm (6.7 inch)', '10000Ah', ' Android 14', '5G', '', ''),
(53, 'PRD17176', '12 GB', ' 256 GB', ' Octa Core', '80MP ', '17.02 cm (6.7 inch)', '10000Ah', ' Android 14', '5G', '', ''),
(54, 'PRD86186', '8 GB', ' 128 GB', 'Hexa Core', '50MP ', ' 15.49 cm (6.1 inch)', '8000Ah', ' iOS 18', '5G', '', ''),
(55, 'PRD34716', '8 GB', '128 GB', ' Hexa Core', '50MP', '15.49 cm (6.1 inch)', '5000Ah', ' iOS 15', '5G', '', ''),
(56, 'PRD32897', '12 GB', '256 GB', ' Octa Core', '50MP', '17.22 cm (6.78 inch)', '5000Ah', ' Android 14', '5G', '', ''),
(57, 'PRD85814', '8 GB', '256 GB', ' Mediatek', '80MP', ' 16.74 cm (6.59 inch)', '5000Ah', ' Android 15', '5G', '', ''),
(58, 'PRD99729', ' 8 GB', '512 GB', ' Ryzen 3 Quad Core', '', '39.62 cm (15.6 inch)', '', 'Windows 11 Home', '', '', ''),
(59, 'PRD78008', ' 16 GB', ' 1 TB', ' Core Ultra 5', '', '40.64 cm (16 inch)', '', 'Windows 11 Home', '', '', ''),
(60, 'PRD56243', ' 8 GB', '512 GB', ' Core i5', '', '39.62 cm (15.6 inch)', '', 'Windows 11 Home', '', '', ''),
(61, 'PRD21124', ' 8 GB', '512 GB', 'Core i3', '', '39.62 cm (15.6 Inch)', '', ' Windows 11 Home', '', '', ''),
(62, 'PRD77799', '16GB', '256GB', 'snapdragon 888', '108MP + 8MP', '6.6 inch -AMOLED', '5000mah', 'Android 13', '5g', '', ''),
(63, 'PRD62468', '', '', '', '', '', '', '', '', '', ''),
(64, 'PRD79543', '', '', '', '', '', '', '', '', '', ''),
(65, 'PRD69370', '', '', '', '', '', '', '', '', '', ''),
(66, 'PRD56640', '', '', '', '', '', '', '', '', '', ''),
(67, 'PRD98715', '', '', '', '', '', '', '', '', '', ''),
(68, 'PRD43489', '', '', '', '', '', '', '', '', '', ''),
(69, 'PRD89325', '', '', '', '', '', '', '', '', '', ''),
(70, 'PRD61501', '8 GB', '128 GB', ' Octa Core', '24 MP', ' 16.94 cm (6.67 inch)', '5000Ah', 'Android Oxygen', '5G', '', ''),
(71, 'PRD44438', '8 GB', '128 GB', ' Octa Core', '24 MP', ' 16.94 cm (6.67 inch)', '5000Ah', 'Android Oxygen', '5G', '', ''),
(72, 'PRD93233', '8GB', '128GB', 'Octa Core', '50MP + 0.08MP | 8MP Front Camera', '16.94 cm (6.67 inch)', '5000mah', 'Android oxygen', '5G', '', ''),
(73, 'PRD97521', ' 8 GB', '512 GB', 'Core i3', '', '39.62 cm (15.6 Inch)', '', ' Windows 11 Home', '', '', ''),
(74, 'PRD14436', '8 GB', '128 GB', ' Hexa Core', '50MP', '15.49 cm (6.1 inch)', '5000Ah', ' iOS 15', '5G', '', ''),
(75, 'PRD83611', '8 GB', '128 GB', ' Hexa Core', '50MP', '15.49 cm (6.1 inch)', '5000Ah', ' iOS 15', '5G', '', ''),
(76, 'PRD11127', '8 GB', '128 GB', ' Hexa Core', '50MP', '15.49 cm (6.1 inch)', '5000Ah', ' iOS 15', '5G', '', ''),
(77, 'PRD60212', '8 GB', '128 GB', ' Hexa Core', '50MP', '15.49 cm (6.1 inch)', '5000Ah', ' iOS 15', '5G', '', ''),
(78, 'PRD30666', '8 ', '128 ', '7s Gen 2 Processor', '50 MP +13 MP front camer 32 MP', ' 17.02 cm (6.7 inch)', '5000 mAh', ' Android 14', '5G', '', ''),
(79, 'PRD62636', '8 ', '128 ', '7s Gen 2 Processor', '50 MP +13 MP front camer 32 MP', ' 17.02 cm (6.7 inch)', '5000 mAh', ' Android 14', '5G', '', ''),
(80, 'PRD77721', ' 8 GB', '512 GB', 'Core i3', '', '39.62 cm (15.6 Inch)', '', ' Windows 11 Home', '', '', ''),
(81, 'PRD23223', '', '', '', '', '', '', '', '', '', ''),
(82, 'PRD20303', '', '', '', '', '', '', '', '', '', ''),
(83, 'PRD37478', '', '', '', '', '', '', '', '', '', ''),
(84, 'PRD87413', '8 GB', '128 GB', '7s Gen 2 Processor', '50 MP +13 MP front camer 32 MP', ' 17.02 cm (6.7 inch)', '5000 mAh', ' Android 14', '5G', '7s Gen 2 Processor', ''),
(85, 'PRD23688', '8 GB', '512 ', 'Windows 11 Home', '', '23.8-inch FHD (1920x1080) ', '', 'Windows 11 Home', '', '85% positive ratings from 100K+ customers\r\n\r\n\r\n100K+ recent orders from this brand\r\n\r\n11+ years on Amazon', ''),
(86, 'PRD87534', '4 GB', '128 GB', 'Octa-Core Processor', '8 MP', ' (1920 x 1080) @30fps', '5000mAh ', 'Android 15.0', '5G', 'Monster Convenience & Security - Knox Security | Get segment\'s leading 4 Generations of AndroidOS Upgrades & 4 Years of Security Updates\r\nMonster Battery & Charging - Get a massive 5000mAh Lithium-ion Battery (Non-Removable) with Segment leading Fast Charging 25W Support', ''),
(87, 'PRD51705', ' RAM 4 GB', ' Internal Storage 128 GB RAM 4 GB Expandable Stora', ' Operating System Android 14 Processor Brand Media', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 16.97 cm (6.68 inch) Resolution 1608', ' Battery Capacity 5500 mAh Battery Type Lithium Io', ' Operating System Android 14 Processor Brand Media', ' Network Type 5G, 4G, 3G, 2G Supported Networks 5G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nGraphics PPI\r\n264 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Motor, Side Mounted Capacitive Fingerprint Sensor\r\nOther Features\r\nIngress Protection Rating: IP64, eMMC 5.1 ROM, 44W Charging Power, Back Cover Material: Composite Plastic Sheet, Supports Voice Recording, Supports Dual Speakers\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(88, 'PRD45274', ' RAM 6 GB', ' Internal Storage 128 GB RAM 6 GB Expandable Stora', ' Operating System Android 14 Processor Brand Media', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 16.97 cm (6.68 inch) Resolution 1608', ' Battery Capacity 5500 mAh Battery Type Lithium Io', ' Operating System Android 14 Processor Brand Media', ' Network Type 5G, 4G, 3G, 2G Supported Networks 5G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nGraphics PPI\r\n264 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Motor, Side Mounted Capacitive Fingerprint Sensor\r\nOther Features\r\nIngress Protection Rating: IP64, eMMC 5.1 ROM, 44W Charging Power, Back Cover Material: Composite Plastic Sheet, Supports Voice Recording, Supports Dual Speakers\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(89, 'PRD31097', ' RAM 6 GB', ' Internal Storage 128 GB RAM 6 GB Expandable Stora', ' Operating System Android 14 Processor Brand Media', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 16.97 cm (6.68 inch) Resolution 1608', ' Battery Capacity 5500 mAh Battery Type Lithium Io', ' Operating System Android 14 Processor Brand Media', ' Network Type 5G, 4G, 3G, 2G Supported Networks 5G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nGraphics PPI\r\n264 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Motor, Side Mounted Capacitive Fingerprint Sensor\r\nOther Features\r\nIngress Protection Rating: IP64, eMMC 5.1 ROM, 44W Charging Power, Back Cover Material: Composite Plastic Sheet, Supports Voice Recording, Supports Dual Speakers\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(90, 'PRD86776', '4 GB', ' Internal Storage 128 GB RAM 4 GB Expandable Stora', ' Operating System Android 15 Processor Brand Media', ' Primary Camera Available Yes Primary Camera 13MP ', ' Display Size 17.12 cm (6.74 inch) Resolution 1600', ' Battery Capacity 5500 mAh Battery Type Lithium Io', ' Funtouch OS 15 (Based on Android 15)', ' Network Type 5G, 4G, 3G, 2G Supported Networks 5G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n260 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, Ordinary Motor, Side Mounted Capacitive Fingerprint Sensor\r\nOther Features\r\nIngress Protection Rating: IP64, eMMC5.1 ROM, Expandable RAM Capacity: 4GB, Charging Power: 15W, Back Cover Material: Composite Plastic Sheet, Light Emitting Material: LED\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(91, 'PRD58012', '4 GB', ' Internal Storage 64 GB RAM 4 GB Expandable Stora', ' Operating System Android 15 Processor Brand Media', ' Primary Camera Available Yes Primary Camera 13MP ', ' Display Size 17.12 cm (6.74 inch) Resolution 1600', ' Battery Capacity 5500 mAh Battery Type Lithium Io', ' Funtouch OS 15 (Based on Android 15)', ' Network Type 5G, 4G, 3G, 2G Supported Networks 5G', '\nIngress Protection Rating: IP64, eMMC5.1 ROM, Expandable RAM ', ''),
(92, 'PRD30299', '8 GB', '512 GB', '13th Generation Intel® Core™ i3 processor', '', 'Item Height	?52 Centimeters Item Width	?6.9 Centim', '', 'Windows 11 Home', '', 'Brand	?HP\r\nManufacturer	?HP, HP India Sales Pvt. Ltd.\r\nSeries	?15-fd0006TU\r\nColour	?Natural Silver\r\nForm Factor	?Netbook\r\nItem Height	?52 Centimeters\r\nItem Width	?6.9 Centimeters\r\nStanding screen display size	?39.6 Centimetres\r\nScreen Resolution	?1920 x 1080 pixels\r\nResolution	?1920 x 1080 Pixels\r\nProduct Dimensions	?52 x 6.9 x 52 cm; 1.6 kg\r\nBatteries	?1 Lithium Ion batteries required. (included)\r\nItem model number	?15-fd0006TU\r\nProcessor Brand	?Intel\r\nProcessor Type	?Core i3\r\nProcessor Speed	?4.5 GHz\r\nProcessor Count	?1\r\nRAM Size	?8 GB\r\nMemory Technology	?DDR4\r\nMaximum Memory Supported	?16 GB\r\nMemory Clock Speed	?3200 GHz\r\nHard Drive Size	?512 GB\r\nHard Disk Description	?SSD\r\nAudio Details	?Headphones, Speakers\r\nSpeaker Description	?Dual speakers\r\nGraphics Coprocessor	?Intel UHD Graphics\r\nGraphics Chipset Brand	?Intel\r\nGraphics Card Description	?Integrated\r\nGraphics RAM Type	?VRAM\r\nGraphics Card Ram Size	?8 GB\r\nGraphics Card Interface	?Integrated\r\nConnectivity Type	?Bluetooth\r\nNumber of USB 3.0 Ports	?2\r\nNumber of HDMI Ports	?1\r\nVoltage	?41 Volts\r\nRear Webcam Resolution	?0.92 MP\r\nFront Webcam Resolution	?1080 Pixels\r\nHardware Platform	?PC\r\nOperating System	?Windows 11 Home\r\nAverage Battery Life (in hours)	?9 Hours\r\nAre Batteries Included	?Yes\r\nLithium Battery Energy Content	?41 Watt Hours\r\nNumber of Lithium Ion Cells	?3\r\nIncluded Components	?Laptop, Power Adapter, User Manual\r\nManufacturer	?HP\r\nCountry of Origin	?China\r\nItem Weight	?1 kg 600 ', ''),
(93, 'PRD81908', '8 GB', '512 GB', 'Intel® Core™ i3-1315U (up to 4.5 GHz with Intel® T', '', 'Screen Size 39.6 cm (15.6) diagonal FHD display', '', 'Windows 11 Home Single Language', '', 'SKU :- 7Q6Y9PA\r\n13th Generation Intel® Core™ i3 processor\r\nWindows 11 Home Single Language\r\n39.6 cm (15.6) diagonal FHD display with Intel® UHD Graphics\r\n8 GB DDR4 RAM\r\n512 GB SSD Solid State Drive\r\nTrue Vision 1080p FHD camera, Privacy Camera\r\n1 Year Warranty', ''),
(94, 'PRD89454', '8 GB', '512 GB', '13th Generation Intel® Core™ i5 processor', '', '39.6 cm (15.6) diagonal FHD display with Intel® In', '', 'Windows 11 Home Single Language', '', 'SKU :-7Q6Z3PA\r\n13th Generation Intel® Core™ i5 processor\r\nWindows 11 Home Single Language\r\n39.6 cm (15.6) diagonal FHD display with Intel® Integrated Graphics\r\n8 GB DDR4 RAM\r\n512 GB SSD Solid State Drive\r\nBacklit Keyboard with numeric keypad, True Vision 1080p FHD camera, Privacy Camera\r\n1 year onsite warranty.', ''),
(95, 'PRD13672', '8 GB', '512 GB', '13th Generation Intel® Core™ i5 processor', '', '39.6 cm (15.6) diagonal FHD display', '', 'Windows 11 Home Single Language', '', 'SKU :- B61ZGPA\r\n13th Generation Intel® Core™ i5 processor\r\nWindows 11 Home Single Language\r\n39.6 cm (15.6) diagonal FHD display\r\nIntel® UHD Graphics\r\n8 GB DDR4-3200 MT/s RAM\r\n512 GB SSD Hard Drive\r\nHP True Vision 1080p FHD camera\r\nFull-size, soft grey keyboard with numeric keypad', ''),
(96, 'PRD89720', '16 GB', '512 GB', '13th Generation Intel® Core™ i5 processor', '', 'Display  39.6 cm (15.6) diagonal, FHD (1920 x 1080', '', 'Windows 11 Home', '', 'SKU :- B61ZHPA\r\n13th Generation Intel® Core™ i5 processor\r\nWindows 11 Home\r\n39.6 cm (15.6) diagonal FHD display\r\nIntel® Iris® X? Graphics\r\n16 GB DDR4-3200 MT/s RAM\r\n512 GB SSD Hard Drive\r\nHP True Vision 1080p FHD camera\r\nFull-size, soft grey keyboard with numeric keypad', ''),
(97, 'PRD99251', '16 GB', '512 GB', 'Intel® Core™ i7-1355U (up to 5.0 GHz with Intel® T', '', '39.6 cm (15.6) diagonal, FHD (1920 x 1080), micro-', '', 'Windows 11 Home', '', 'SKU :- B61ZJPA\r\n13th Generation Intel® Core™ i7 processor\r\nWindows 11 Home\r\n39.6 cm (15.6) diagonal FHD display\r\nIntel® Iris® X? Graphics\r\n16 GB DDR4-3200 MT/s RAM\r\n512 GB SSD Hard Drive\r\nHP True Vision 1080p FHD camera\r\nFull-size, soft grey keyboard with numeric keypad', ''),
(98, 'PRD98140', ' Internal Storage 128 GB RAM 8 GB Expandable Stora', '128 GB', ' Operating System Android 14 Processor Brand Snapd', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 16.94 cm (6.67 inch) Resolution 2400', ' Battery Capacity 5000 mAh', ' Operating System Android 14 Processor Brand Snapd', ' Network Type 5G, 4G, 3G, 2G', '\r\nSmartphone\r\nYes\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, In-Display Fingerprint Sensor, Gyroscope\r\nOther Features\r\n80W Fast Charging, UFS 2.2 ROM, IP Rating: IP64, Material: Plastic Composite Sheet\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, NAVIC, GNSS\r\nMultimedia Features', ''),
(99, 'PRD42120', ' 8 GB RAM | 256 GB ROM', ' 256 GB ROM', 'Os & Processor Features Operating System Android 1', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 17.2 cm (6.77 inch) Resolution 2392 ', '6000 mAh Battery', 'Os & Processor Features Operating System Android 1', ' Network Type 5G Supported Networks 5G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nAMOLED\r\nUser Interface\r\nAndroid 15\r\nGraphics PPI\r\n389 ppi\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Gyroscope, In-display Optical Fingerprint Sensor\r\nSeries\r\nV50\r\n\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nAMOLED\r\nUser Interface\r\nAndroid 15\r\nGraphics PPI\r\n389 ppi\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Gyroscope, In-display Optical Fingerprint Sensor\r\nSeV50\r\n', ''),
(100, 'PRD23334', ' 8 GB RAM | 256 GB ROM', '256 GB', ' Operating System Android 15 Processor Brand Snapd', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 17.2 cm (6.77 inch) Resolution 2392 ', 'Battery Capacity 7300 mAh Battery Type Lithium-ion', ' Operating System Android 15 Processor Brand Snapd', ' Network Type 5G, 4G, 3G, 2G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n387 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, Gyroscope, Infrared Remote Control, In Display Optical Fingerprint Sensor, Eccentric Rotating Mass Vibration Motor\r\nOther Features\r\nIngress Protection Rating: IP65, Expandable RAM Capacity: 8 GB, 90W Charging Power, Back Cover Material: Composite Plastic Sheet, Voice Recording\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, GNSS\r\n', ''),
(101, 'PRD32038', ' 8 GB RAM | 256 GB ROM', '256 GB', ' Operating System Android 15 Processor Brand Snapd', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 17.2 cm (6.77 inch) Resolution 2392 ', 'Battery Capacity 7300 mAh Battery Type Lithium-ion', ' Operating System Android 15 Processor Brand Snapd', ' Network Type 5G, 4G, 3G, 2G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n387 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, Gyroscope, Infrared Remote Control, In Display Optical Fingerprint Sensor, Eccentric Rotating Mass Vibration Motor\r\nOther Features\r\nIngress Protection Rating: IP65, Expandable RAM Capacity: 8 GB, 90W Charging Power, Back Cover Material: Composite Plastic Sheet, Voice Recording\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, GNSS\r\n', ''),
(102, 'PRD29483', '8 GB RAM | 256 GB ROM', ' 256 GB ROM', ' Operating System Android 14 Processor Brand Media', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 17.2 cm (6.77 inch) Resolution 2392 ', '5500 mAh Battery', ' 2G GSM: 850 MHz/900 MHz/1800 MHz, 3G WCDMA: B1/B5', ' Network Type 5G, 4G, 3G, 2G', '\r\nSmartphone\r\nYes\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nGraphics PPI\r\n387 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Ordinary Motor, Gyroscope, Infrared Blaster\r\nOther Features\r\nUFS 3.1 ROM, 90W Fast Charger, IP Rating: IP65, Supports Voice Recording, 50% Charging in 19 Minutes\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS', ''),
(103, 'PRD40648', '8 GB RAM | 256 GB ROM', ' 256 GB ROM', ' Operating System Android 15 Processor Brand Snapd', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 16.97 cm (6.68 inch) Resolution 1608', ' Battery Capacity 6500 mAh Battery Type Lithium Io', ' 2G GSM: 850 MHz/900 MHz/1800 MHz, 3G WCDMA: B1/B5', ' Network Type 5G, 4G, 3G, 2G Smartphone Yes Touchs', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n264 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, Gyroscope, Ordinary Motor\r\nOther Features\r\nIngress Protection Rating: IP64, UFS 2.2 ROM, Charging Power: 44W, Back Cover Material: Composite Plastic Sheet, Side Mounted Capacitive Fingerprint Sensor\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS', ''),
(104, 'PRD66248', '8 GB RAM | 256 GB ROM', '256 GB ROM', ' Operating System Android 15 Processor Brand Media', 'Primary Camera Available Yes Primary Camera 50MP +', ' Display Size 17.07 cm (6.72 inch) Resolution 2408', '6500 mAh Battery', ' 2G GSM: 850 MHz/900 MHz/1800 MHz, 3G WCDMA: B1/B5', ' Network Type 5G, 4G, 3G, 2G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n393 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Gyroscope, Infrared (IR) Blaster, Side Mounted Fingerprint Sensor\r\nOther Features\r\nIngress Protection Rating: IP64, UFS 3.1 ROM, Expandable RAM Capacity: 6GB, 44W Charging Power, Back Cover Material: Plastic Composite Sheet, Supports Voice Recording\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(105, 'PRD96373', '', '128 GB', '', 'Primary Camera Available Yes Primary Camera 50MP +', '', '', '', '', '', ''),
(106, 'PRD58265', '', '', '', '', '', '', '', '', '', ''),
(107, 'PRD60176', ' 8 GB RAM |128 GB ROM', '128 GB', ' Operating System Android 15 Processor Brand Media', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 17.12 cm (6.74 inch) Resolution 1600', ' Battery Capacity 5500 mAh Battery Type Lithium Io', ' Funtouch OS 15 (Based on Android 15)', ' Network Type 5G, 4G, 3G, 2G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n393 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Gyroscope, Infrared (IR) Blaster, Side Mounted Fingerprint Sensor\r\nOther Features\r\nIngress Protection Rating: IP64, UFS 3.1 ROM, Expandable RAM Capacity: 6GB, 44W Charging Power, Back Cover Material: Plastic Composite Sheet, Supports Voice Recording\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(108, 'PRD75124', '', '', '', '', '', '6500 mAh Battery', '', '', '', ''),
(109, 'PRD78659', ' 8 GB RAM | 128 GB ROM', '128 GB', ' Operating System Android 15 Processor Brand Media', 'Primary Camera Available Yes Primary Camera 50MP +', ' Display Size 17.07 cm (6.72 inch) Resolution 2408', ' Display Size 17.07 cm (6.72 inch) Resolution 2408', ' 2G GSM: 850 MHz/900 MHz/1800 MHz, 3G WCDMA: B1/B5', ' Network Type 5G, 4G, 3G, 2G', 'Smartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n393 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Gyroscope, Infrared (IR) Blaster, Side Mounted Fingerprint Sensor\r\nOther Features\r\nIngress Protection Rating: IP64, UFS 3.1 ROM, Expandable RAM Capacity: 6GB, 44W Charging Power, Back Cover Material: Plastic Composite Sheet, Supports Voice Recording\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(110, 'PRD53458', ' 6 GB RAM | 128 GB ROM', '128 GB', ' Operating System Android 15 Processor Brand Media', 'Primary Camera Available Yes Primary Camera 50MP +', ' Display Size 17.07 cm (6.72 inch) Resolution 2408', ' Display Size 17.07 cm (6.72 inch) Resolution 2408', ' 2G GSM: 850 MHz/900 MHz/1800 MHz, 3G WCDMA: B1/B5', ' Network Type 5G, 4G, 3G, 2G', 'Smartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n393 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Gyroscope, Infrared (IR) Blaster, Side Mounted Fingerprint Sensor\r\nOther Features\r\nIngress Protection Rating: IP64, UFS 3.1 ROM, Expandable RAM Capacity: 6GB, 44W Charging Power, Back Cover Material: Plastic Composite Sheet, Supports Voice Recording\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(111, 'PRD42624', '4 GB RAM | 64 GB ROM | Expandable Upto 2 TB', 'Memory & Storage Features Internal Storage 64 GB R', ' Operating System Android 14 Processor Brand Media', ' Primary Camera Available Yes Primary Camera 8MP R', ' Display Size 16.94 cm (6.67 inch) Resolution 1604', '5100 mAh Battery Lithium Ion Polymer', ' 2G GSM: 900 MHz/1800 MHz, 3G WCDMA: B1/B8, 4G FDD', 'e 5G, 4G, 3G, 2G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nColorOS 14.0.1 (Based on Android 14)\r\nSMS\r\nYes\r\nGraphics PPI\r\n264 PPI\r\nSensors\r\nGeomagnetic Sensor, Ambient Light Sensor, Proximity Sensor, Accelerometer, Gravity Sensor, Pedometer, Side Mounted Fingerprint Sensor\r\nRingtones Format\r\nOGG, MP3\r\nGPS Type\r\nBEIDOU, GPS, GLONASS, GALILEO, QZSS\r\n\r\n', ''),
(112, 'PRD43861', '8 GB RAM | 128 GB ROM', ' Internal Storage 128 GB RAM 8 GB', 'Operating System Android 15 Processor Brand Mediat', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 16.94 cm (6.67 inch) Resolution 1604', ' Battery Capacity 5800 mAh', ' 2 GHz Operating Frequency 2G GSM: 900 MHz/1800 MH', ' Network Type 5G, 4G, 3G, 2G Supported Networks 5G', '\r\nSmartphone\r\nYes\r\nSIM Size\r\nNano SIm\r\nUser Interface\r\nColorOS 15.0 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n264 PPI\r\nSensors\r\nGeomagnetic Sensor, Proximity Sensor, Light Sensor, Acceleration Sensor, Gravity Sensor\r\nOther Features\r\nUFS 2.2 ROM, 45W SUPERVOOC 2.0, SUPERVOOC, VOOC 3.0, PD Fast Charging Protocols, Biometrics: Fingerprint, Facial Recognition\r\nGPS Type\r\nBEIDOU, GPS, GLONASS, GALILEO, QZSS, AGPS, WLAN Positioning, Cellular Network Positioning\r\nBattery & Power Features\r\n', ''),
(113, 'PRD38193', '8 GB RAM | 256 GB ROM', ' Internal Storage 256 GB RAM 8 GB', 'Operating System Android 15 Processor Brand Mediat', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 16.94 cm (6.67 inch) Resolution 1604', ' Battery Capacity 5800 mAh', ' 2 GHz Operating Frequency 2G GSM: 900 MHz/1800 MH', ' Network Type 5G, 4G, 3G, 2G Supported Networks 5G', '\r\nSmartphone\r\nYes\r\nSIM Size\r\nNano SIm\r\nUser Interface\r\nColorOS 15.0 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n264 PPI\r\nSensors\r\nGeomagnetic Sensor, Proximity Sensor, Light Sensor, Acceleration Sensor, Gravity Sensor\r\nOther Features\r\nUFS 2.2 ROM, 45W SUPERVOOC 2.0, SUPERVOOC, VOOC 3.0, PD Fast Charging Protocols, Biometrics: Fingerprint, Facial Recognition\r\nGPS Type\r\nBEIDOU, GPS, GLONASS, GALILEO, QZSS, AGPS, WLAN Positioning, Cellular Network Positioning\r\nBattery & Power Features\r\n', ''),
(114, 'PRD89386', '8 GB', '128 GB', 'Qualcomm Snapdragon 655 octa core', '16MP AI front camera 16.5', '6.5-inch', ' 5000mAH ', 'Android', 'Dual SIM (nano+nano) dual-standby (4G+4G)', 'Reverse charging supported Box also includes: Type-c cable, headset, SIM tray ejecter, pre-applied screen protector and protective case, booklet with warranty card and quick guide', 'Mobiles'),
(115, 'PRD14660', '6 GB', '64 GB', '', '', '', '', '', '', ' Expandable Upto 512 GB', 'Mobiles'),
(116, 'PRD35639', '4 GB', '', ' AMD PROCESSOR', '', '', '', '', '', 'HDD: 500GB', 'Computers'),
(117, 'PRD67420', ' 8 GB RAM | 256 GB ROM', ' Internal Storage 256 GB RAM 8 GB', 'Os & Processor Features Operating System Android 1', ' Primary Camera Available Yes Primary Camera 50MP ', 'Display Features Display Size 17.02 cm (6.7 inch) ', '6000 mAh Battery', ' Screen-to-Body Ratio: 93.5%, Refresh Rate: 60Hz/1', ' Network Type 5G', 'Other Details\r\nSmartphone\r\nYes\r\nUser Interface\r\nColorOS 15.0 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n394 PPI\r\nSeries\r\nF Series\r\n', ''),
(118, 'PRD52987', ' 12 GB RAM | 256 GB ROM', ' Internal Storage 256 GB RAM 12GB', 'Os & Processor Features Operating System Android 1', ' Primary Camera Available Yes Primary Camera 50MP ', 'Display Features Display Size 17.02 cm (6.7 inch) ', '6000 mAh Battery', ' Screen-to-Body Ratio: 93.5%, Refresh Rate: 60Hz/1', ' Network Type 5G', 'Other Details\r\nSmartphone\r\nYes\r\nUser Interface\r\nColorOS 15.0 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n394 PPI\r\nSeries\r\nF Series\r\n', ''),
(119, 'PRD23843', ' 8 GB RAM | 128 GB ROM', ' Internal Storage 128GB RAM 8 GB', 'Os & Processor Features Operating System Android 1', ' Primary Camera Available Yes Primary Camera 50MP ', 'Display Features Display Size 17.02 cm (6.7 inch) ', '6000 mAh Battery', ' Screen-to-Body Ratio: 93.5%, Refresh Rate: 60Hz/1', ' Network Type 5G', 'Other Details\r\nSmartphone\r\nYes\r\nUser Interface\r\nColorOS 15.0 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n394 PPI\r\nSeries\r\nF Series\r\n', ''),
(120, 'PRD25478', ' 8 GB RAM | 256 GB ROM', ' Internal Storage 256 GB RAM 8 GB', 'Os & Processor Features Operating System Android 1', ' Primary Camera Available Yes Primary Camera 50MP ', 'Display Features Display Size 17.02 cm (6.7 inch) ', '6000 mAh Battery', ' Screen-to-Body Ratio: 93.5%, Refresh Rate: 60Hz/1', ' Network Type 5G', 'Other Details\r\nSmartphone\r\nYes\r\nUser Interface\r\nColorOS 15.0 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n394 PPI\r\nSeries\r\nF Series\r\n', ''),
(121, 'PRD84165', ' 8 GB RAM | 256 GB ROM', ' Internal Storage 256 GB RAM 8 GB', 'Os & Processor Features Operating System Android 1', ' Primary Camera Available Yes Primary Camera 50MP ', 'Display Features Display Size 17.02 cm (6.7 inch) ', '6000 mAh Battery', ' Screen-to-Body Ratio: 93.5%, Refresh Rate: 60Hz/1', ' Network Type 5G', 'Other Details\r\nSmartphone\r\nYes\r\nUser Interface\r\nColorOS 15.0 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n394 PPI\r\nSeries\r\nF Series\r\n', ''),
(122, 'PRD93747', '8 GB RAM | 128 GB ROM', ' 128 GB ROM', 'Operating System Android 15 Processor Brand Mediat', 'Primary Camera Available Yes Primary Camera 50MP +', ' Display Size 16.74 cm (6.59 inch) Resolution 2760', '5600 mAh Battery', ' 2G GSM: 850 MHz/900 MHz/1800 MHz/1900 MHz, 3G WCD', 'Primary Camera Available Yes Primary Camera 50MP +', 'Other Details\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nColorOS 15.0 (Based on Android 15)\r\nMMS\r\nYes\r\nSMS\r\nYes\r\nGraphics PPI\r\n460 PPI\r\nSensors\r\nProximity Sensor, Ambient Light Sensor, Color Temperature Sensor, E-Compass, Accelerometer, Gyroscope, In-Display Optical Fingerprint Sensor, Infrared Remote Control\r\nGames\r\nSupports\r\nSeries\r\nReno Series\r\nRingtones Format\r\nMP3, AAC, AMR, APE, OGG, FLAC, WAV, MIDI, WMA\r\nGPS Type\r\nBEIDOU, GPS, GLONASS, GALILEO, QZSS\r\n', ''),
(123, 'PRD99362', '8 GB RAM | 256 GB ROM', '256 GB ROM', 'Operating System Android 15 Processor Brand Mediat', 'Primary Camera Available Yes Primary Camera 50MP +', ' Display Size 16.74 cm (6.59 inch) Resolution 2760', '5600 mAh Battery', ' 2G GSM: 850 MHz/900 MHz/1800 MHz/1900 MHz, 3G WCD', 'Primary Camera Available Yes Primary Camera 50MP +', 'Other Details\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nColorOS 15.0 (Based on Android 15)\r\nMMS\r\nYes\r\nSMS\r\nYes\r\nGraphics PPI\r\n460 PPI\r\nSensors\r\nProximity Sensor, Ambient Light Sensor, Color Temperature Sensor, E-Compass, Accelerometer, Gyroscope, In-Display Optical Fingerprint Sensor, Infrared Remote Control\r\nGames\r\nSupports\r\nSeries\r\nReno Series\r\nRingtones Format\r\nMP3, AAC, AMR, APE, OGG, FLAC, WAV, MIDI, WMA\r\nGPS Type\r\nBEIDOU, GPS, GLONASS, GALILEO, QZSS\r\n', ''),
(124, 'PRD26749', ' 8 GB RAM | 256 GB ROM', '256 GB ROM', 'Os & Processor Features Operating System Android 1', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 16.94 cm (6.67 inch) Resolution 2400', ' Battery Capacity 5000 mAh', ' 2G GSM: 850 MHz/900 MHz/1800 MHz, 3G WCDMA: B1/B5', ' 5G, 4G, 3G, 2G Supported Networks 5G, 4G LTE, WCD', 'martphone\nYes\nSIM Size\nNano Sim\nUser Interface\nFuntouch OS 14 (Based on Android 14)\nSMS\nYes\nSIM Access\nDual Sim Dual Standby\nSensors\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, In-Display Fingerprint Sensor, Gyroscope\nOther Features\n80W Fast Charging, UFS 2.2 ROM, IP Rating: IP64, Material: Plastic Composite Sheet\nGPS Type\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, NAVIC, GNSS\n', ''),
(125, 'PRD16045', ' 8 GB', ' Internal Storage 128 GB RAM 8 GB', ' Operating System Android 14 Processor Brand Snapd', ' Primary Camera Available Yes Primary Camera 50MP ', 'Display Features Display Size 17.22 cm (6.78 inch)', ' Battery Capacity 5000 mAh', ' 2G GSM: 850 MHz/900 MHz/1800 MHz/1900 MHz, 3G WCD', ' 2G, 3G, 4G, 5G Supported Networks 4G LTE, 5G, GSM', '\r\nSmartphone\r\nYes\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, In-Display Fingerprint Sensor, Gyroscope\r\nOther Features\r\n44W Fast Charging, IP Rating: IP54, Material: Glass\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, NAVIC\r\n', ''),
(126, 'PRD31243', ' 8 GB', ' Internal Storage 128 GB RAM 8 GB', ' Operating System Android 14 Processor Brand Snapd', ' Primary Camera Available Yes Primary Camera 50MP ', 'Display Features Display Size 17.22 cm (6.78 inch)', ' Battery Capacity 5000 mAh', ' 2G GSM: 850 MHz/900 MHz/1800 MHz/1900 MHz, 3G WCD', ' 2G, 3G, 4G, 5G Supported Networks 4G LTE, 5G, GSM', '\r\nSmartphone\r\nYes\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, In-Display Fingerprint Sensor, Gyroscope\r\nOther Features\r\n44W Fast Charging, IP Rating: IP54, Material: Glass\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, NAVIC\r\n', ''),
(127, 'PRD54776', ' 8 GB', ' Internal Storage 128 GB RAM 8 GB', ' Operating System Android 14 Processor Brand Snapd', ' Primary Camera Available Yes Primary Camera 50MP ', 'Display Features Display Size 17.22 cm (6.78 inch)', ' Battery Capacity 5000 mAh', ' 2G GSM: 850 MHz/900 MHz/1800 MHz/1900 MHz, 3G WCD', ' 2G, 3G, 4G, 5G Supported Networks 4G LTE, 5G, GSM', '\r\nSmartphone\r\nYes\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 14 (Based on Android 14)\r\nSMS\r\nYes\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, In-Display Fingerprint Sensor, Gyroscope\r\nOther Features\r\n44W Fast Charging, IP Rating: IP54, Material: Glass\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, NAVIC\r\n', '');
INSERT INTO `oneclick_mobile_features` (`feature_id`, `prod_id`, `memory`, `storage`, `processor`, `camera`, `display`, `battery`, `os`, `network`, `others`, `productType`) VALUES
(128, 'PRD51267', ' 12 GB', ' 512 GB', ' Operating System Android 15 Processor Brand Snapd', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 17.2 cm (6.77 inch) Resolution 2392 ', 'attery Capacity 6000 mAh Battery Type Lithium Ion', ' 2G GSM: 850 MHz/900 MHz/1800 MHz, 3G WCDMA: B1/B4', 'tures Network Type 5G, 4G, 3G, 2G Supported Networ', '\nSmartphone\nYes\nTouchscreen Type\nCapacitive\nSIM Size\nNano Sim\nUser Interface\nFuntouch OS 15 (Based on Android 15)\nSMS\nYes\nGraphics PPI\n387 PPI\nSIM Access\nDual Sim Dual Standby\nSensors\nAccelerometer, Ambient Light Sensor, E-Compass, Proximity Sensor, Gyroscope, In-display Optical Fingerprint Sensor\nOther Features\nIngress Protection Rating: IP68 and IP69, UFS 2.2 RAM, 90W Charging Power, Back Cover Material: Glass, Supported Voice Recording\nGPS Type\nGPS, BEIDOU, GLONASS, GALILEO, QZSS, NAVIC', ''),
(129, 'PRD50725', ' 8 GB', ' 256 GB', ' Operating System Android 15 Processor Brand Media', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 17.2 cm (6.77 inch) Resolution 2392 ', ' Battery Capacity 5600 mAh Battery Type Lithium Io', ' 2G GSM: 850 MHz/900 MHz/1800 MHz, 3G WCDMA: B1/B4', '5G, 4G VOLTE, 4G, 3G, 2G Supported Networks 5G, 4G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n387 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, Gyroscope, In Display Optical Fingerprint Sensor, Conventional Motor\r\nOther Features\r\nIP (Ingress Protection) Rating: IP68, IP69, Rear Fill Light Supported, Dual RAM Channel, UFS 2.2 ROM, Expandable RAM Capacity: 8GB, Battery Cycle Count (at Room Temperature) - 1000 Times, Maximum Wired Charging Power - 90W, Reverse Charging Supported, Gesture Recognition, Eye Protection Mode, Notes, Calculator, Local Video Editing, Recorder, Screen Recording, Vivo Cloud Supported\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(130, 'PRD95623', ' 8 GB', ' 128 GB', ' Operating System Android 15 Processor Brand Media', ' Primary Camera Available Yes Primary Camera 50MP ', ' Display Size 17.2 cm (6.77 inch) Resolution 2392 ', ' Battery Capacity 5600 mAh Battery Type Lithium Io', ' 2G GSM: 850 MHz/900 MHz/1800 MHz, 3G WCDMA: B1/B4', '5G, 4G VOLTE, 4G, 3G, 2G Supported Networks 5G, 4G', '\r\nSmartphone\r\nYes\r\nTouchscreen Type\r\nCapacitive\r\nSIM Size\r\nNano Sim\r\nUser Interface\r\nFuntouch OS 15 (Based on Android 15)\r\nSMS\r\nYes\r\nGraphics PPI\r\n387 PPI\r\nSIM Access\r\nDual Sim Dual Standby\r\nSensors\r\nAccelerometer, Ambient Light Sensor, Proximity Sensor, E-Compass, Gyroscope, In Display Optical Fingerprint Sensor, Conventional Motor\r\nOther Features\r\nIP (Ingress Protection) Rating: IP68, IP69, Rear Fill Light Supported, Dual RAM Channel, UFS 2.2 ROM, Expandable RAM Capacity: 8GB, Battery Cycle Count (at Room Temperature) - 1000 Times, Maximum Wired Charging Power - 90W, Reverse Charging Supported, Gesture Recognition, Eye Protection Mode, Notes, Calculator, Local Video Editing, Recorder, Screen Recording, Vivo Cloud Supported\r\nGPS Type\r\nGPS, BEIDOU, GLONASS, GALILEO, QZSS\r\n', ''),
(131, 'PRD41380', '', '', '', '', '', '', '', '', '', ''),
(132, 'PRD59837', '', '', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_notifications`
--

CREATE TABLE `oneclick_notifications` (
  `id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_notifications`
--

INSERT INTO `oneclick_notifications` (`id`, `type`, `message`, `is_read`, `created_at`) VALUES
(7, 'contacted users', 'User Karthick A contacted via email: karthick.123@gmail.com with subject: I need your help', 1, '2024-11-16 10:56:23'),
(8, 'order', 'New order placed by user usr000020. Order ID: ORD81190049, Total Amount: ?1.00', 1, '2024-11-19 05:23:04'),
(9, 'order', 'New order placed by user usr000012. Order ID: ORD13492424, Total Amount: ?5.00', 1, '2024-11-23 08:01:42'),
(10, 'order', 'New order placed by user usr000020. Order ID: ORD59245122, Total Amount: Rs.10999.00', 1, '2024-12-07 11:34:30'),
(11, 'New user', 'New user AJIL has signed up.', 1, '2024-12-14 15:36:15'),
(12, 'order', 'New order placed by user usr000021. Order ID: ORD18683185, Total Amount: Rs.23499.00', 1, '2024-12-14 15:38:40'),
(13, 'order', 'New order placed by user usr000021. Order ID: ORD26760378, Total Amount: Rs.23499.00', 1, '2024-12-16 11:33:22'),
(14, 'New user', 'New user ajin has signed up.', 1, '2024-12-26 14:45:36'),
(15, 'New user', 'New user John has signed up.', 1, '2024-12-30 05:57:38'),
(16, 'New user', 'New user Tressa has signed up.', 1, '2024-12-30 05:58:46'),
(17, 'New user', 'New user sara has signed up.', 1, '2024-12-30 06:00:06'),
(18, 'order', 'New order placed by user usr000025. Order ID: ORD78264429, Total Amount: Rs.95049.00', 1, '2024-12-30 06:02:32'),
(19, 'order', 'New order placed by user usr000025. Order ID: ORD40664301, Total Amount: Rs.27999.00', 1, '2024-12-30 06:14:48'),
(20, 'order', 'New order placed by user usr000025. Order ID: ORD70286606, Total Amount: Rs.66049.00', 1, '2024-12-30 06:16:30'),
(21, 'order', 'New order placed by user usr000021. Order ID: ORD80057781, Total Amount: Rs.95049.00', 1, '2024-12-30 14:26:10'),
(22, 'order', 'New order placed by user usr000021. Order ID: ORD28583529, Total Amount: Rs.23999.00', 1, '2024-12-30 14:30:43'),
(23, 'order', 'New order placed by user usr000025. Order ID: ORD28122232, Total Amount: Rs.98049.00', 1, '2024-12-31 06:30:08'),
(24, 'order', 'New order placed by user usr000025. Order ID: ORD51916343, Total Amount: Rs.94049.00', 1, '2024-12-31 08:24:56'),
(25, 'order', 'New order placed by user usr000018. Order ID: ORD45652339, Total Amount: Rs.25999.00', 1, '2025-01-06 05:28:50'),
(26, 'New user', 'New user Mareeswaran has signed up.', 1, '2025-01-06 05:32:46'),
(27, 'order', 'New order placed by user usr000026. Order ID: ORD31462623, Total Amount: Rs.23999.00', 1, '2025-01-06 06:15:17'),
(28, 'order', 'New order placed by user usr000026. Order ID: ORD71174550, Total Amount: Rs.499.00', 1, '2025-01-06 06:24:17'),
(29, 'order', 'New order placed by user usr000026. Order ID: ORD12214126, Total Amount: Rs.23999.00', 1, '2025-01-06 06:40:35'),
(30, 'order', 'New order placed by user usr000026. Order ID: ORD38125459, Total Amount: Rs.25999.00', 1, '2025-01-06 06:41:46'),
(31, 'order', 'New order placed by user usr000020. Order ID: ORD81694453, Total Amount: Rs.499.00', 1, '2025-01-06 07:26:27'),
(32, 'New user', 'New user Sura has signed up.', 1, '2025-01-22 05:27:10'),
(33, 'New user', 'New user vj has signed up.', 1, '2025-01-22 05:28:13'),
(34, 'New user', 'New user dhdfhfgd has signed up.', 1, '2025-01-22 06:12:29'),
(35, 'order', 'New order placed by user usr000028. Order ID: ORD33197743, Total Amount: Rs.25999.00', 1, '2025-01-22 06:27:09'),
(36, 'New user', 'New user Surasdfgds has signed up.', 1, '2025-01-22 06:40:32'),
(37, 'New user', 'New user Rinu has signed up.', 1, '2025-01-22 06:50:17'),
(38, 'New user', 'New user jeni has signed up.', 1, '2025-01-22 07:50:02'),
(39, 'New user', 'New user guru has signed up.', 1, '2025-01-22 07:52:27'),
(40, 'New user', 'New user ufhch has signed up.', 1, '2025-01-22 08:03:34'),
(41, 'New user', 'New user hcch has signed up.', 1, '2025-01-22 08:06:03'),
(42, 'New user', 'New user hchhv has signed up.', 1, '2025-01-22 08:13:42'),
(43, 'New user', 'New user rinu has signed up.', 1, '2025-01-22 08:16:31'),
(44, 'New user', 'New user rj has signed up.', 1, '2025-01-22 08:21:12'),
(45, 'New user', 'New user ss has signed up.', 1, '2025-01-22 08:38:33'),
(46, 'New user', 'New user sj has signed up.', 1, '2025-01-22 08:42:28'),
(47, 'New user', 'New user priya has signed up.', 1, '2025-01-22 08:53:37'),
(48, 'order', 'New order placed by user usr000041. Order ID: ORD19098714, Total Amount: Rs.25999.00', 1, '2025-01-23 06:41:32'),
(49, 'New user', 'New user Guru has signed up.', 1, '2025-01-24 04:26:37'),
(50, 'New user', 'New user rrj has signed up.', 1, '2025-01-24 09:00:09'),
(51, 'order', 'New order placed by user usr000043. Order ID: ORD28944419, Total Amount: Rs.16998.00', 1, '2025-01-27 05:56:53'),
(52, 'order', 'New order placed by user usr000043. Order ID: ORD60832715, Total Amount: Rs.130098.00', 1, '2025-01-27 10:17:18'),
(53, 'New user', 'New user Rinu rai has signed up.', 1, '2025-02-01 09:48:31'),
(54, 'New user', 'New user test has signed up.', 1, '2025-02-06 09:08:23'),
(55, 'contacted users', 'User test tests contacted via email: muthu@mail.com with subject: Fill out the form with any query on your mind, and we\'ll get back to you as soon as possible.', 1, '2025-02-07 11:23:58'),
(56, 'New user', 'New user issac has signed up.', 1, '2025-02-17 06:04:58'),
(57, 'New user', 'New user testing has signed up.', 1, '2025-02-19 06:13:13'),
(58, 'New user', 'New user Rinu rr has signed up.', 1, '2025-03-07 07:28:08'),
(59, 'New user', 'New user shamini has signed up.', 1, '2025-03-18 10:42:41'),
(60, 'New user', 'New user Athreya has signed up.', 1, '2025-03-29 06:00:38'),
(61, 'contacted users', 'User Gary Charles contacted via email: garycharles@dominatingkeywords.com with subject: Dominating Keywords', 1, '2025-04-21 17:49:13'),
(62, 'New user', 'New user Athreya has signed up.', 0, '2025-05-20 06:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_offerspage`
--

CREATE TABLE `oneclick_offerspage` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `offer` varchar(100) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `brand_name` varchar(30) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_offerspage`
--

INSERT INTO `oneclick_offerspage` (`id`, `title`, `description`, `offer`, `category`, `brand_name`, `image`) VALUES
(9, 'medium', '', NULL, 'computers', 'LENOVO', 'medium_1751379272131.jpg'),
(14, 'medium', '', NULL, 'mobiles', 'OPPO', 'medium_1751378143101.jpg'),
(16, 'medium', '', NULL, 'mobiles', 'REALME', 'medium_1751377677057.jpg'),
(21, 'medium', '', '', 'mobiles', 'iPhone', 'JJJJ_1728917909550.jpg'),
(23, 'medium', '', 'undefined', 'mobiles', 'SAMSUNG', 'SAMSUNG_1728918362152.jpg'),
(39, 'medium', '', NULL, 'mobiles', 'ONE PLUS', 'medium_1751377577538.jpg'),
(44, 'medium', '', NULL, 'mobiles', 'VIVO ', 'medium_1751377492175.jpg'),
(56, 'medium', '', NULL, 'cctv', 'DLINK', 'medium_1751381366975.jpg'),
(63, 'medium', '', NULL, 'cctv', 'CP PLUS', 'medium_1751381211895.jpeg'),
(65, 'medium', '', NULL, 'cctv', 'HIKVISION', 'medium_1751381085283.jpg'),
(68, 'product_banner', '', NULL, '', 'VIVO', '4882860.jpg'),
(83, 'banner', '', '', 'cctv', 'OPPO', 'banner_10242051.jpg'),
(88, 'banner', '', NULL, 'mobiles', 'VIVO', 'banner_1751380899001.jpg'),
(89, 'banner', '', NULL, 'mobiles', 'CCTV', 'banner_1751378826632.jpg'),
(91, 'banner', '', NULL, 'cctv', 'HIKVISION', 'banner_1751430167427.jpg'),
(96, 'medium', '', NULL, 'computers', 'DELL', 'medium_1751379255911.jpg'),
(99, 'medium', '', NULL, 'computers', 'hp', 'medium_1751379231348.jpg'),
(110, 'medium', '', '', 'computers', 'ACER', 'medium_1751379431472_Acer-Mall-Exclusive-Showroom-in.jpg'),
(111, 'medium', '', '', 'computers', 'ASUS', 'medium_1751379518200_exclusive-store-min.jpg'),
(112, 'medium', '', '', 'computers', 'APPLE', 'medium_1751379633471_Apple-Reading-2023-The-Apple-Pos.jpg'),
(113, 'banner', '', NULL, 'computers', 'DESKTOP', 'banner_1751380711142.jpg'),
(114, 'banner', '', '', 'cctv', 'DLINK', 'banner_1751381506936_banner_dlink-cctv-manama-bahrain.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_orders`
--

CREATE TABLE `oneclick_orders` (
  `order_id` int(11) NOT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(255) DEFAULT 'Pending',
  `unique_id` varchar(12) DEFAULT NULL,
  `delivery_status` varchar(20) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `payment_method` varchar(100) NOT NULL,
  `invoice` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_order_items`
--

CREATE TABLE `oneclick_order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` varchar(20) NOT NULL,
  `product_id` varchar(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_buy_together` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_products`
--

CREATE TABLE `oneclick_products` (
  `product_id` varchar(10) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_product_category`
--

CREATE TABLE `oneclick_product_category` (
  `id` int(11) NOT NULL,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text DEFAULT NULL,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` enum('available','unavailable') DEFAULT 'available',
  `category` varchar(255) NOT NULL,
  `prod_id` varchar(10) DEFAULT NULL,
  `actual_price` decimal(10,2) DEFAULT NULL,
  `offer_label` varchar(20) DEFAULT NULL,
  `coupon` varchar(30) DEFAULT NULL,
  `coupon_expiry_date` date DEFAULT NULL,
  `subtitle` varchar(255) NOT NULL,
  `deliverycharge` varchar(20) NOT NULL,
  `effectiveprice` decimal(10,0) NOT NULL,
  `offer_start_time` text DEFAULT NULL,
  `offer_end_time` text DEFAULT NULL,
  `offer_price` decimal(10,2) NOT NULL,
  `additional_accessories` varchar(255) NOT NULL,
  `productStatus` varchar(255) DEFAULT 'approved'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_product_category`
--

INSERT INTO `oneclick_product_category` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`, `actual_price`, `offer_label`, `coupon`, `coupon_expiry_date`, `subtitle`, `deliverycharge`, `effectiveprice`, `offer_start_time`, `offer_end_time`, `offer_price`, `additional_accessories`, `productStatus`) VALUES
(307, 'HP K300 Wired USB Standard Gaming Keyboard ', 'The HP K300 wired gaming keyboard features rainbow backlight. The multicoloured backlit keyboard is easy to work on and looks impressive in the dark. With a stepped-key layout, this keyboard is comfortable to type on. It also features a foldable tripod design that helps adjust the height of the keyboard.', 1199.00, '[\"-original-imagn3f9exwfnptb.jpg\",\"Untitled_design_75.jpg\",\"717S1HGYYWL_SY355.jpg\"]', 'available', 'ComputerAccessories', 'PRD28657', 1799.00, 'GAMING', NULL, NULL, 'Compatible with Desktop, Laptop, Mac Easy to Use,Plug and Play,Quick, Comfy Durable body  (Black)', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(308, 'HyperX Pulsefire Haste USB Ultra Lightweight, 59g, Hex Design, Honeycomb Shell, Hyperflex Cable, Up to 16000 DPI, 6 Programmable Buttons Gaming Mouse', 'Brand	HyperX\r\nColour	Black\r\nConnectivity Technology	USB\r\nSpecial Feature	Lightweight,Dustproof,Flexible\r\nMovement Detection Technology	Optical', 4299.00, '[\"voCiDuvUKvvLRhiTJqyRQX.jpg\",\"HyperX-Pulsefire-Haste-Wired-Gam.jpg\",\"hyperx_pulsefire_haste_1_top_dow.jpg\"]', 'available', 'ComputerAccessories', 'PRD93549', 7999.00, 'GAMING', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(309, 'HP S500 7YA11PA USB, Wireless Optical Mouse, Black', 'Model Name\r\nS500\r\nSystem Requirements\r\nWINDOWS 7 AND ABOVE\r\nForm Factor\r\nAmbidextrous\r\nSales Package\r\nMOUSE AND USB\r\nColor\r\nBlack\r\nPart Number\r\n7YA11PA#ACJ', 799.00, '[\"515SR5F2aIL_SX679_.jpg\",\"51afCoRcjVL_SX679.jpg\",\"51A1vwtYrL_SX679_.jpg\"]', 'available', 'ComputerAccessories', 'PRD70132', 899.00, 'MOUSE', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(310, 'VIVO Y29 5G [4+128 GB] DIAMOND BLACK', NULL, 13999.00, '[\"85f7bfef8795b4146fd9ee74e46b692c.png\"]', 'available', 'Mobiles', 'PRD51705', 17999.00, 'HOT OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(313, 'Logitech MK120 Wired USB Keyboard and Mouse ', 'Brand	Logitech\r\nColour	Black\r\nConnectivity Technology	Usb\r\nSpecial Feature	Wired, Optical', 1199.00, '[\"61t3S2DxXDL_SY879_.jpg\",\"612sJfNd9jL_SY879_.jpg\"]', 'available', 'ComputerAccessories', 'PRD62620', 1999.00, 'COMPO', NULL, NULL, 'Set for Windows, Optical Wired Mouse, Full-Size Keyboard, USB Plug-and-Play, Compatible for PC, Laptop - Black', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(314, 'Portronics Toad III Wireless Mouse with Bluetooth & 2.4 GHz Dual Connectivity, Rechargeable, 6 Buttons, Adjustable DPI, Silicon Grip & Ergonomic Design for PC, Laptop, Mac (Black)', 'Brand	?Portronics\r\nManufacturer	?Portronics Digital Pvt Ltd., Portronics Digital Pvt Ltd, Unit No. 1082-1090, 10th Floor, Block-B, Vegas, Dwarka, Sec-14, New Delhi-110075, 9555-245-245\r\nSeries	?Toad III\r\nColour	?Black\r\nItem Height	?40 Millimeters\r\nItem Width	?7 Centimeters\r\nProduct Dimensions	?11 x 7 x 4 cm; 80 g\r\nBatteries	?1 Lithium Polymer batteries required. (included)\r\nItem model number	?POR-1930\r\nPower Source	?Battery Powered\r\nHardware Platform	?Laptop, Personal Computer\r\nOperating System	?Windows 7\r\nAverage Battery Life (in hours)	?12 Months\r\nAre Batteries Included	?Yes\r\nLithium Battery Energy Content	?300 Milliamp Hours (mAh)\r\nManufacturer	?Portronics Digital Pvt Ltd.\r\nItem Weight	?80 g', 599.00, '[\"1_8ff27ea5-d6b0-4e3a-bca1-28750d.jpg\",\"71kntmhsLjL_SX679.jpg\",\"71AzcObEpQL_SX679.jpg\",\"6177w4gd-iL_SX679.jpg\"]', 'available', 'ComputerAccessories', 'PRD35175', 999.00, 'DUAL MODE', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(315, 'HP K260 Wireless Keyboard/Quick/Comfy/Accurate/Plug and Play/Led Indicators,Black', 'With its 800-1200-1600 DPI optical sensor, this mouse works on almost any surface with astounding accuracy\r\nComfort meets durability\r\n2.4GHz wireless connection\r\nLED indicators illuminate Number Lock, Caps Lock, and Scroll Lock', 1199.00, '[\"image_20250528T061654042Z.jpg\",\"61dFP11hXHL_SX679.jpg\",\"99y14aa_km260-1.jpg\"]', 'available', 'ComputerAccessories', 'PRD54350', 1699.00, 'WIRELESS', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(316, 'Dell KM3322W Wireless USB Keyboard and Mouse Combo', '\r\nBrand	?Dell\r\nManufacturer	?Dell, Dell\r\nColour	?Black\r\nItem Height	?25 Millimeters\r\nItem Width	?44.9 Centimeters\r\nProduct Dimensions	?12.3 x 44.9 x 2.5 cm; 497 g\r\nBatteries	?2 AA batteries required. (included)\r\nPower Source	?Battery Powered\r\nOperating System	?Linux, Windows Vista, Chrome OS, Windows 7, Raspberry Pi OS, Mac OS, Windows 2000, Windows 10\r\nAre Batteries Included	?Yes\r\nLithium Battery Energy Content	?2.6 Milliamp Hours (mAh)\r\nNumber of Lithium Ion Cells	?2\r\nManufacturer	?Dell\r\nCountry of Origin	?China\r\nItem Weight	?497 g', 1199.00, '[\"61nmukrEK9L_SX679.jpg\",\"611cbN48nbL_SX679.jpg\",\"56e3689f-bb38-4dbe-be6c-983c3a20.jpg\",\"8f582d03-6f1d-4a0c-bc13-e2d36110.jpg\",\"5b9d279b-68fd-46e3-af48-b783eb01.jpg\"]', 'available', 'ComputerAccessories', 'PRD90489', 2499.00, 'COMPO', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(317, 'Dell WM126 Wireless Mouse, 1000DPI, 2.4 Ghz with USB Nano Receiver, Optical Tracking, 12-Months Battery Life, Plug and Play', 'Device Type: Mouse\r\nWireless Receiver: USB Wireless Receiver\r\nRun Time: 12 Months\r\nConnectivity Technology: Wireless\r\nInterface: RF\r\nMovement Detection Technology: Optical\r\nMovement Resolution: 1000 Dpi', 799.00, '[\"image_20250528T064621236Z.jpg\",\"41v-pmRkaDL_SX679.jpg\",\"31LEgBI42aL_SX679_.jpg\",\"41utOc50UYL_SX679.jpg\"]', 'available', 'ComputerAccessories', 'PRD84954', 1499.00, 'WIRELESS MOUSE', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(318, 'VIVO Y19 5G (Titanium Silver, 128 GB)  (4 GB RAM)', NULL, 11499.00, '[\"image_20250528T062739034Z.jpeg\",\"71Zo3SaD9HL_SL1500_1-1745406659116.jpeg\"]', 'available', 'Mobiles', 'PRD86776', 14999.00, 'NEW OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(319, 'VIVO Y19 5G (Titanium Silver, 64 GB)  (4 GB RAM)', NULL, 10499.00, '[\"copy_PRD58012_image_20250528T062739034Z.jpeg\",\"copy_PRD58012_71Zo3SaD9HL_SL1500_1-1745406659116.jpeg\"]', 'available', 'Mobiles', 'PRD58012', 13999.00, 'NEW OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(320, 'Lenovo 300 Wired Keyboard and Mouse Combo, 1600 DPI Ambidextrous Mouse', 'Brand	Lenovo\r\nColour	Black\r\nConnectivity Technology	Usb\r\nSpecial Feature	Wired, Ergonomic, Optical, Ambidextrous\r\nCompatible Devices	Personal Computer, Laptop', 1199.00, '[\"51OPk5N6laL_SX679.jpg\"]', 'available', 'ComputerAccessories', 'PRD39403', 2299.00, 'COMPO', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(321, 'Enter Cursor Wired mouse', 'Mouse Type\r\nWired\r\nModel Name\r\nCursor\r\nCountry of Origin\r\nMade in India\r\n20\r\n100\r\n1\r\n100', 199.00, '[\"enter-wired-mouse-1000x1000.jpg\"]', 'available', 'ComputerAccessories', 'PRD41795', 299.00, 'LOW BUDGET', NULL, NULL, '', '50', 99, NULL, NULL, 0.00, '', 'approved'),
(322, 'VIVO Y29 5G [6+128 GB] DIAMOND BLACK', NULL, 15499.00, '[\"copy_PRD93299_85f7bfef8795b4146fd9ee74e46b692c.png\"]', 'available', 'Mobiles', 'PRD93299', 17999.00, 'HOT OFFER', NULL, NULL, '[6+128 GB] DIAMOND BLACK', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(325, 'KPS HEADPHONE', 'HI-FI SOUND EFFECT,CLEAR HUMAN VOICE-NOISE LSOLATION WITH PRECISE BAS..HANDS FREE IN-LINE MICROPHONE ', 199.00, '[\"imageskps.jpeg\"]', 'available', 'Headphones', 'PRD93636', 299.00, 'BEST OFFER', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(326, 'MI XIAOMI Dual Drive in-Ear Wired Earphones with Mic', '\r\nMI XIAOMI Dual Driver Dynamic Bass in-Ear Wired Noise Cancellation\r\nGood Sound Quality\r\nNoise Cancellation\r\n3.5mm Audio jackEarphones with Mic, 10mm& 8mm for Heavy Bass & Crystal Clear Vocals, Passive Noice Cancellation, Magnetic Earbuds with Braided Cable (Blue)', 449.00, '[\"20230907_150842-scaled-MI-HEADPHONE.jpg\"]', 'available', 'Headphones', 'PRD99353', 999.00, 'BEST OFFER', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'unapproved'),
(327, 'ROBOTEK HF-501 Earphones', ' Crystal Clear and HD Sound.With microphone', 99.00, '[\"imagesROBOTEK-2.jpeg\"]', 'available', 'Headphones', 'PRD35066', 199.00, 'HOT OFFER', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(328, 'Ultrapods Max Wireless 5.3', 'Ultrapods in-Ear Wireless Earbuds, Ultrapods max TWS Bluetooth Earphones with Charging Case and LED Digital Display, Microphone, Works with iPhone Android and Bluetooth Devices (Green)', 499.00, '[\"41MqWTG4dxL_AC_UF10001000_QL80_-ULTRA.jpg\"]', 'available', 'Headphones', 'PRD80413', 699.00, 'OFFER ZONE', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(329, 'Boult Wireless Gaming Ear Earbuds', 'Boult Audio UFO Truly Wireless in Ear Earbuds with 48H Playtime, Built-in App Support, 45ms Low Latency Gaming, 4 Mics ENC, Breathing LEDs, 13mm Bass Drivers Ear Buds TWS, Made in India', 1799.00, '[\"71g4CMwdYyL_AC_UF10001000_QL80_-BUOLD.jpg\"]', 'available', 'Headphones', 'PRD31272', 3499.00, 'OFFER ZONE', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(330, 'ANC Air Pods Pro 2nd Generation', 'Orientation Type: In Ear\r\nConnectivity: Bluetooth Version 5.3\r\nBattery Life: 30Hours\r\nFast Charging: Yes\r\nNoise Cancellation: Active Noise Cancellation', 499.00, '[\"airpods-pro-2-hero-select-202409_FMT_WHH.jpeg\"]', 'available', 'Headphones', 'PRD85911', 799.00, 'BEST OFFER', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(331, 'boAt Rockerz 235 Pro ', 'boAt Rockerz 235 Pro Wireless Bluetooth Neckband in Ear Earphone, Upto 20 hrs of Playtime, Beast Mode, Low Latency, IPX5 Water & Sweat Resistance, ENx Technology, Bluetooth v5.2(Active Black)\r\n1 Year Warranty from the Date of Purchase', 1299.00, '[\"R235Pro.png\"]', 'available', 'Headphones', 'PRD96943', 2499.00, 'HOT OFFER', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(332, 'boAt Rockerz 110 ', 'boAt Rockerz 110 Wireless Bluetooth Neckband in Ear Earphone, Upto 20 hrs of Playtime, Beast Mode, Low Latency, IPX5 Water & Sweat Resistance, ENx Technology, Bluetooth v5.2(Active Black)\r\n1 Year Warranty from the Date of Purchase', 1499.00, '[\"copy_PRD11414_R235Pro.png\"]', 'available', 'Headphones', 'PRD11414', 2499.00, 'HOT OFFER', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(333, 'boAt Rockerz 255 Pro +', 'boAt Rockerz 255 Pro+ Wireless Bluetooth Neckband in Ear Earphone,With dual pairing Upto 20 hrs of Playtime, Beast Mode, Low Latency, IPX5 Water & Sweat Resistance, ENx Technology, Bluetooth v5.2(Active Black)\r\n1 Year Warranty from the Date of Purchase', 1799.00, '[\"copy_PRD66030_R235Pro.png\"]', 'available', 'Headphones', 'PRD66030', 3999.00, 'HOT OFFER', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(334, 'Zebronics Zeb-1000HMVBoom Headphone', 'Compatible for PC\r\nAdjustable Headband\r\nSoft Cushioned Earcups\r\nAdjustable Mic\r\nVolume Control', 699.00, '[\"81ymhplfprl.jpg\"]', 'available', 'Headphones', 'PRD90935', 999.00, 'hot offer', NULL, NULL, '', '50', 0, NULL, NULL, 0.00, '', 'approved'),
(335, 'HP 15-fd0006TU Laptop – Silver (15.6? inch) 39.6 cm , intel core i3 13th gen , 8gb Ram , 512GB SSD', NULL, 41990.00, '[\"image_20250528T143020592Z.jpg\",\"71srZ-ysEiL_SL1500.jpg\",\"61HrRJDAlRL_SL1500_.jpg\"]', 'available', 'Computers', 'PRD30299', 54552.00, 'NEW', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(336, 'HP 15-fd0018TU Laptop, 13th Gen Intel Core i3, 15.6-inch (39.6 cm), FHD, 8GB DDR4, 512GB SSD, Intel UHD Graphics', NULL, 44000.00, '[\"image_20250530T063141238Z.png\",\"image_20250530T063245411Z.png\",\"image_20250530T063258865Z.png\",\"71fvKe6daUL_SL1500.jpg\"]', 'available', 'Computers', 'PRD81908', 54552.00, 'NEW', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(337, 'HP 15-fd0022TU Laptop , intel core i5 13th gen , 39.6 cm (15.6 inch) , 8gb DDR4 ram , 512GB SSD, windows 11', NULL, 55800.00, '[\"image_20250528T144616776Z.jpg\",\"image_20250530T063326318Z.png\",\"image_20250530T063344323Z.png\"]', 'available', 'Computers', 'PRD89454', 72780.00, 'NEW', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(338, 'HP 15-fd0466TU Laptop / Silver /13th Generation Intel Core i5 processor / Windows 11 Home Single Language / 15.6inch diagonal FHD display / Intel UHD Graphics / 8 GB DDR4-3200 MT/s RAM / 512 GB SSD / B61ZGPA', NULL, 54670.00, '[\"Screenshot-2025-05-04-at-62406-1.jpg\",\"Screenshot-2025-05-04-at-62416-1.jpg\",\"Screenshot-2025-05-04-at-62411-1.jpg\"]', 'available', 'Computers', 'PRD13672', 67204.00, '', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(339, 'HP 15-fd0467TU Laptop / Silver / 13th Generation Intel Core i5 processor / Windows 11 Home / 15.6inch diagonal FHD display / Intel Iris X? Graphics / 16 GB DDR4-3200 MT/s / RAM 512 GB SSD / B61ZHPA', NULL, 58999.00, '[\"image_20250528T145100234Z.jpg\",\"Screenshot-2025-05-04-at-62411-2.jpg\",\"Screenshot-2025-05-04-at-62416-2.jpg\",\"Screenshot-2025-05-04-at-62406-2.jpg\",\"Screenshot-2025-05-04-at-62314-2.jpg\"]', 'available', 'Computers', 'PRD89720', 72052.00, 'NEW', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(340, 'HP 15-fd0468TU Laptop / Silver / 13th Generation Intel Core i7 processor / Windows 11 Home / 15.6inch diagonal FHD display / Intel Iris X? Graphics / 16 GB DDR4-3200 MT/s RAM / 512 GB SSD / B61ZJPA', NULL, 69499.00, '[\"image_20250528T150217938Z.jpg\",\"Screenshot-2025-05-04-at-62335-2.jpg\",\"Screenshot-2025-05-04-at-62411-3.jpg\",\"Screenshot-2025-05-04-at-62314-3.jpg\"]', 'available', 'Computers', 'PRD99251', 81144.00, 'OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(347, 'vivo Y300 5G (Phantom Purple, 128 GB)  (8 GB RAM)', NULL, 20999.00, '[\"300.png\"]', 'available', 'Mobiles', 'PRD98140', 26999.00, 'NEW OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(348, 'vivo v50 5G (Starry Blue, 256 GB)  (8 GB RAM)', NULL, 36999.00, '[\"71lMNjd--V50.jpg\"]', 'available', 'Mobiles', 'PRD42120', 42999.00, 'OFFER ZONE', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(349, 'vivo T4 5G (Phantom Grey, 256 GB)  (8 GB RAM)', NULL, 23999.00, '[\"81aLTJJgOdL.jpg\"]', 'available', 'Mobiles', 'PRD23334', 27999.00, 'HOT OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(351, 'vivo Y400 Pro 5G (Nebula Purple, 256 GB)  (8 GB RAM)', NULL, 26899.00, '[\"vivo-y400-pro-5g-freestyle-white-256gb-8gb-ram-Front-Back-View.png\"]', 'available', 'Mobiles', 'PRD29483', 31999.00, 'HOT OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(352, 'vivo Y39 5G (Ocean Blue, 256 GB)  (8 GB RAM)', NULL, 18999.00, '[\"41zgqg51M9L_SY300_SX300_.jpg\"]', 'available', 'Mobiles', 'PRD40648', 23999.00, 'NEW OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(353, 'vivo T4x 5G (Pronto Purple, 256 GB)  (8 GB RAM)', NULL, 16999.00, '[\"Vivo-t4x-5g-pronto-purple-128gb-8gb-ram-Front-Back-View-Image.png\"]', 'available', 'Mobiles', 'PRD66248', 20999.00, 'OFFER ZONE', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(359, 'vivo T4x 5G (Pronto Purple, 128 GB)  (8 GB RAM)', NULL, 14999.00, '[\"Vivo-t4x-5g-pronto-purple-128gb-8gb-ram-Front-Back-View-Image.png\"]', 'available', 'Mobiles', 'PRD78659', 19499.00, 'HOT OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(360, 'vivo T4x 5G (Pronto Purple, 128 GB)  (6 GB RAM)', NULL, 13999.00, '[\"Vivo-t4x-5g-pronto-purple-128gb-8gb-ram-Front-Back-View-Image.png\"]', 'available', 'Mobiles', 'PRD53458', 19499.00, 'HOT OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(361, 'OPPO A3x 5G (Starry Purple, 64 GB)  (4 GB RAM)', NULL, 11499.00, '[\"81Txkozw2L.jpg\"]', 'available', 'Mobiles', 'PRD42624', 14999.00, 'OFFER ZONE', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(362, 'OPPO A5 Pro 5G (Mocha Brown, 128 GB)  (8 GB RAM)', NULL, 17999.00, '[\"71juxOXVdrL.jpg\"]', 'available', 'Mobiles', 'PRD43861', 21999.00, 'OFFER MELA', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'unapproved'),
(363, 'OPPO A5 Pro 5G (Mocha Brown, 256GB)  (8 GB RAM)', NULL, 19999.00, '[\"71juxOXVdrL.jpg\"]', 'available', 'Mobiles', 'PRD38193', 23999.00, 'OFFER MELA', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(364, 'OPPO A9 2020 (Space Purple, 8GB RAM, 128GB Storage)', '', 6999.00, '[\"image_20250625T115419005Z.jpg\",\"image_20250625T115426491Z.jpg\"]', 'available', 'secondhandproducts', 'PRD89386', 17999.00, '', NULL, NULL, ' 8GB + 128 GB', '', 0, NULL, NULL, 0.00, '', 'approved'),
(365, 'SAMSUNG GALAXY A50', '', 5499.00, '[\"image_20250625T115408945Z.jpg\"]', 'available', 'secondhandproducts', 'PRD14660', 14999.00, '', NULL, NULL, '', '', 0, NULL, NULL, 0.00, '', 'approved'),
(366, 'LENOVO E41-25', '', 6999.00, '[\"image_20250625T115324003Z.jpg\",\"image_20250625T115337229Z.jpg\"]', 'available', 'secondhandproducts', 'PRD35639', 12000.00, '', NULL, NULL, '', '', 0, NULL, NULL, 0.00, '', 'approved'),
(367, 'OPPO F29 Pro 5G (Marble White, 256 GB)  (8 GB RAM)', NULL, 29999.00, '[\"81LlPWpcBvL_SX569_.jpg\"]', 'available', 'Mobiles', 'PRD67420', 34999.00, 'OFFER MELA', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(368, 'OPPO F29 Pro 5G (Marble White, 256 GB)  (12 GB RAM)', NULL, 31999.00, '[\"81LlPWpcBvL_SX569_.jpg\"]', 'available', 'Mobiles', 'PRD52987', 36999.00, 'OFFER MELA', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(369, 'OPPO F29 Pro 5G (Marble White, 128GB)  (8 GB RAM)', NULL, 27999.00, '[\"81LlPWpcBvL_SX569_.jpg\"]', 'available', 'Mobiles', 'PRD23843', 34999.00, 'OFFER MELA', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(373, 'OPPO Reno13 5G (Blue, 128 GB)  (8 GB RAM)', NULL, 35999.00, '[\"blue.png\"]', 'available', 'Mobiles', 'PRD93747', 41999.00, 'NEW OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(374, 'OPPO Reno13 5G (Blue, 256 GB)  (8 GB RAM)', NULL, 37999.00, '[\"blue.png\"]', 'available', 'Mobiles', 'PRD99362', 44999.00, 'NEW OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(375, 'VIVO Y300 5G (Phantom Purple, 128 GB)  (8 GB RAM)', NULL, 22999.00, '[\"copy_PRD26749_300.png\"]', 'available', 'Mobiles', 'PRD26749', 25999.00, 'NEW OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(376, 'vivo Y300 Plus 5G (Silk Green, 128 GB)  (8 GB RAM)', NULL, 23999.00, '[\"61IfP8nZVzL.jpg\"]', 'available', 'Mobiles', 'PRD16045', 29999.00, 'OFFER MELA', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'unapproved'),
(380, 'vivo V50 5G (Starry Night, 512 GB)  (12 GB RAM)', NULL, 40999.00, '[\"copy_PRD51267_71lMNjd--V50.jpg\"]', 'available', 'Mobiles', 'PRD51267', 48999.00, 'OFFER ZONE', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'approved'),
(381, 'vivo V50e 5G (Sapphire Blue, 256 GB)  (8 GB RAM)', NULL, 30999.00, '[\"81u3ageWGIL_SL1500_.jpg\"]', 'available', 'Mobiles', 'PRD50725', 35999.00, 'HOT OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'unapproved'),
(382, 'vivo V50e 5G (Sapphire Blue, 128GB)  (8 GB RAM)', NULL, 28999.00, '[\"81u3ageWGIL_SL1500_.jpg\"]', 'available', 'Mobiles', 'PRD95623', 33999.00, 'HOT OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '', 'unapproved'),
(385, 'HP 15-fd0468TU Laptop / Silver / 13th Generation Intel Core i7 processor / Windows 11 Home / 15.6inch diagonal FHD display / Intel Iris X? Graphics / 16 GB DDR4-3200 MT/s RAM / 512 GB SSD / B61ZJPA', NULL, 69499.00, '[\"copy_PRD59837_image_20250528T150217938Z.jpg\",\"copy_PRD59837_Screenshot-2025-05-04-at-62335-2.jpg\",\"copy_PRD59837_Screenshot-2025-05-04-at-62411-3.jpg\",\"copy_PRD59837_Screenshot-2025-05-04-at-62314-3.jpg\"]', 'unavailable', 'Computers', 'PRD59837', 81144.00, 'OFFER', NULL, NULL, '', '100', 0, NULL, NULL, 0.00, '307', 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_product_images`
--

CREATE TABLE `oneclick_product_images` (
  `product_image_id` int(11) NOT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_product_images`
--

INSERT INTO `oneclick_product_images` (`product_image_id`, `product_id`, `image_url`) VALUES
(7, 'PRD12884', 'ad2_1728037668663.jpg'),
(8, 'PRD55033', 'speaker_1728016428536.jfif'),
(9, 'PRD65594', 'laptop_1727957392258.jpg'),
(10, 'PRD65594', 'computer_1727957411918.jpg'),
(11, 'PRD96952', 'about1_1728035050776.jpg'),
(12, 'PRD96952', 'cmp_1728035050900.jpg'),
(13, 'PRD12173', 'ad1_1728016848386.jpg'),
(14, 'PRD93602', 'computer_1728038693786.jpg'),
(15, 'PRD33038', 'images.,watch_1728016517605.jfif'),
(16, 'PRD41168', 'cctv_1728018196425.jpg'),
(17, 'PRD41168', 'computer_1728018216377.jpg'),
(18, 'PRD73524', '[\"hp2_1728382377589.jpg\",\"hp1_1728382408284.jpg\"]'),
(19, 'PRD59560', 'efbb2d09671fdd09116c42f8544d011c_1729003877305.jpg'),
(20, 'PRD43335', '[\"blob_1730280960106\"]'),
(21, 'PRD16832', 'computer_1728714321826.jpg'),
(22, 'PRD37922', 'blob_1732348466801'),
(23, 'PRD37922', 'blob_1732348477402'),
(24, 'PRD18914', 'blob_1733486799970'),
(25, 'PRD32272', '[\"blob_1734177529777\"]'),
(26, 'PRD32272', 'blob_1734177529777'),
(27, 'PRD21291', 'blob_1735048597224'),
(28, 'PRD72279', 'blob_1734097174143'),
(29, 'PRD72279', 'blob_1734097188828'),
(30, 'PRD78106', 'blob_1735048203155'),
(31, 'PRD21291', 'blob_1735048597224'),
(32, 'PRD56157', 'blob_1734176797872'),
(33, 'PRD72933', 'blob_1735548274485'),
(34, 'PRD24233', '[\"blob_1735047596008\",\"blob_1735047567758\",\"blob_1735047546211\",\"blob_1735047546212\"]'),
(35, 'PRD21291', 'blob_1735048597224'),
(36, 'PRD72279', 'blob_1735628308436'),
(37, 'PRD72279', 'blob_1734097188828'),
(38, 'PRD70748', 'blob_1736144072244'),
(39, 'PRD59530', 'blob_1734187025056'),
(40, 'PRD92774', 'blob_1736144072244'),
(41, 'PRD96113', 'blob_1735628308436'),
(42, 'PRD96113', 'blob_1734097188828'),
(43, 'PRD59530', 'blob_1734187025056'),
(44, 'PRD72279', 'blob_1737202777176'),
(45, 'PRD72279', 'blob_1734097188828'),
(46, 'PRD72279', 'blob_1737202777176'),
(47, 'PRD72279', 'blob_1734097188828'),
(48, 'PRD77770', 'blob_1734182094940'),
(49, 'PRD77770', 'blob_1734182114988'),
(50, 'PRD77770', 'blob_1734182114988'),
(51, 'PRD37221', 'blob_1734181340016'),
(52, 'PRD37221', 'blob_1734182241234'),
(53, 'PRD37221', 'blob_1734182241234'),
(54, 'PRD37221', 'blob_1734182241255'),
(55, NULL, 'blob_1735048203155'),
(56, 'PRD78106', 'blob_1735048203155'),
(57, 'PRD95945', '[\"blob_1738905358647\"]'),
(58, 'PRD14989', '[\"blob_1738906275317\"]'),
(59, 'PRD31325', '[\"blob_1738909854437\"]'),
(60, 'PRD14989', '[\"blob_1738906275317\"]'),
(61, 'PRD95945', '[\"blob_1738905358647\"]'),
(62, 'PRD22235', '[\"blob_1739795349712\"]'),
(63, 'PRD22235', '[\"blob_1739795349712\"]'),
(64, 'PRD80580', 'blob_1739870803097'),
(65, 'PRD22235', 'blob_1739795349712'),
(66, 'PRD40335', 'blob_1738911117709'),
(67, 'PRD40335', 'blob_1738911117709'),
(68, 'PRD44948', 'blob_1738909084605'),
(69, 'PRD12675', 'blob_1738909257953'),
(70, 'PRD12675', 'blob_1738909435445'),
(71, 'PRD12675', 'blob_1738909435446'),
(72, 'PRD12675', 'blob_1738909435446'),
(73, 'PRD12675', 'blob_1738909435446'),
(74, 'PRD12675', 'blob_1738909483393'),
(75, 'PRD12675', 'blob_1738909483393'),
(76, 'PRD12675', 'blob_1738909563384'),
(77, 'PRD12675', 'blob_1738909563385'),
(78, 'PRD53165', '[\"blob_1735548122241\"]'),
(79, 'PRD44948', 'blob_1738909084605'),
(80, 'PRD99729', 'blob_1740567457520'),
(81, 'PRD17176', 'blob_1740564371106'),
(82, 'PRD17176', 'blob_1740564371106'),
(83, 'PRD17176', 'blob_1740564371106'),
(84, 'PRD17176', 'blob_1740564371106'),
(85, 'PRD17176', 'blob_1740564371106'),
(86, 'PRD17176', 'blob_1740564371106'),
(87, 'PRD17176', 'blob_1740564371106'),
(88, 'PRD20672', '[\"blob_1740637685512\"]'),
(89, 'PRD95760', '[\"blob_1740630699707\"]'),
(90, 'PRD38843', '[\"blob_1740636608111\"]'),
(91, 'PRD21124', '[\"blob_1740630090375\"]'),
(92, 'PRD25573', '[\"blob_1740636395310\"]'),
(93, 'PRD20891', '[\"blob_1740636520209\"]'),
(94, 'PRD48121', 'blob_1740630857097'),
(95, 'PRD17675', '[\"blob_1740636733420\"]'),
(96, 'PRD56243', '[\"blob_1740572250229\"]'),
(97, 'PRD86942', '[\"blob_1740638812227\"]'),
(98, 'PRD33520', '[\"blob_1740630635154\"]'),
(99, 'PRD23001', '[\"blob_1740634265285\"]'),
(100, 'PRD17574', 'blob_1740634120291'),
(101, 'PRD17675', 'blob_1740636733420'),
(102, 'PRD12650', '[\"blob_1740638597070\"]'),
(103, 'PRD54724', '[\"blob_1740631035056\"]'),
(104, 'PRD29578', '[\"blob_1740648241259\"]'),
(105, 'PRD32897', '[\"blob_1740565292822\"]'),
(106, 'PRD32897', 'blob_1740565292822'),
(107, 'PRD34716', 'blob_1740564976161'),
(108, 'PRD21124', '[\"blob_1740630090375\"]'),
(109, 'PRD17675', '[\"blob_1740636733420\"]'),
(110, 'PRD34716', 'blob_1740564976161'),
(111, 'PRD34716', 'modern-abstract-high-tech-logo-design_375081-89.avif'),
(112, 'PRD34716', 'creative-technology-brain-logo-by-md-emon-sheiklogo-and-branding-design-dribbble.png'),
(113, 'PRD11127', '[\"blob_1740564976161\",\"modern-abstract-high-tech-logo-design_375081-89.avif\",\"creative-technology-brain-logo-by-md-emon-sheiklogo-and-branding-design-dribbble.png\"]'),
(114, 'PRD11127', '[\"blob_1740564976161\",\"modern-abstract-high-tech-logo-design_375081-89.avif\",\"creative-technology-brain-logo-by-md-emon-sheiklogo-and-branding-design-dribbble.png\"]'),
(115, 'PRD21124', '[\"blob_1740630090375\"]'),
(116, 'PRD21124', '[\"blob_1740630090375\"]'),
(117, 'PRD60212', '[\"blob_1740564976161\",\"modern-abstract-high-tech-logo-design_375081-89.avif\",\"creative-technology-brain-logo-by-md-emon-sheiklogo-and-branding-design-dribbble.png\"]'),
(118, 'PRD21124', '[\"blob_1740630090375\"]'),
(119, 'PRD56243', '[\"blob_1740572250229\"]'),
(120, 'PRD21124', '[\"blob_1740630090375\"]'),
(121, 'PRD62636', '[\"download-1.jfif\",\"81iM7uCeUVL_AC_UF350350_QL80_.jpg\",\"71mdNHzoGL.jpg\"]'),
(122, 'PRD56243', 'blob_1740572250229'),
(123, 'PRD37478', '[\"image_20250328T095659518Z.jpg\"]'),
(124, 'PRD65506', 'iphone_12_PNG36.png'),
(125, 'PRD25089', 'blob_1740630907694'),
(126, 'PRD65506', 'iphone_12_PNG36.png'),
(127, 'PRD21124', '[\"blob_1740630090375\"]'),
(128, 'PRD21124', '[\"blob_1740630090375\"]'),
(129, 'PRD62636', '[\"81iM7uCeUVL_AC_UF350350_QL80_.jpg\",\"71mdNHzoGL.jpg\",\"blob_1740563905265.jpeg\",\"xiaomi-redmi.jpg\",\"download.jpg\",\"download4.jpg\",\"redmi.jpeg\"]'),
(130, 'PRD62636', '[\"81iM7uCeUVL_AC_UF350350_QL80_.jpg\",\"71mdNHzoGL.jpg\",\"blob_1740563905265.jpeg\",\"xiaomi-redmi.jpg\",\"download.jpg\",\"download4.jpg\",\"redmi.jpeg\"]'),
(131, 'PRD49001', '[\"blob_1740639111080\"]'),
(132, 'PRD38843', '[\"blob_1740636608111\"]'),
(133, 'PRD20303', '[\"copy_PRD20303_download4.jpg\"]'),
(134, 'PRD20374', '71yYUKOQEeL_AC_UF10001000_QL80_-1.jpg'),
(135, 'PRD87534', '[\"71B6yKl44YL_AC_UF350350_QL80_.jpg\",\"61h16N6uZsL_AC_UF10001000_QL80_.jpg\",\"51cqPnWsigL_AC_UL495_SR435495_.jpg\"]'),
(136, 'PRD23688', '[\"image_20250506T070508287Z.jpg\",\"image_20250506T070613411Z.jpg\",\"61k8cxMN1UL_SX679_.jpg\"]'),
(137, 'PRD87534', '[\"71B6yKl44YL_AC_UF350350_QL80_.jpg\",\"61h16N6uZsL_AC_UF10001000_QL80_.jpg\",\"51cqPnWsigL_AC_UL495_SR435495_.jpg\"]'),
(138, 'PRD45757', '[\"81UJMZCCLsL_AC_UF10001000_QL80_.jpg\"]'),
(139, 'PRD21124', 'blob_1740630090375'),
(140, 'PRD65506', 'iphone_12_PNG36.png'),
(141, 'PRD20891', 'blob_1740636520209');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_singleadpage`
--

CREATE TABLE `oneclick_singleadpage` (
  `id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `category` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_singleadpage`
--

INSERT INTO `oneclick_singleadpage` (`id`, `image`, `category`) VALUES
(1, '1725358236087.jpg', NULL),
(2, '1727429399548.jpg', NULL),
(3, '1727429460882.jpg', NULL),
(4, '1727518521655.jpg', NULL),
(5, '1727758043126.jpg', NULL),
(6, '1727956525364.jpg', NULL),
(7, '1728018652204.jpg', NULL),
(8, '1728024670884.png', NULL),
(9, '1728395697286.jpg', 'CCTV'),
(10, '1728395698731.jpg', 'CCTV'),
(11, '1729249444325.jpg', 'loginbg'),
(12, '1729249521666.jpg', 'loginbg'),
(13, '1730697876381.jfif', 'ComputerAccessories'),
(14, '1730699096543.jpg', 'Printers'),
(15, '1730712053400.jpg', 'Printers'),
(17, '1750143250601.jpg', 'loginbg'),
(19, '1751383532382.jpg', 'Computers');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_staff`
--

CREATE TABLE `oneclick_staff` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL,
  `staffname` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_staff`
--

INSERT INTO `oneclick_staff` (`id`, `username`, `password`, `status`, `staffname`) VALUES
(10, 'sam', 'sam123', 'active', 'Sam'),
(14, 'mark', 'mark123', 'inactive', 'mark'),
(16, 'vijay', 'vijay1234', 'active', 'vijay'),
(17, 'jothyraja', 'jothy123', 'active', 'jothy');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_useraddress`
--

CREATE TABLE `oneclick_useraddress` (
  `address_id` int(11) NOT NULL,
  `user_id` varchar(10) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `current_address` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_useraddress`
--

INSERT INTO `oneclick_useraddress` (`address_id`, `user_id`, `name`, `street`, `city`, `state`, `postal_code`, `country`, `phone`, `current_address`) VALUES
(39, 'usr000012', 'vijay anand', 'near kannapachi amman kovil, paruthikattuvilai', 'thkkanamcode', 'Tamil Nadu', '629804', 'India', '9489318959', 0),
(40, 'usr000012', 'vijay anand', 'seasense softwares', 'marthandam', 'Tamil Nadu', '629174', 'India', '9947818959', 0),
(45, 'usr000016', 'AJIL s', 'POOVANVILAI', 'kanyakumari', 'Tamil Nadu', '629163', 'india', '9092206677', 1),
(47, 'usr000019', 'Deepa', 'Nagercoil', 'Nagercoil', 'Tamil Nadu', '629125', 'India', '8270176263', 0),
(48, 'usr000019', 'Deepa', 'Marthandam', 'Nagercoil', 'Tamil Nadu', '629125', 'India', '8270176263', 0),
(49, 'usr000019', 'Deepa', 'Marthandam', 'Nagercoil', 'Tamil Nadu', '629125', 'India', '8270176263', 0),
(50, 'usr000019', 'Deepa', 'Marthandam', 'Nagercoil', 'Tamil Nadu', '629125', 'India', '8270176263', 1),
(52, 'usr000021', 'Ajil s', 'market road marthandam', 'marthandam', 'Other', '629165', 'India', '9487256163', 1),
(69, 'usr000050', 'Athreya', 'abc', 'Ngkl', 'Tn', '629001', 'india', '8778315180', 0),
(71, 'usr000050', 'Admin', 'admin', 'nagercoil', 'tn', '629001', 'india', '8778315180', 1),
(72, 'usr000012', 'Vijay anand', 'Seasense villa, 3/62c, paramankarai,pallan vilai,opp.nalloor panchayath office', 'marthandam', 'Tamil Nadu', '629165', 'India', '9489318959', 1);

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_users`
--

CREATE TABLE `oneclick_users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `wishlist` text DEFAULT NULL,
  `addtocart` text DEFAULT NULL,
  `user_id` varchar(10) DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `otp` varchar(6) NOT NULL,
  `otp_verified` tinyint(1) NOT NULL,
  `buy_later` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `oneclick_users`
--

INSERT INTO `oneclick_users` (`id`, `username`, `email`, `password`, `wishlist`, `addtocart`, `user_id`, `contact_number`, `otp`, `otp_verified`, `buy_later`) VALUES
(21, 'vijayanand', 'vijayanand14490@gmail.com', '123', '[{\"id\":53,\"prod_name\":\"HP Laptop 39.6 cm (15.6) 15-fd0186TU, Silver\",\"prod_features\":\"13th Generation Intel® Core™ i3 processor Windows 11 Home Single Language 39.6 cm (15.6) diagonal FHD display with Intel® UHD Graphics 8 GB DDR4 RAM 512 GB SSD Hard Drive Full-size keyboard with numeric keypad, HP True Vision 1080p FHD camera , Included Microsoft Office Home & Student 2021 Lifetime Subscription (worth ?9199.00)\",\"prod_price\":41599,\"prod_img\":\"c08510572_1_2_2_1727938124766.jpg\",\"status\":\"available\",\"category\":\"Computers\",\"prod_id\":\"PRD50874\"}]', '[{\"id\":67,\"prod_name\":\"HP\",\"prod_features\":\"theatre experience\",\"prod_price\":33000,\"prod_img\":\"[\\\"ad2_1728018242726.jpg\\\"]\",\"status\":\"available\",\"category\":\"Headphones\",\"prod_id\":\"PRD54285\",\"actual_price\":35000}]', 'usr000012', '9489318959', '199713', 1, NULL),
(25, 'ajil', 'ajils28@gmail.com', 'ajilss', NULL, '[]', 'usr000016', '9092206677', '', 0, NULL),
(28, 'Deepa', 'deepa@gmail.com', '12345', '[]', '[]', 'usr000019', '8270176263', '', 0, NULL),
(30, 'AJIL', 'oneclickmtm@gmail.com', '@dmin123', NULL, NULL, 'usr000021', '9487256163', '', 0, NULL),
(46, 'rinu', 'rinu@gmail.com', '12345', NULL, NULL, 'usr000037', '9874125632', '', 0, NULL),
(51, 'Guru', 'guru@gmail.com', '12345', '[{\"id\":143,\"prod_name\":\"Vivo X200 5G (Cosmos Black, 16GB RAM, 512GB Storage)\",\"prod_features\":null,\"prod_price\":65999,\"prod_img\":\"[\\\"blob_1735048203155\\\"]\",\"status\":\"available\",\"category\":\"Mobiles\",\"prod_id\":\"PRD78106\",\"actual_price\":74999,\"offer_label\":\"NEW\",\"coupon\":null,\"coupon_expiry_date\":null,\"subtitle\":\"16 GB RAM | 512 GB ROM 16.94 cm (6.67 inch) Full HD+ Display 50MP + 50MP + 50MP | 32MP Front Camera 5800 mAh Battery Dimensity 9400 Processor\",\"deliverycharge\":\"50\",\"effectiveprice\":0,\"offer_start_time\":\"0000-00-00 00:00:00\",\"offer_end_time\":\"0000-00-00 00:00:00\",\"offer_price\":0,\"additional_accessories\":\"\",\"productStatus\":\"approved\"}]', '[{\"id\":143,\"prod_name\":\"Vivo X200 5G (Cosmos Black, 16GB RAM, 512GB Storage)\",\"prod_features\":null,\"prod_price\":65999,\"prod_img\":\"[\\\"blob_1735048203155\\\"]\",\"status\":\"available\",\"category\":\"Mobiles\",\"prod_id\":\"PRD78106\",\"actual_price\":74999,\"offer_label\":\"NEW\",\"coupon\":null,\"coupon_expiry_date\":null,\"subtitle\":\"16 GB RAM | 512 GB ROM 16.94 cm (6.67 inch) Full HD+ Display 50MP + 50MP + 50MP | 32MP Front Camera 5800 mAh Battery Dimensity 9400 Processor\",\"deliverycharge\":\"50\",\"effectiveprice\":0,\"offer_start_time\":\"0000-00-00 00:00:00\",\"offer_end_time\":\"0000-00-00 00:00:00\",\"offer_price\":0,\"additional_accessories\":\"\",\"productStatus\":\"approved\"}]', 'usr000042', '7896541230', '', 0, NULL),
(55, 'issac', 'issac@gmail.com', '123456', NULL, NULL, 'usr000046', '7358868680', '', 0, NULL),
(58, 'shamini', 'bdm@seasensesoftwares.com', 'shamini@1992', NULL, NULL, 'usr000049', '7402616156', '', 0, NULL),
(60, 'Athreya', 'athreya123@gmail.com', '123456', '[340]', '[\"299-1\",\"334-1\"]', 'usr000050', '8778315180', '100335', 1, '[226,300]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `oneclick_admin`
--
ALTER TABLE `oneclick_admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oneclick_careers`
--
ALTER TABLE `oneclick_careers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `oneclick_common_coupon`
--
ALTER TABLE `oneclick_common_coupon`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oneclick_contact_details`
--
ALTER TABLE `oneclick_contact_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oneclick_coupons`
--
ALTER TABLE `oneclick_coupons`
  ADD PRIMARY KEY (`coupon_id`);

--
-- Indexes for table `oneclick_doubleadpage`
--
ALTER TABLE `oneclick_doubleadpage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oneclick_edithomepage`
--
ALTER TABLE `oneclick_edithomepage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oneclick_mobile_features`
--
ALTER TABLE `oneclick_mobile_features`
  ADD PRIMARY KEY (`feature_id`);

--
-- Indexes for table `oneclick_notifications`
--
ALTER TABLE `oneclick_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oneclick_offerspage`
--
ALTER TABLE `oneclick_offerspage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oneclick_orders`
--
ALTER TABLE `oneclick_orders`
  ADD PRIMARY KEY (`order_id`),
  ADD UNIQUE KEY `unique_id` (`unique_id`);

--
-- Indexes for table `oneclick_order_items`
--
ALTER TABLE `oneclick_order_items`
  ADD PRIMARY KEY (`order_item_id`);

--
-- Indexes for table `oneclick_products`
--
ALTER TABLE `oneclick_products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `oneclick_product_category`
--
ALTER TABLE `oneclick_product_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oneclick_product_images`
--
ALTER TABLE `oneclick_product_images`
  ADD PRIMARY KEY (`product_image_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `oneclick_singleadpage`
--
ALTER TABLE `oneclick_singleadpage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oneclick_staff`
--
ALTER TABLE `oneclick_staff`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oneclick_useraddress`
--
ALTER TABLE `oneclick_useraddress`
  ADD PRIMARY KEY (`address_id`);

--
-- Indexes for table `oneclick_users`
--
ALTER TABLE `oneclick_users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `oneclick_admin`
--
ALTER TABLE `oneclick_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `oneclick_careers`
--
ALTER TABLE `oneclick_careers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `oneclick_common_coupon`
--
ALTER TABLE `oneclick_common_coupon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `oneclick_contact_details`
--
ALTER TABLE `oneclick_contact_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `oneclick_coupons`
--
ALTER TABLE `oneclick_coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `oneclick_doubleadpage`
--
ALTER TABLE `oneclick_doubleadpage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `oneclick_edithomepage`
--
ALTER TABLE `oneclick_edithomepage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT for table `oneclick_mobile_features`
--
ALTER TABLE `oneclick_mobile_features`
  MODIFY `feature_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `oneclick_notifications`
--
ALTER TABLE `oneclick_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `oneclick_offerspage`
--
ALTER TABLE `oneclick_offerspage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `oneclick_orders`
--
ALTER TABLE `oneclick_orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=259;

--
-- AUTO_INCREMENT for table `oneclick_order_items`
--
ALTER TABLE `oneclick_order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=223;

--
-- AUTO_INCREMENT for table `oneclick_product_category`
--
ALTER TABLE `oneclick_product_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=386;

--
-- AUTO_INCREMENT for table `oneclick_product_images`
--
ALTER TABLE `oneclick_product_images`
  MODIFY `product_image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT for table `oneclick_singleadpage`
--
ALTER TABLE `oneclick_singleadpage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `oneclick_staff`
--
ALTER TABLE `oneclick_staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `oneclick_useraddress`
--
ALTER TABLE `oneclick_useraddress`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `oneclick_users`
--
ALTER TABLE `oneclick_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
