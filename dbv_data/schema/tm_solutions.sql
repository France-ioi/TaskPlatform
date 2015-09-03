CREATE TABLE `tm_solutions` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `bInSolution` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'solution is in the solution part of the task',
  `sLangProg` varchar(10) NOT NULL,
  `sGroup` varchar(50) NOT NULL,
  `sAuthor` varchar(50) NOT NULL,
  `iVersion` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `idTask` (`idTask`),
  KEY `synchro` (`iVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
