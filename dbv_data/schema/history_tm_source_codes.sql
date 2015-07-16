CREATE TABLE IF NOT EXISTS `history_tm_source_codes` (
  `historyID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sDate` datetime NOT NULL,
  `sLangProg` varchar(30) DEFAULT NULL,
  `sName` varchar(250) NOT NULL,
  `sSource` mediumtext NOT NULL,
  `bEditable` tinyint(4) NOT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`historyID`),
  KEY `recordID` (`ID`),
  KEY `iVersion` (`iVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
