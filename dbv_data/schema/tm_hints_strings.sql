CREATE TABLE IF NOT EXISTS `tm_hints_strings` (
  `ID` bigint(20) NOT NULL,
  `idHint` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL DEFAULT 'fr',
  `sTranslator` varchar(100) NOT NULL,
  `sContent` mediumtext NOT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `idHint` (`idHint`),
  UNIQUE KEY `idHintsLanguage` (`idHint`, `sLanguage`),
  KEY `synchro` (`iVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
