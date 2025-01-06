-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 23, 2024 at 11:52 AM
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
-- Table structure for table `oneclick_admin`
--

CREATE TABLE IF NOT EXISTS `oneclick_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `oneclick_admin`
--

INSERT INTO `oneclick_admin` (`id`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'admin', 'admin', 'karthick.mindtek@gmail.com', '2024-08-27 08:42:48');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_careers`
--

CREATE TABLE IF NOT EXISTS `oneclick_careers` (
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
-- Dumping data for table `oneclick_careers`
--

INSERT INTO `oneclick_careers` (`id`, `name`, `email`, `phone`, `position`, `startDate`, `resumeLink`, `createdAt`) VALUES
(15, 'Karthick A', 'karthic@gmail.com', '9877831518', 'storeLeadership', '2024-09-18', 'NAUKRI_KARTHICK.A_1722502732823_Karthick.A_1726657260589.pdf', '2024-09-18 11:01:00'),
(16, 'Karthick Athreya', 'karthick15@gmail.com', '9877831517', 'inStoreSales', '2024-09-18', 'NAUKRI_KARTHICK.A_1722502732823_Karthick.A_1726657941109.pdf', '2024-09-18 11:12:21'),
(17, 'Karthick Athreya', 'karthick34564@gmail.com', '9877831517', 'inStoreSales', '2024-09-18', 'NAUKRI_KARTHICK.A_1722502732823_Karthick.A_1726658003283.pdf', '2024-09-18 11:13:23'),
(18, 'Karthick A', 'karthick.mindtek@gmail.com', '9877831518', 'inStoreSales', '2024-09-25', 'NAUKRI_KARTHICK.A_1722502732823_Karthick.A_1726658042929.pdf', '2024-09-18 11:14:02');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_doubleadpage`
--

CREATE TABLE IF NOT EXISTS `oneclick_doubleadpage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `oneclick_doubleadpage`
--

INSERT INTO `oneclick_doubleadpage` (`id`, `title`, `description`, `image`, `created_at`, `category`) VALUES
(1, 'Best Prices on Electronics!', 'Shop the latest electronics with unbeatable prices.', 'ad1_1_11zon_1725356209881.jpg', '2024-09-05 05:46:37', 'Mobiles'),
(2, 'Exclusive Deals for You!', 'Don''t miss out on our exclusive deals and offers.', 'ad2_2_11zon_1725356218518.jpg', '2024-09-03 08:49:02', 'Headphones');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_edithomepage`
--

CREATE TABLE IF NOT EXISTS `oneclick_edithomepage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `oneclick_edithomepage`
--

INSERT INTO `oneclick_edithomepage` (`id`, `title`, `description`, `image`, `created_at`, `category`) VALUES
(8, 'Best Prices', 'Incredible Prices on All Your Favorite Items Get more for less on selected brands', 'ad1_1727092001406.jpg,ad2_1727092001445.jpg', '2024-09-03 07:26:59', 'Mobiles');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_orders`
--

CREATE TABLE IF NOT EXISTS `oneclick_orders` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=66 ;

--
-- Dumping data for table `oneclick_orders`
--

INSERT INTO `oneclick_orders` (`order_id`, `user_id`, `total_amount`, `shipping_address`, `address_id`, `order_date`, `status`, `unique_id`) VALUES
(65, 'usr000004', '30000.00', 'Ajith, 15, Chennai, Tamil Nadu, India, 600028', 21, '2024-09-10 04:55:13', 'Pending', 'ORD96304749');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_order_items`
--

CREATE TABLE IF NOT EXISTS `oneclick_order_items` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(20) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`order_item_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=67 ;

--
-- Dumping data for table `oneclick_order_items`
--

INSERT INTO `oneclick_order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`, `name`, `image`, `description`) VALUES
(66, '65', 1, 1, '30000.00', '', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_products`
--

CREATE TABLE IF NOT EXISTS `oneclick_products` (
  `product_id` varchar(10) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` text,
  `category` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `oneclick_products`
--

INSERT INTO `oneclick_products` (`product_id`, `name`, `description`, `price`, `image_url`, `category`) VALUES
('6', 'Workstation Laptop', 'HP ZBook Firefly 14, Reliable and powerful.', '34000.00', 'computer_1724932939057.jpg', 'computers');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_product_category`
--

CREATE TABLE IF NOT EXISTS `oneclick_product_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) NOT NULL,
  `prod_features` text,
  `prod_price` decimal(10,2) NOT NULL,
  `prod_img` varchar(255) DEFAULT NULL,
  `status` enum('available','unavailable') DEFAULT 'available',
  `category` varchar(255) NOT NULL,
  `prod_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `oneclick_product_category`
--

INSERT INTO `oneclick_product_category` (`id`, `prod_name`, `prod_features`, `prod_price`, `prod_img`, `status`, `category`, `prod_id`) VALUES
(1, 'LENOVO', 'Dell Inspiron 15 3593, Black.', '50000.00', 'computer_1727085125902.jpg', 'available', 'Computers', 'PRD76057'),
(3, 'REDMI', 'Dell Inspiron 15 3593, Black.', '50000.00', 'mbl_1727085175309.jpg', 'available', 'Mobiles', 'PRD72556'),
(4, 'CCTV surveilance', 'Dell Inspiron 15 3593, Black.', '50000.00', 'cctv_1727090222371.jpg', 'available', 'CCTV', 'PRD42940'),
(5, 'Computers', 'Dell Inspiron 15 3593, Black.', '5000.00', 'download_1727086056132.jpg', 'available', 'Computers', 'PRD81905'),
(8, 'HP', 'Theater experience,Dolby atmos', '50000.00', 'headphones_1727091885696.jpg', 'available', 'Headphones', 'PRD59818'),
(9, 'Samsung Curved Tv 50 inch', 'Theater experience,Dolby atmos', '39999.00', 'tv_1727091916259.jpg', 'available', 'TV', 'PRD36220'),
(10, 'Home Theater', 'Dolby Atmos', '50000.00', 'speaker_1727087772658.jfif', 'available', 'Speakers', 'PRD78217'),
(13, 'Rolex Dilli', 'Dell Inspiron 15 3593, Black.', '39999.00', 'images_1727088339619.jfif', 'available', 'Watch', 'PRD15635'),
(14, 'Printers', 'Dell Inspiron 15 3593, Black.', '50000.00', 'printer_1727088613975.jfif', 'available', 'Printers', 'PRD56543'),
(15, 'Mobile case', 'Dell Inspiron 15 3593, Black.', '50000.00', 'about1_1727088833552.jpg', 'available', 'MobileAccessories', 'PRD86524'),
(16, 'USB', 'HP All-in-One 22-c0030, Sleek and space-saving', '50.00', 'about1_1727088864674.jpg', 'available', 'ComputerAccessories', 'PRD17368');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_singleadpage`
--

CREATE TABLE IF NOT EXISTS `oneclick_singleadpage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `oneclick_singleadpage`
--

INSERT INTO `oneclick_singleadpage` (`id`, `image`) VALUES
(1, '1725358236087.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_useraddress`
--

CREATE TABLE IF NOT EXISTS `oneclick_useraddress` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

--
-- Dumping data for table `oneclick_useraddress`
--

INSERT INTO `oneclick_useraddress` (`address_id`, `user_id`, `name`, `street`, `city`, `state`, `postal_code`, `country`, `phone`, `current_address`) VALUES
(21, 'usr000004', 'Ajith', '15', 'Chennai', 'Tamil Nadu', '600028', 'India', '8767576547', 1);

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_users`
--

CREATE TABLE IF NOT EXISTS `oneclick_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `wishlist` text,
  `addtocart` text,
  `user_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Dumping data for table `oneclick_users`
--

INSERT INTO `oneclick_users` (`id`, `username`, `email`, `password`, `wishlist`, `addtocart`, `user_id`) VALUES
(10, 'admin', 'adam@gmail.com', 'adminn', '[{"id":9,"prod_name":"Samsung Curved Tv 50 inch","prod_features":"Theater experience,Dolby atmos","prod_price":39999,"prod_img":"tv_1727091916259.jpg","status":"available","category":"TV","prod_id":"PRD36220"}]', '[]', 'usr000002'),
(11, 'root', 'joeroot@gmail.com', '123456', NULL, NULL, 'usr000001'),
(12, 'athreya', 'athreya@gmail.com', 'qwerty', '[]', '[]', 'usr000003'),
(13, 'vijay', 'thalapathy@gmail.com', 'thalapathy', NULL, NULL, 'usr000004');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
