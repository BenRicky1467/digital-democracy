-- MySQL dump 10.13  Distrib 9.3.0, for Linux (x86_64)
--
-- Host: localhost    Database: digital_democracy
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `faculty` varchar(100) NOT NULL,
  `election_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `election_id` (`election_id`),
  CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`election_id`) REFERENCES `elections` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (37,'FRANCLIN SAINT','ALL',33),(38,'ISAK ALEX','ALL',33);
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elections`
--

DROP TABLE IF EXISTS `elections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `election_date` datetime NOT NULL,
  `faculty` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elections`
--

LOCK TABLES `elections` WRITE;
/*!40000 ALTER TABLE `elections` DISABLE KEYS */;
INSERT INTO `elections` VALUES (33,'Babylon','all of em','2025-05-17 20:27:00','ALL','2025-05-17 17:27:33');
/*!40000 ALTER TABLE `elections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `faculty` varchar(50) NOT NULL,
  `role` varchar(50) DEFAULT 'voter',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Joh Ricky','johricky6677@gmail.com','$2b$10$5jd7ScuY4rhQJbC8TwnFv.tvcg9W0.5N.MsFTpECQGKwWGBAO94..','BCS','voter'),(2,'Bryce Dominic','brayce@gmail.com','$2b$10$mXl10wViM47/IJqmXdRmnebZPGCN.xLOYmePnlWTcBtrpRrm1I7EK','BAED','voter'),(3,'Ben Ricky','bericky6677@gmail.com','$2b$10$em3A5GrpVdDLLBdYp.4h7.0H/8YAatZIQTiwbF0F.tIl364bZKgCq','BCS','voter'),(4,'sharon duki','shrn@gmail.com','$2b$10$RhXR449KjEKdvGnaLCooGOBf5KeI9ulX1HI0RLbiCRcJVwDNijNBO','BFIT','voter'),(5,'Test User','testuser@gmail.com','$2b$10$51Yd5MkV5v.D4trlqiwSCuSX2mbHOVhuskHSDN0mTtKvskCCNIsk6','LAW','voter'),(6,'Junior Doll','jr@gmail.com','$2b$10$6SkEaPqISvQlPNYGL0eKjOh5fz7iSIdl1lQwHixQxzSfvKn7ChB8q','LAW','voter'),(7,'Angel Pesambili','angel2@gmail.com','$2b$10$JD0x.CRi.LLL0vRvPqtZR.lIGud4OQnlT1pddKvWl6sHQuhV.3iJC','BFIT','voter'),(8,'RICK ISAK','rickyisak14@gmail.com','$2b$10$dVPYp7e.e3PV5GXpHCWj5eejDE7UkjrObb8xSi7f5bXe8sUiQ6.Ay','BCS','admin'),(9,'DERIC MSHANA ','deric@gmail.com','$2b$10$AkpOZuQfRbYxSwScNX.3SOs3/XEQQuhhaoc7dTBnk24qbcSEEya3O','LAW','voter'),(10,'Luois  mnyagat','mnyagat@gmail.com','$2b$10$lCQaNQXAaYOdRnVXlFXUj.LdjT61wvp09xqWY0BS2mR1IlCOZbYNa','LAW','voter'),(11,'moby gidion','gidion@gmail.com','$2b$10$FSTkxGdfD.0bKnvKPlm5we66xYZniwI5cfinGMHdDkRFT4zqoo8Dq','BAED','voter'),(12,'Isak Alex','isak@gmail.com','$2b$10$ovzWLRzW.GPVVi38PIiOXuwEm9Za1snNgmOAYCK63l8Kzr8aTML2m','BCS','voter');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `votes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `candidate_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `election_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (7,4,37,'2025-05-17 17:36:36',33);
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-06  6:54:21
