CREATE TABLE IF NOT EXISTS `tm_remote_secret` (
  `idUser` bigint(20) NOT NULL,
  `idPlatform` bigint(20) NOT NULL,
  `sRemoteSecret` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `tm_remote_secret`
 ADD PRIMARY KEY (`idUser`,`idPlatform`);
