-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 31, 2024 at 01:23 PM
-- Server version: 8.0.36-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Hapido`
--

-- --------------------------------------------------------

--
-- Table structure for table `connections`
--

CREATE TABLE `connections` (
  `connection_id` int NOT NULL,
  `sender_company_id` int DEFAULT NULL,
  `receiver_company_id` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `connections`
--

INSERT INTO `connections` (`connection_id`, `sender_company_id`, `receiver_company_id`, `status`, `created_at`, `updated_at`) VALUES
(2, 5, 9, 'Reject', '2024-01-31 07:50:18', '2024-01-31 07:52:01');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `user_id` int NOT NULL,
  `company_id` int DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `user_type` enum('C','E') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`user_id`, `company_id`, `firstName`, `lastName`, `email`, `password`, `profileImage`, `user_type`, `created_at`) VALUES
(4, 10, 'Ajit', 'Rathore', 'ajist@gmail.com', '$2b$10$kLO2S1WwChBixf.MtFwFIOYCGQmnmMu1yPbyWgG3kX/N6m1Aooqqi', NULL, 'C', '2024-01-30 17:13:51'),
(5, 9, 'Rohan', 'Singh', 'rohan@gmail.com', '$2b$10$MM8ZkHFATcvmXpMu/0zs3eepvUiCEt3Eze1uJwcG0pIoMCQ.Jr63S', NULL, 'E', '2024-01-30 17:45:10'),
(6, NULL, 'Rohan', 'Singh', 'rohan1@gmail.com', '$2b$10$NPZTisq7JeWZrJmwmGzLYu73zeqUG3cIks8xybew8uvlyWEQp.QyO', NULL, 'E', '2024-01-31 06:29:19');

-- --------------------------------------------------------

--
-- Table structure for table `Users_companies`
--

CREATE TABLE `Users_companies` (
  `company_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `industry` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users_companies`
--

INSERT INTO `Users_companies` (`company_id`, `user_id`, `company_name`, `size`, `type`, `industry`, `created_at`) VALUES
(10, 4, 'DBZ', '45', 'private limited company', 'Information technology', '2024-01-31 07:47:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `connections`
--
ALTER TABLE `connections`
  ADD PRIMARY KEY (`connection_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `Users_companies`
--
ALTER TABLE `Users_companies`
  ADD PRIMARY KEY (`company_id`),
  ADD KEY `Users_companies` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `connections`
--
ALTER TABLE `connections`
  MODIFY `connection_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Users_companies`
--
ALTER TABLE `Users_companies`
  MODIFY `company_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Users_companies`
--
ALTER TABLE `Users_companies`
  ADD CONSTRAINT `Users_companies` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
