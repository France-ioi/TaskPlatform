CREATE TABLE IF NOT EXISTS `tm_platforms` (
  `ID` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `public_key` varchar(500) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY(`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
