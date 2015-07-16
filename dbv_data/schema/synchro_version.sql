CREATE TABLE `synchro_version` (
  `iVersion` int(11) NOT NULL,
  `iLastServerVersion` int(11) NOT NULL,
  `iLastClientVersion` int(11) NOT NULL,
  UNIQUE KEY `iVersion_2` (`iVersion`),
  KEY `iVersion` (`iVersion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8