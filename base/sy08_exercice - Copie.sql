SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `wsy08` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
USE `wsy08` ;

-- -----------------------------------------------------
-- Table `sy08`.`sy08_exercice`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wsy08`.`sy08_exercice` ;

CREATE  TABLE IF NOT EXISTS `wsy08`.`sy08_exercice` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `intitule` VARCHAR(255) NOT NULL ,
  `enonce` LONGTEXT NOT NULL ,
  `actif` TINYINT(1) NOT NULL ,
  `image` VARCHAR(255) NULL ,
  `fichier` VARCHAR(255) NULL ,
  `difficulte` ENUM('+','++','+++') NOT NULL ,
  `json` LONGTEXT NOT NULL ,
  `date` DATETIME NULL ,
  `nb_effectue` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sy08`.`sy08_user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wsy08`.`sy08_user` ;

CREATE  TABLE IF NOT EXISTS `wsy08`.`sy08_user` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `login` VARCHAR(255) NOT NULL ,
  `mdp` VARCHAR(255) NOT NULL ,
  `admin` TINYINT(1) NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;

USE `wsy08` ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
