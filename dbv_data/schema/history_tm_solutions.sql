CREATE TABLE `history_tm_solutions` (
  `historyID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `bInSolution` tinyint(1) NOT NULL DEFAULT 0,
  `sLangProg` varchar(10) NOT NULL,
  `sGroup` varchar(50) DEFAULT NULL,
  `sAuthor` varchar(50) NOT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`historyID`),
  KEY `idTask` (`idTask`),
  KEY `iVersion` (`iVersion`),
  KEY `iNextVersion` (`iNextVersion`),
  KEY `bDeleted` (`bDeleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
