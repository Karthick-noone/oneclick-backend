-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 02, 2025 at 01:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
(1, 'admin', 'admin', 'enquiryoneclick@gmail.com', '2024-08-27 08:42:48');

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

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_product_images`
--

CREATE TABLE `oneclick_product_images` (
  `product_image_id` int(11) NOT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oneclick_singleadpage`
--

CREATE TABLE `oneclick_singleadpage` (
  `id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `category` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
  `current_address` tinyint(1) DEFAULT 0,
  `alternative_number` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_common_coupon`
--
ALTER TABLE `oneclick_common_coupon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_contact_details`
--
ALTER TABLE `oneclick_contact_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_coupons`
--
ALTER TABLE `oneclick_coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_doubleadpage`
--
ALTER TABLE `oneclick_doubleadpage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_edithomepage`
--
ALTER TABLE `oneclick_edithomepage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_mobile_features`
--
ALTER TABLE `oneclick_mobile_features`
  MODIFY `feature_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_notifications`
--
ALTER TABLE `oneclick_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_offerspage`
--
ALTER TABLE `oneclick_offerspage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_orders`
--
ALTER TABLE `oneclick_orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_order_items`
--
ALTER TABLE `oneclick_order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_product_category`
--
ALTER TABLE `oneclick_product_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_product_images`
--
ALTER TABLE `oneclick_product_images`
  MODIFY `product_image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_singleadpage`
--
ALTER TABLE `oneclick_singleadpage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_staff`
--
ALTER TABLE `oneclick_staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_useraddress`
--
ALTER TABLE `oneclick_useraddress`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oneclick_users`
--
ALTER TABLE `oneclick_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
