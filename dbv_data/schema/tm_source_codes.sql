CREATE TABLE `tm_source_codes` (
  `ID` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL,
  `idPlatform` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sDate` datetime NOT NULL,
  `sParams` tinytext DEFAULT NULL,
  `sName` varchar(250) NOT NULL,
  `sSource` mediumtext NOT NULL,
  `bEditable` tinyint(1) NOT NULL,
  `bSubmission` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'corresponds to a submission, not fetched by editor',
  `bActive` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'is active tab',
  `iVersion` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `UserTask` (`idUser`,`idTask`,`idPlatform`),
  KEY `idTask` (`idTask`),
  KEY `synchro` (`iVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
