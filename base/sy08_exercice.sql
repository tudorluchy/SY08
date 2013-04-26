SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `sy08` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
USE `sy08` ;

-- -----------------------------------------------------
-- Table `sy08`.`sy08_exercice`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sy08`.`sy08_exercice` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `intitule` VARCHAR(255) NOT NULL ,
  `enonce` LONGTEXT NOT NULL ,
  `image` VARCHAR(255) NULL ,
  `difficulte` ENUM('+','++','+++') NOT NULL ,
  `json` LONGTEXT NOT NULL ,
  `rdp` VARCHAR(255) NOT NULL ,
  `date` DATETIME NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
