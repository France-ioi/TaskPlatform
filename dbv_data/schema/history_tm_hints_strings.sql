CREATE TABLE IF NOT EXISTS `history_tm_hints_strings` (
  `historyID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID` bigint(20) NOT NULL,
  `idHint` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL DEFAULT 'fr',
  `sTranslator` varchar(100) NOT NULL,
  `sContent` mediumtext NOT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0',
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`historyID`),
  KEY `idHint` (`idHint`),
  KEY `idHintsLanguage` (`idHint`, `sLanguage`),
  KEY `synchro` (`iVersion`),
  KEY `iNextVersion` (`iNextVersion`),
  KEY `bDeleted` (`bDeleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
