CREATE TABLE `history_tm_solutions_strings` (
  `historyID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID` bigint(20) NOT NULL,
  `idSolution` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL,
  `sTranslator` varchar(50) DEFAULT NULL,
  `sSource` mediumtext NOT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`historyID`),
  KEY `idSolution` (`idSolution`),
  KEY `idSolutionsLanguage` (`idSolution`, `sLanguage`),
  KEY `iVersion` (`iVersion`),
  KEY `iNextVersion` (`iNextVersion`),
  KEY `bDeleted` (`bDeleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
