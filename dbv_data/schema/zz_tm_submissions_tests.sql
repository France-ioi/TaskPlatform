CREATE TABLE `tm_submissions_tests` (
  `ID` bigint(20) NOT NULL,
  `idSubmission` bigint(20) NOT NULL DEFAULT '0',
  `idTest` bigint(20) NOT NULL DEFAULT '0',
  `iScore` tinyint(3) NOT NULL DEFAULT '0',
  `iTimeMs` int(11) NOT NULL DEFAULT '0',
  `iMemoryKb` int(11) NOT NULL DEFAULT '0',
  `iErrorCode` int(11) NOT NULL DEFAULT '0',
  `sOutput` mediumtext DEFAULT NULL,
  `sExpectedOutput` mediumtext DEFAULT NULL,
  `iVersion` int(11) NOT NULL,
  `idSubmissionSubtask` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `synchro` (`iVersion`),
  KEY `idSubmission` (`idSubmission`),
  UNIQUE KEY `idSubmissionTest` (`idSubmission`, `idTest`),
  KEY `idTest` (`idTest`),
  CONSTRAINT `tm_submissions_tests_ibfk_1` FOREIGN KEY (`idTest`) REFERENCES `tm_tasks_tests` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8
