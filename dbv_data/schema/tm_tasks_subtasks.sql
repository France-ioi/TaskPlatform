CREATE TABLE `tm_tasks_subtasks` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `comments` text NOT NULL,
  `iPointsMax` int(11) NOT NULL,
  `weighting` int(11) NOT NULL,
  `iVersion` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
