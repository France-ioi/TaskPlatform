CREATE TABLE IF NOT EXISTS `tm_tasks_limits` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sLangProg` varchar(255) NOT NULL DEFAULT '*',
  `iMaxTime` int(11) NOT NULL DEFAULT '10000' COMMENT 'max allowed time in ms',
  `iMaxMemory` int(11) NOT NULL COMMENT 'max allowed memory in kb',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
