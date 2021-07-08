CREATE TABLE natural_ariagro.trz2_bolsas_confeccion (
  bolsaConfeccionId INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del registro',
  linea INT(11) DEFAULT NULL COMMENT 'Línea por la que se ha producido el abocamiento',
  idpalet INT(11) UNSIGNED DEFAULT NULL COMMENT 'Identificar del palet que fué abocado',
  tipo INT(11) DEFAULT NULL,
  fecha DATETIME DEFAULT NULL,
  PRIMARY KEY (bolsaConfeccionId)
)
ENGINE = INNODB,
CHARACTER SET latin1,
COLLATE latin1_swedish_ci;

ALTER TABLE natural_ariagro.trz2_bolsas_confeccion 
  ADD CONSTRAINT ref_linea FOREIGN KEY (linea)
    REFERENCES natural_ariagro.trzlineas_confeccion(codlinconfe);

ALTER TABLE natural_ariagro.trz2_bolsas_confeccion 
  ADD CONSTRAINT ref_palet FOREIGN KEY (idpalet)
    REFERENCES natural_ariagro.trzpalets(idpalet);