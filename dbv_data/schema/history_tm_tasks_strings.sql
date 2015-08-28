CREATE TABLE IF NOT EXISTS `tm_tasks_strings` (
  `historyID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL,
  `sTitle` varchar(100) NOT NULL,
  `sTranslator` varchar(100) NOT NULL,
  `sStatement` mediumtext NOT NULL,
  `sSolution` mediumtext NOT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0',
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY (`idTask`),
  KEY `idTasksLang` (`idTask`, `sLanguage`),
  KEY `iVersion` (`iVersion`),
  KEY `iNextVersion` (`iNextVersion`),
  KEY `bDeleted` (`bDeleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
