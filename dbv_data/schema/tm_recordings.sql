CREATE TABLE IF NOT EXISTS `tm_recordings` (
  `ID` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL COMMENT 'user who created the recording',
  `idPlatform` bigint(20) NOT NULL COMMENT 'platform on which the recording was created',
  `idTask` bigint(20) NOT NULL,
  `sDateCreation` DATETIME NOT NULL,
  `sData` mediumtext DEFAULT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY (`idTask`),
  KEY `synchro` (`iVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
