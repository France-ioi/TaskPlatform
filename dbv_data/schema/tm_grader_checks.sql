CREATE TABLE `tm_grader_checks` (
  `ID` bigint(20) NOT NULL,
  `sDescription` mediumtext NOT NULL COMMENT 'TODO',
  `idTask` bigint(20) DEFAULT NULL COMMENT 'TODO',
  `sParams` tinytext NOT NULL COMMENT 'TODO',
  `sSource` mediumtext NOT NULL COMMENT 'TODO',
  `sTestData` mediumtext NOT NULL COMMENT 'TODO',
  `iVersion` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `synchro` (`iVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
