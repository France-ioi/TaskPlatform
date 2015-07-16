CREATE TABLE `history_tm_tasks_subtasks` (
  `historyID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL COMMENT 'Problem''s ID',
  `name` varchar(255) NOT NULL,
  `comments` text NOT NULL,
  `iPointsMax` int(11) NOT NULL,
  `weighting` int(11) NOT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`historyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
