CREATE TABLE IF NOT EXISTS `tm_tasks_strings` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL,
  `sTitle` varchar(100) NOT NULL COMMENT 'title of the task',
  `sTranslator` varchar(100) NOT NULL,
  `sStatement` mediumtext NOT NULL,
  `sSolution` mediumtext NOT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY (`idTask`),
  KEY `idTasksLang` (`idTask`, `sLanguage`),
  KEY `iVersion` (`iVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
