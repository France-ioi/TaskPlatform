CREATE TABLE IF NOT EXISTS `tm_platforms` (
  `ID` bigint(20) NOT NULL,
  `uri` varchar(255) NOT NULL,
  `pc_key` varchar(200) NOT NULL,
  `pv_key` varchar(200) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY(`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
