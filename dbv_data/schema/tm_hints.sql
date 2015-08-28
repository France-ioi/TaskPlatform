CREATE TABLE IF NOT EXISTS `tm_hints` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `iRank` tinyint(11) NOT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY (`idTask`),
  KEY `synchro` (`iVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
