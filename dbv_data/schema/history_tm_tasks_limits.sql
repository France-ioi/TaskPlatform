CREATE TABLE IF NOT EXISTS `history_tm_tasks_limits` (
  `historyID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sLangProg` varchar(255) NOT NULL DEFAULT '*',
  `iMaxTime` int(11) NOT NULL DEFAULT '10000' COMMENT 'max allowed time in ms',
  `iMaxMemory` int(11) NOT NULL COMMENT 'max allowed memory in kb',
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`historyID`),
  KEY `idTask` (`idTask`),
  KEY `iVersion` (`iVersion`),
  KEY `iNextVersion` (`iNextVersion`),
  KEY `bDeleted` (`bDeleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
