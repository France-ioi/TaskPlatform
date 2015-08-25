CREATE TABLE `tm_tasks_subtasks` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `iRank` tinyint(3) NOT NULL COMMENT 'position of the subtask in the task',
  `name` varchar(255) NOT NULL,
  `comments` text NOT NULL,
  `iPointsMax` tinyint(11) NOT NULL,
  `iVersion` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `synchro` (`iVersion`),
  KEY `idTask` (`idTask`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
