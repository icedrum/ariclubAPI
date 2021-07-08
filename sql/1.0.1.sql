ALTER TABLE `trz2_bolsas_confeccion`   
  ADD  UNIQUE INDEX `idx_linea_palet` (`linea` , `idpalet`);

ALTER TABLE `trz2_bolsas_confeccion`   
  ADD  UNIQUE INDEX `idx_idpalet` (`idpalet`);
