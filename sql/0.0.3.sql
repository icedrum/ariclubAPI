ALTER TABLE `trzpalets`   
	ADD COLUMN `estado` INT(11) DEFAULT 0 NULL COMMENT 'Indica el estado del palet sustituyendo a la pérdida del rfid' AFTER `CRFID`;

ALTER TABLE `trz2_bolsas_confeccion`   
	ADD COLUMN `numkilos` INT(11) NULL AFTER `fecha`,
	ADD COLUMN `numcajones` FLOAT NULL AFTER `numkilos`,
	ADD COLUMN `codvarie` INT(11) NULL AFTER `numcajones`,
	ADD COLUMN `codsocio` INT(11) NULL AFTER `codvarie`,
	ADD COLUMN `codcampo` INT(11) NULL AFTER `codsocio`;

CREATE TABLE `trz2_palets_traza` (  
  `paletTrazaId` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del registro',
  `numpalet` INT(6) UNSIGNED COMMENT 'Palet confeccionado',
  `idpalet` INT(11) UNSIGNED COMMENT 'Palet entrado con el que guarda relacion',
  `kilos` FLOAT COMMENT 'Kilos atribuibles a la relacion',
  `codsocio` INT(11) COMMENT 'Socio del que se hizo la entrada',
  `codcampo` INT(11) COMMENT 'Campo específico del que biene la mercancía',
  PRIMARY KEY (`paletTrazaId`) ,
  CONSTRAINT `ref_palet_confeccionado` FOREIGN KEY (`numpalet`) REFERENCES `palets`(`numpalet`),
  CONSTRAINT `ref_palet_entrado` FOREIGN KEY (`idpalet`) REFERENCES `trzpalets`(`idpalet`)
);
ALTER TABLE `palets`   
	ADD COLUMN `cerrado` TINYINT(1) DEFAULT 0 NULL COMMENT 'Indica si desde el punto de vista de confeccion el palet está cerrado' AFTER `noacabado`;

CREATE TABLE `trz2_destrios` (  
  `destrioId` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de registro',
  `linea` INT(11) COMMENT 'Linea de confección de la que procede el destrio',
  `idpalet` INT(11) UNSIGNED COMMENT 'Identificador del palet de entrada que da origen al destrio.',
  `tipo` INT(11) COMMENT 'Tipo del palet de entrada.',
  `fecha` DATETIME COMMENT 'Fecha en la que se envía a destrio',
  `numkilos` INT(11) COMMENT 'Kilos enviados a destrio',
  `codvarie` INT(6) UNSIGNED COMMENT 'Código de la variedad',
  `codsocio` INT(6) UNSIGNED COMMENT 'Código del socio que hizo la entrada',
  `codcampo` INT(6) UNSIGNED COMMENT 'Código del campo del que provenía el producto',
  PRIMARY KEY (`destrioId`) ,
  CONSTRAINT `ref_destrio_linea` FOREIGN KEY (`linea`) REFERENCES `trzlineas_confeccion`(`codlinconfe`),
  CONSTRAINT `ref_destrio_idpalet` FOREIGN KEY (`idpalet`) REFERENCES `trzpalets`(`idpalet`),
  CONSTRAINT `ref_destrio_variedad` FOREIGN KEY (`codvarie`) REFERENCES `variedades`(`codvarie`),
  CONSTRAINT `ref_destrio_socio` FOREIGN KEY (`codsocio`) REFERENCES `rsocios`(`codsocio`),
  CONSTRAINT `ref_destrio_campo` FOREIGN KEY (`codcampo`) REFERENCES `rcampos`(`codcampo`)
);
