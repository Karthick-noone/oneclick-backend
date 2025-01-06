-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 21, 2024 at 11:03 AM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `oneclick`
--
CREATE DATABASE IF NOT EXISTS `oneclick` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `oneclick`;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'admin', 'admin', 'karthick.mindtek@gmail.com', '2024-08-27 08:42:48'),
(2, 'admin', '123456admin', 'karthick.mindtek@gmail.com', '2024-08-27 08:42:48');

-- --------------------------------------------------------

--
-- Table structure for table `careers`
--

CREATE TABLE IF NOT EXISTS `careers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `position` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `resumeLink` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `careers`
--

INSERT INTO `careers` (`id`, `name`, `email`, `phone`, `position`, `startDate`, `resumeLink`, `createdAt`) VALUES
(15, 'Karthick A', 'karthic@gmail.com', '9877831518', 'storeLeadership', '2024-09-18', 'NAUKRI_KARTHICK.A_1722502732823_Karthick.A_1726657260589.pdf', '2024-09-18 11:01:00'),
(16, 'Karthick Athreya', 'karthick15@gmail.com', '9877831517', 'inStoreSales', '2024-09-18', 'NAUKRI_KARTHICK.A_1722502732823_Karthick.A_1726657941109.pdf', '2024-09-18 11:12:21'),
(17, 'Karthick Athreya', 'karthick34564@gmail.com', '9877831517', 'inStoreSales', '2024-09-18', 'NAUKRI_KARTHICK.A_1722502732823_Karthick.A_1726658003283.pdf', '2024-09-18 11:13:23'),
(18, 'Karthick A', 'karthick.mindtek@gmail.com', '9877831518', 'inStoreSales', '2024-09-25', 'NAUKRI_KARTHICK.A_1722502732823_Karthick.A_1726658042929.pdf', '2024-09-18 11:14:02');

-- --------------------------------------------------------

--
-- Table structure for table `cctv`
--

CREATE TABLE IF NOT EXISTS `cctv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'available',
  `category` varchar(255) DEFAULT 'cctv',
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `cctv`
--

INSERT INTO `cctv` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(1, 'High security surveilance', '24/7 security', '50000.00', 'cctv_1725014828475.jpg', 'available', 'cctv', 'PRD18364');

-- --------------------------------------------------------

--
-- Table structure for table `computeraccessories`
--

CREATE TABLE IF NOT EXISTS `computeraccessories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'available',
  `category` varchar(255) DEFAULT 'computeraccessories',
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `computeraccessories`
--

INSERT INTO `computeraccessories` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(2, 'Gadgets', 'HP All-in-One 22-c0030, Sleek and space-saving', '1.00', 'cmp_1725015071030.jpg', 'available', 'computeraccessories', 'PRD18899');

-- --------------------------------------------------------

--
-- Table structure for table `computers`
--

CREATE TABLE IF NOT EXISTS `computers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) DEFAULT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` varchar(100) NOT NULL,
  `category` varchar(255) DEFAULT 'computers',
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `computers`
--

INSERT INTO `computers` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(4, 'laptop', 'HP All-in-One 22-c0030, Sleek and space-saving', '50000.00', 'laptop_1726639436313.jpg', 'unavailable', 'computers', 'PRD48834'),
(6, 'Workstation Laptop', 'HP ZBook Firefly 14, Reliable and powerful.', '34000.00', 'computer_1724932939057.jpg', 'available', 'computers', 'PRD18887'),
(7, 'Business tv', 'Dell Inspiron 15 3593, Black.', '35000.00', 'tv_1724993918345.jpg', 'available', 'computers', 'PRD18822');

-- --------------------------------------------------------

--
-- Table structure for table `doubleadpage`
--

CREATE TABLE IF NOT EXISTS `doubleadpage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `doubleadpage`
--

INSERT INTO `doubleadpage` (`id`, `title`, `description`, `image`, `created_at`, `category`) VALUES
(1, 'Best Prices on Electronics!', 'Shop the latest electronics with unbeatable prices.', 'ad1_1_11zon_1725356209881.jpg', '2024-09-18 05:31:59', 'Mobiles'),
(2, 'Exclusive Deals for You!', 'Don''t miss out on our exclusive deals and offers.', 'ad2_2_11zon_1725356218518.jpg', '2024-09-03 08:49:02', 'Headphones');

-- --------------------------------------------------------

--
-- Table structure for table `edithomepage`
--

CREATE TABLE IF NOT EXISTS `edithomepage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `edithomepage`
--

INSERT INTO `edithomepage` (`id`, `title`, `description`, `image`, `created_at`, `category`) VALUES
(8, 'Best Prices', 'Incredible Prices on All Your Favorite Items Get more for less on selected brands', 'ad1_1726636602802.jpg,ad2_1726636602992.jpg', '2024-09-03 07:26:59', 'Mobiles');

-- --------------------------------------------------------

--
-- Table structure for table `headphones`
--

CREATE TABLE IF NOT EXISTS `headphones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'available',
  `category` varchar(255) DEFAULT 'headphones',
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `headphones`
--

INSERT INTO `headphones` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(1, 'HP Headphone', 'Theater experience', '10000.00', 'headphones_1725014887270.jpg', 'available', 'headphones', 'PRD18541');

-- --------------------------------------------------------

--
-- Table structure for table `mobileaccessories`
--

CREATE TABLE IF NOT EXISTS `mobileaccessories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'available',
  `category` varchar(255) DEFAULT 'mobileaccessories',
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `mobileaccessories`
--

INSERT INTO `mobileaccessories` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(1, 'Gadgets', 'HP All-in-One 22-c0030, Sleek and space-saving', '5000.00', 'about1_1725015170122.jpg', 'available', 'mobileaccessories', 'PRD18611'),
(2, 'Mobile case', 'Longevity, mate model', '200.00', 'cmp_1725089139204.jpg', 'available', 'mobileaccessories', 'PRD15543');

-- --------------------------------------------------------

--
-- Table structure for table `mobiles`
--

CREATE TABLE IF NOT EXISTS `mobiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'available',
  `category` varchar(255) DEFAULT 'mobiles',
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `mobiles`
--

INSERT INTO `mobiles` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(1, 'Vivo v3  Mobile', 'HP ZBook Firefly 14, Reliable and powerful.', '30000.00', 'mbl_1725014756169.jpg', 'available', 'mobiles', 'PRD35834'),
(3, 'Vivo v3 ', 'HP All-in-One 22-c0030, Sleek and space-saving', '50000.00', 'ad1_1_11zon_1725707684266.jpg', 'available', 'mobiles', 'PRD18853'),
(4, 'Samsung S3', 'See moon on your cam', '100000.00', 'ad1_1726118737710.jpg', 'available', 'mobiles', 'PRD18834');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `shipping_address` text,
  `address_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) DEFAULT 'Pending',
  `unique_id` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `unique_id` (`unique_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=86 ;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `shipping_address`, `address_id`, `order_date`, `status`, `unique_id`) VALUES
(22, 'usr000004', '25000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 07:22:20', 'Pending', 'ORD50721765'),
(23, 'usr000004', '50000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 07:35:45', 'Pending', 'ORD50721246'),
(24, 'usr000004', '5000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 07:40:18', 'Pending', 'ORD17661222'),
(25, 'usr000004', '39000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 07:41:37', 'Pending', 'ORD65891762'),
(26, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 08:49:12', 'Pending', 'ORD57539717'),
(27, 'usr000004', '5000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 08:50:11', 'Pending', 'ORD73998162'),
(28, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 10:14:11', 'Pending', 'ORD78303455'),
(29, 'usr000004', '500.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 10:18:57', 'Pending', 'ORD11380399'),
(30, 'usr000004', '500.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 10:20:04', 'Pending', 'ORD31239359'),
(31, 'usr000004', '500.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 10:21:46', 'Pending', 'ORD32481954'),
(32, 'usr000004', '500.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 10:24:07', 'Pending', 'ORD27326427'),
(33, 'usr000004', '10000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 10:25:31', 'Pending', 'ORD76115563'),
(34, 'usr000004', '25000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 10:30:06', 'Pending', 'ORD39331791'),
(35, 'usr000004', '25000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 10:32:30', 'Pending', 'ORD58837256'),
(36, 'usr000004', '25000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 10:34:41', 'Pending', 'ORD82420645'),
(37, 'usr000004', '25000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 10:38:45', 'Pending', 'ORD81135859'),
(38, 'usr000004', '25000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 10:38:52', 'Pending', 'ORD64638429'),
(39, 'usr000004', '25000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 10:39:14', 'Pending', 'ORD24828388'),
(40, 'usr000004', '25000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 10:41:07', 'Pending', 'ORD75790680'),
(41, 'usr000004', '5000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 10:43:03', 'Pending', 'ORD17386281'),
(42, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 10:43:51', 'Pending', 'ORD93674965'),
(43, 'usr000004', '5000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 10:59:16', 'Pending', 'ORD85655723'),
(44, 'usr000004', '5000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 11:00:48', 'Pending', 'ORD30699561'),
(45, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 11:05:06', 'Pending', 'ORD77719574'),
(46, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 11:05:46', 'Pending', 'ORD89905338'),
(47, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 11:06:00', 'Pending', 'ORD44676691'),
(48, 'usr000004', '5000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 11:06:27', 'Pending', 'ORD27743548'),
(49, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 11:09:10', 'Pending', 'ORD75590743'),
(50, 'usr000004', '5000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 11:10:26', 'Pending', 'ORD78590120'),
(51, 'usr000004', '5000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 11:11:34', 'Pending', 'ORD77284766'),
(52, 'usr000004', '5000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 11:27:47', 'Pending', 'ORD15369421'),
(53, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 11:30:16', 'Pending', 'ORD71219365'),
(54, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 11:30:40', 'Pending', 'ORD57348373'),
(55, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 11:32:08', 'Pending', 'ORD98549396'),
(56, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 11:35:16', 'Pending', 'ORD65359426'),
(57, 'usr000004', '5000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 11:37:08', 'Pending', 'ORD67685044'),
(58, 'usr000004', '50000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-09 11:38:00', 'Pending', 'ORD72568717'),
(59, 'usr000004', '30000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-09 11:39:19', 'Pending', 'ORD31987951'),
(60, 'usr000004', '30000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-10 04:35:47', 'Pending', 'ORD10384392'),
(61, 'usr000004', '30000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-10 04:36:28', 'Pending', 'ORD61994021'),
(62, 'usr000004', '30000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-10 04:36:34', 'Pending', 'ORD44008049'),
(63, 'usr000004', '30000.00', 'Vijay, 15, Chennai, Tamil Nadu, India, 600028', 20, '2024-09-10 04:37:17', 'Pending', 'ORD66123254'),
(64, 'usr000004', '30000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-10 04:52:26', 'Pending', 'ORD79873199'),
(65, 'usr000004', '30000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-10 04:55:13', 'Pending', 'ORD96304749'),
(66, 'usr000002', '25000.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 05:03:20', 'Pending', 'ORD90177375'),
(67, 'usr000002', '1.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 06:55:40', 'Pending', 'ORD56627208'),
(68, 'usr000002', '1.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 06:58:23', 'Pending', 'ORD36656813'),
(69, 'usr000002', '1.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:01:56', 'Pending', 'ORD55234578'),
(70, 'usr000002', '1.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:11:55', 'Pending', 'ORD48177904'),
(71, 'usr000002', '50000.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:14:02', 'Pending', 'ORD95055445'),
(72, 'usr000002', '50000.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:22:47', 'Pending', 'ORD21814966'),
(73, 'usr000002', '50000.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:22:50', 'Pending', 'ORD58393813'),
(74, 'usr000002', '200.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:26:01', 'Pending', 'ORD20537745'),
(75, 'usr000002', '200.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:29:17', 'Pending', 'ORD72084736'),
(76, 'usr000002', '200.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:35:24', 'Pending', 'ORD10860455'),
(77, 'usr000002', '200.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:38:55', 'Pending', 'ORD22648643'),
(78, 'usr000002', '34000.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:40:41', 'Pending', 'ORD92270107'),
(79, 'usr000002', '1.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 07:44:33', 'Pending', 'ORD56932250'),
(80, 'usr000002', '1.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 09:00:46', 'Pending', 'ORD10378137'),
(81, 'usr000002', '1.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-12 09:05:29', 'Pending', 'ORD95119930'),
(82, 'usr000001', '5000.00', 'Joe Root, no 9, London, London, UK, 455645', 23, '2024-09-16 10:08:18', 'Paid', 'ORD51580282'),
(83, 'usr000001', '200.00', 'Joe Root, no 9, London, London, UK, 455645', 23, '2024-09-16 10:18:59', 'Paid', 'ORD84581689'),
(84, 'usr000002', '200.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-17 05:04:57', 'Paid', 'ORD86585615'),
(85, 'usr000002', '200.00', 'Karthick, Nagercoil, Nagercoil, Aandhra, India, 897896', 22, '2024-09-17 05:12:58', 'Paid', 'ORD29950709');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE IF NOT EXISTS `order_items` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(20) NOT NULL,
  `product_id` varchar(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`order_item_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=76 ;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`, `name`, `image`, `description`) VALUES
(31, '21', '1', 1, '50000.00', '', '', NULL),
(32, '21', '4', 1, '50000.00', '', '', NULL),
(33, '22', '1', 1, '25000.00', '', '', NULL),
(34, '23', '1', 1, '50000.00', '', '', NULL),
(35, '0', '1', 1, '5000.00', '', '', NULL),
(36, 'ORD65891762', '1', 1, '5000.00', '', '', NULL),
(37, 'ORD65891762', '6', 1, '34000.00', '', '', NULL),
(38, 'ORD57539717', '1', 1, '5000.00', '', '', NULL),
(39, 'ORD73998162', '1', 1, '5000.00', '', '', NULL),
(40, '32', '2', 1, '500.00', '', '', NULL),
(41, '33', '1', 1, '10000.00', '', '', NULL),
(42, '34', '1', 1, '25000.00', '', '', NULL),
(43, '35', '1', 1, '25000.00', '', '', NULL),
(44, '36', '1', 1, '25000.00', '', '', NULL),
(45, '40', '1', 1, '25000.00', '', '', NULL),
(46, '41', '1', 1, '5000.00', '', '', NULL),
(47, '42', '1', 1, '5000.00', '', '', NULL),
(48, '43', '1', 1, '5000.00', '', '', NULL),
(49, '44', '1', 1, '5000.00', '', '', NULL),
(50, '48', '1', 1, '5000.00', '', '', NULL),
(51, '50', '1', 1, '5000.00', '', '', NULL),
(52, '51', '1', 1, '5000.00', '', '', NULL),
(53, '52', '1', 1, '5000.00', '', '', NULL),
(54, '53', '1', 1, '5000.00', '', '', NULL),
(55, '54', '1', 1, '5000.00', '', '', NULL),
(56, '55', '1', 1, '5000.00', '', '', NULL),
(57, '56', '1', 1, '5000.00', '', '', NULL),
(58, '57', '1', 1, '5000.00', '', '', NULL),
(59, '58', '3', 1, '50000.00', '', '', NULL),
(60, '59', '1', 1, '30000.00', '', '', NULL),
(61, '60', '1', 1, '30000.00', '', '', NULL),
(62, '61', '1', 1, '30000.00', '', '', NULL),
(63, '62', '1', 1, '30000.00', '', '', NULL),
(64, '63', '1', 1, '30000.00', '', '', NULL),
(65, '64', '1', 1, '30000.00', '', '', NULL),
(66, '65', '1', 1, '30000.00', '', '', NULL),
(67, '66', '1', 1, '25000.00', '', '', NULL),
(68, '78', 'PRD18887', 1, '34000.00', '', '', NULL),
(69, '79', 'PRD18899', 1, '1.00', '', '', NULL),
(70, '80', 'PRD18899', 1, '1.00', '', '', NULL),
(71, 'ORD95119930', 'PRD18899', 1, '1.00', '', '', NULL),
(72, 'ORD51580282', 'PRD18000', 1, '5000.00', '', '', NULL),
(73, 'ORD84581689', 'PRD15543', 1, '200.00', '', '', NULL),
(74, 'ORD86585615', 'PRD15543', 1, '200.00', '', '', NULL),
(75, 'ORD29950709', 'PRD15543', 1, '200.00', '', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `printers`
--

CREATE TABLE IF NOT EXISTS `printers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'available',
  `category` varchar(255) DEFAULT 'printers',
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `printers`
--

INSERT INTO `printers` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(1, 'Printer', 'HP All-in-One 22-c0030, Sleek and space-saving', '5000.00', 'printer_1725015030895.jfif', 'available', 'printers', 'PRD18000');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `product_id` varchar(10) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` text,
  `category` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `image_url`, `category`) VALUES
('1', 'Home Theater', 'Theater experience,Dolby atmos', '50000.00', 'speaker_1725017318256.jfif', 'speakers'),
('2', 'Gadgets', 'HP All-in-One 22-c0030, Sleek and space-saving', '500.00', 'cmp_1725015071030.jpg', 'computeraccessories'),
('3', 'Vivo v3 ', 'HP All-in-One 22-c0030, Sleek and space-saving', '50000.00', 'ad1_1_11zon_1725707684266.jpg', 'mobiles'),
('4', 'laptop', 'HP All-in-One 22-c0030, Sleek and space-saving', '50000.00', 'laptop_1724932853656.jpg', 'computers'),
('6', 'Workstation Laptop', 'HP ZBook Firefly 14, Reliable and powerful.', '34000.00', 'computer_1724932939057.jpg', 'computers'),
('PRD15543', 'Mobile case', 'Longevity, mate model', '200.00', 'cmp_1725089139204.jpg', 'mobileaccessories'),
('PRD18000', 'Printer', 'HP All-in-One 22-c0030, Sleek and space-saving', '5000.00', 'printer_1725015030895.jfif', 'printers'),
('PRD18887', 'Workstation Laptop', 'HP ZBook Firefly 14, Reliable and powerful.', '34000.00', 'computer_1724932939057.jpg', 'computers'),
('PRD18899', 'Gadgets', 'HP All-in-One 22-c0030, Sleek and space-saving', '1.00', 'cmp_1725015071030.jpg', 'computeraccessories');

-- --------------------------------------------------------

--
-- Table structure for table `singleadpage`
--

CREATE TABLE IF NOT EXISTS `singleadpage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `singleadpage`
--

INSERT INTO `singleadpage` (`id`, `image`) VALUES
(1, '1725358236087.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `speakers`
--

CREATE TABLE IF NOT EXISTS `speakers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'available',
  `category` varchar(255) DEFAULT 'speakers',
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `speakers`
--

INSERT INTO `speakers` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(1, 'Home Theater', 'Theater experience,Dolby atmos', '25000.00', 'speaker_1725017318256.jfif', 'unavailable', 'speakers', 'PRD09834');

-- --------------------------------------------------------

--
-- Table structure for table `tv`
--

CREATE TABLE IF NOT EXISTS `tv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'available',
  `category` varchar(255) DEFAULT 'tv',
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `tv`
--

INSERT INTO `tv` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(1, 'Samsung Curved Tv', 'Real experience, Bluetooth connection', '50000.00', 'tv_1726639486872.jpg', 'available', 'tv', 'PRD09876');

-- --------------------------------------------------------

--
-- Table structure for table `useraddress`
--

CREATE TABLE IF NOT EXISTS `useraddress` (
  `address_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(10) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `current_address` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=51 ;

--
-- Dumping data for table `useraddress`
--

INSERT INTO `useraddress` (`address_id`, `user_id`, `name`, `street`, `city`, `state`, `postal_code`, `country`, `phone`, `current_address`) VALUES
(1, '0', 'Karthick', 'Nagercoil', 'Nagercoil', 'Tamil Nadu', '629001', 'India', '8778315180', 0),
(15, 'usr000003', 'Karthick', 'Ramar kovil street', 'Thenmalai', 'Tamil Nadu', '627757', 'India', '7876897695', 0),
(16, 'usr000003', 'Athreya', '12', 'Nagercoil', 'Tamil Nadu', '629001', 'India', '6765786876', 0),
(17, 'usr000003', 'Rahman', '15', 'Chennai', 'Tamil Nadu', '600028', 'India', '8767576547', 1),
(20, 'usr000004', 'Vijay', '15', 'Chennai', 'Tamil Nadu', '600028', 'India', '8767576547', 0),
(21, 'usr000004', 'Ajith', '15', 'Chennai', 'Tamil Nadu', '600028', 'India', '8767576547', 1),
(22, 'usr000002', 'Karthick', 'Nagercoil', 'Nagercoil', 'Aandhra', '897896', 'India', '7656844444', 1),
(23, 'usr000001', 'Joe Root', 'no 9', 'London', 'London', '455645', 'UK', '8768769769', 1),
(49, 'usr000006', 'Athreya', 'Nagercoil', 'London', 'London', '455645', 'India', '9775151805', 0),
(50, 'usr000006', 'Sura', 'scffdf', 'London', 'London', '629001', 'India', '8778351805', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `wishlist` text,
  `addtocart` text,
  `user_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `wishlist`, `addtocart`, `user_id`) VALUES
(10, 'admin', 'adam@gmail.com', 'adminn', '[{}]', '[]', 'usr000002'),
(11, 'root', 'joeroot@gmail.com', '123456', '[]', '[]', 'usr000001'),
(12, 'athreya', 'athreya@gmail.com', 'qwerty', '', '[]', 'usr000003'),
(13, 'vijay', 'thalapathy@gmail.com', 'thalapathy', NULL, NULL, 'usr000004'),
(14, 'root', 'admin@gmail.com', 'admin', NULL, NULL, 'usr000005'),
(15, 'ashwin', 'ashwin@gmail.com', '11111', '[{"id":1,"prod_name":"Vivo v3  Mobile","prod_features":"HP ZBook Firefly 14, Reliable and powerful.","prod_price":30000,"prod_img":"mbl_1725014756169.jpg","status":"available","category":"mobiles","prod_id":"PRD35834"}]', '[]', 'usr000006');

-- --------------------------------------------------------

--
-- Table structure for table `watch`
--

CREATE TABLE IF NOT EXISTS `watch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'available',
  `category` varchar(255) DEFAULT 'watch',
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `watch`
--

INSERT INTO `watch` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(1, 'Rolex', 'Date imported, Water Proof.', '2999.00', 'watch_1726639168351.jpg', 'available', 'watch', 'PRD18002');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
