CREATE TABLE `history_tm_submissions_tests` (
  `historyID` bigint(20) NOT NULL AUTO_INCREMENT,
  `id` bigint(20) NOT NULL,
  `idSubmission` bigint(20) NOT NULL DEFAULT '0',
  `idTest` bigint(20) NOT NULL DEFAULT '0',
  `iScore` tinyint(3) NOT NULL DEFAULT '0',
  `iTimeMs` int(11) NOT NULL DEFAULT '0',
  `iMemoryKb` int(11) NOT NULL DEFAULT '0',
  `iErrorCode` int(11) NOT NULL DEFAULT '0',
  `sOutput` mediumtext DEFAULT NULL,
  `sExpectedOutput` mediumtext DEFAULT NULL,
  `idSubmissionSubtask` bigint(20) DEFAULT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`historyID`),
  KEY `iVersion` (`iVersion`),
  KEY `iNextVersion` (`iNextVersion`),
  KEY `bDeleted` (`bDeleted`),
  KEY `idSubmission` (`idSubmission`),
  KEY `idTest` (`idTest`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
