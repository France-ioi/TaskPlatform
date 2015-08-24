CREATE TABLE `tm_submissions_subtasks` (
  `ID` bigint(20) NOT NULL,
  `bSuccess` tinyint(1) NOT NULL,
  `iScore` tinyint(3) NOT NULL,
  `idSubtask` bigint(20) NOT NULL,
  `idSubmission` bigint(20) NOT NULL,
  `iVersion` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `synchro` (`iVersion`),
  KEY `idSubtask` (`idSubtask`),
  KEY `idSubmission` (`idSubmission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
