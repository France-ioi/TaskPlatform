CREATE TABLE `history_tm_submissions_subtasks` (
  `historyID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID` bigint(20) NOT NULL,
  `bSuccess` tinyint(1) NOT NULL,
  `iScore` tinyint(3) NOT NULL,
  `idSubtask` bigint(20) NOT NULL,
  `idSubmission` bigint(20) NOT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`historyID`),
  KEY `iVersion` (`iVersion`),
  KEY `iNextVersion` (`iNextVersion`),
  KEY `bDeleted` (`bDeleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
