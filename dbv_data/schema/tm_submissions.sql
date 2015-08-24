CREATE TABLE `tm_submissions` (
  `ID` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL,
  `idPlatform` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL COMMENT 'Problem''s ID',
  `sDate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `idSourceCode` bigint(20) NOT NULL,
  `bManualCorrection` tinyint(1) NOT NULL DEFAULT '0',
  `bSuccess` tinyint(1) NOT NULL DEFAULT '0',
  `iMinSuccessScore` tinyint(3) NOT NULL DEFAULT '50',
  `nbTestsTotal` tinyint(3) NOT NULL DEFAULT '0',
  `nbTestsPassed` tinyint(3) NOT NULL DEFAULT '0',
  `iScore` tinyint(3) NOT NULL DEFAULT '0',
  `bCompilError` tinyint(1) NOT NULL DEFAULT '0',
  `sCompilMsg` mediumtext,
  `sErrorMsg` mediumtext,
  `sFirstUserOutput` mediumtext,
  `sFirstExpectedOutput` mediumtext,
  `sManualScoreDiffComment` varchar(255),
  `bEvaluated` tinyint(1) NOT NULL DEFAULT '0',
  `bConfirmed` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 when saved for getAnswer, 1 once the grade process starts',
  `sMode` enum('Submitted','LimitedTime','Contest') NOT NULL DEFAULT 'Submitted',
  `iChecksum` int(11) NOT NULL DEFAULT '0',
  `iVersion` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `synchro` (`iVersion`),
  KEY `checksum` (`iChecksum`),
  KEY `date` (`sDate`),
  KEY `idUser` (`idUser`,`idPlatform`),
  KEY `idTask` (`idTask`),
  KEY `userTask` (`idTask`,`idUser`,`idPlatform`),
  KEY `idSourceCode` (`idSourceCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
