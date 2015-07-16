CREATE TABLE `tm_submissions_subtasks` (
  `ID` bigint(20) NOT NULL,
  `iSuccess` int(11) NOT NULL,
  `iScore` int(11) NOT NULL,
  `idSubtask` bigint(20) NOT NULL,
  `idSubmission` bigint(20) NOT NULL,
  `iVersion` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
