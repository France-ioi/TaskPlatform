CREATE TABLE `tm_solutions_strings` (
  `ID` bigint(20) NOT NULL,
  `idSolution` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL,
  `sTranslator` varchar(50) DEFAULT NULL,
  `sSource` mediumtext NOT NULL,
  `iVersion` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `idSolution` (`idSolution`),
  KEY `idSolutionsLanguage` (`idSolution`, `sLanguage`),
  KEY `synchro` (`iVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
