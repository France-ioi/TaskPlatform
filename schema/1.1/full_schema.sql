--
-- Table structure for table `error_log`
--

CREATE TABLE IF NOT EXISTS `error_log` (
`ID` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `message` longtext NOT NULL,
  `browser` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_hints`
--

CREATE TABLE IF NOT EXISTS `history_tm_hints` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `iRank` tinyint(11) NOT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0',
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_hints_strings`
--

CREATE TABLE IF NOT EXISTS `history_tm_hints_strings` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idHint` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL DEFAULT 'fr',
  `sTranslator` varchar(100) NOT NULL,
  `sContent` mediumtext NOT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0',
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_recordings`
--

CREATE TABLE IF NOT EXISTS `history_tm_recordings` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL,
  `idPlatform` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sData` mediumtext,
  `sDateCreation` datetime NOT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_solutions`
--

CREATE TABLE IF NOT EXISTS `history_tm_solutions` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `bInSolution` tinyint(1) NOT NULL DEFAULT '0',
  `sLangProg` varchar(10) NOT NULL,
  `sGroup` varchar(50) DEFAULT NULL,
  `sAuthor` varchar(50) NOT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_solutions_strings`
--

CREATE TABLE IF NOT EXISTS `history_tm_solutions_strings` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idSolution` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL,
  `sTranslator` varchar(50) DEFAULT NULL,
  `sSource` mediumtext NOT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_source_codes`
--

CREATE TABLE IF NOT EXISTS `history_tm_source_codes` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL,
  `idPlatform` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sDate` datetime NOT NULL,
  `sParams` tinytext,
  `sName` varchar(250) NOT NULL,
  `sSource` mediumtext NOT NULL,
  `bEditable` tinyint(1) NOT NULL,
  `bSubmission` tinyint(1) NOT NULL,
  `sType` enum('User','Submission','Task','Solution','Hint') NOT NULL DEFAULT 'User',
  `bActive` tinyint(1) NOT NULL DEFAULT '0',
  `iRank` tinyint(2) NOT NULL DEFAULT '0',
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=15357 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_submissions`
--

CREATE TABLE IF NOT EXISTS `history_tm_submissions` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL,
  `idPlatform` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL COMMENT 'Problem''s ID',
  `sDate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `idSourceCode` bigint(20) NOT NULL,
  `bManualCorrection` tinyint(4) NOT NULL DEFAULT '0',
  `bSuccess` tinyint(4) NOT NULL DEFAULT '0',
  `nbTestsTotal` int(11) NOT NULL DEFAULT '0',
  `nbTestsPassed` int(11) NOT NULL DEFAULT '0',
  `iScore` int(11) NOT NULL DEFAULT '0',
  `bCompilError` tinyint(4) NOT NULL DEFAULT '0',
  `sCompilMsg` mediumtext,
  `sErrorMsg` mediumtext,
  `sFirstUserOutput` mediumtext,
  `sFirstExpectedOutput` mediumtext,
  `sManualScoreDiffComment` varchar(255) DEFAULT NULL,
  `bEvaluated` tinyint(4) NOT NULL DEFAULT '0',
  `bConfirmed` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 when saved for getAnswer, 1 once the grade process starts',
  `sMode` enum('Submitted','LimitedTime','Contest','UserTest') NOT NULL DEFAULT 'Submitted',
  `sReturnUrl` varchar(255) DEFAULT NULL,
  `idUserAnswer` varchar(50) DEFAULT NULL,
  `iChecksum` int(11) NOT NULL DEFAULT '0',
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9061 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_submissions_subtasks`
--

CREATE TABLE IF NOT EXISTS `history_tm_submissions_subtasks` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `bSuccess` tinyint(1) NOT NULL,
  `iScore` tinyint(3) NOT NULL,
  `idSubtask` bigint(20) NOT NULL,
  `idSubmission` bigint(20) NOT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_submissions_tests`
--

CREATE TABLE IF NOT EXISTS `history_tm_submissions_tests` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idSubmission` bigint(20) NOT NULL DEFAULT '0',
  `idTest` bigint(20) NOT NULL DEFAULT '0',
  `iScore` tinyint(3) NOT NULL DEFAULT '0',
  `iTimeMs` int(11) NOT NULL DEFAULT '0',
  `iMemoryKb` int(11) NOT NULL DEFAULT '0',
  `iErrorCode` int(11) NOT NULL DEFAULT '0',
  `sOutput` mediumtext,
  `sExpectedOutput` mediumtext,
  `sErrorMsg` mediumtext,
  `sLog` mediumtext,
  `bNoFeedback` tinyint(1) NOT NULL DEFAULT '0',
  `jFiles` mediumtext,
  `idSubmissionSubtask` bigint(20) DEFAULT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2336 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_tasks`
--

CREATE TABLE IF NOT EXISTS `history_tm_tasks` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `sTextId` varchar(100) NOT NULL,
  `sSupportedLangProg` varchar(255) NOT NULL DEFAULT '*',
  `sEvalTags` varchar(255) NOT NULL DEFAULT '',
  `sAuthor` varchar(100) NOT NULL,
  `sAuthorSolution` varchar(100) NOT NULL,
  `bShowLimits` tinyint(1) NOT NULL DEFAULT '1',
  `bEditorInStatement` tinyint(1) NOT NULL DEFAULT '0',
  `bUserTests` tinyint(1) NOT NULL DEFAULT '1',
  `bChecked` tinyint(1) NOT NULL DEFAULT '0',
  `iEvalMode` tinyint(1) NOT NULL DEFAULT '0',
  `bUsesLibrary` tinyint(1) NOT NULL,
  `bUseLatex` tinyint(1) NOT NULL DEFAULT '0',
  `iTestsMinSuccessScore` tinyint(3) NOT NULL DEFAULT '100',
  `bIsEvaluable` tinyint(1) NOT NULL DEFAULT '1',
  `sTemplateName` varchar(100) NOT NULL DEFAULT '',
  `sScriptAnimation` text,
  `sDefaultEditorMode` enum('simple','normal','expert','') NOT NULL DEFAULT 'normal',
  `sEvalResultOutputScript` varchar(50) DEFAULT NULL,
  `bTestMode` tinyint(1) NOT NULL DEFAULT '0',
  `sTaskPath` varchar(100) NOT NULL COMMENT 'taskPath as documented in taskgrader',
  `sRevision` varchar(100) DEFAULT NULL,
  `sAssetsBaseUrl` varchar(250) DEFAULT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_tasks_limits`
--

CREATE TABLE IF NOT EXISTS `history_tm_tasks_limits` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sLangProg` varchar(255) NOT NULL DEFAULT '*',
  `iMaxTime` int(11) NOT NULL DEFAULT '10000' COMMENT 'max allowed time in ms',
  `iMaxMemory` int(11) NOT NULL COMMENT 'max allowed memory in kb',
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=652 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_tasks_strings`
--

CREATE TABLE IF NOT EXISTS `history_tm_tasks_strings` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL,
  `sTitle` varchar(100) NOT NULL,
  `sTranslator` varchar(100) NOT NULL,
  `sStatement` mediumtext NOT NULL,
  `sSolution` mediumtext,
  `iVersion` int(11) NOT NULL DEFAULT '0',
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=381 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_tasks_subtasks`
--

CREATE TABLE IF NOT EXISTS `history_tm_tasks_subtasks` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `iRank` tinyint(3) NOT NULL,
  `name` varchar(255) NOT NULL,
  `comments` text NOT NULL,
  `iPointsMax` tinyint(11) NOT NULL,
  `iVersion` int(11) NOT NULL,
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `history_tm_tasks_tests`
--

CREATE TABLE IF NOT EXISTS `history_tm_tasks_tests` (
`historyID` bigint(20) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `idSubtask` bigint(20) DEFAULT NULL,
  `idSubmission` bigint(20) DEFAULT NULL,
  `sGroupType` enum('Example','User','Evaluation','Submission') NOT NULL DEFAULT 'User',
  `idUser` bigint(20) DEFAULT NULL,
  `idPlatform` bigint(20) DEFAULT NULL,
  `iRank` tinyint(3) NOT NULL DEFAULT '0',
  `bActive` tinyint(1) NOT NULL DEFAULT '0',
  `sName` varchar(100) NOT NULL,
  `sInput` mediumtext,
  `sOutput` mediumtext,
  `iVersion` int(11) NOT NULL DEFAULT '0',
  `iNextVersion` int(11) DEFAULT NULL,
  `bDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `synchro_version`
--

CREATE TABLE IF NOT EXISTS `synchro_version` (
  `iVersion` int(11) NOT NULL,
  `iLastServerVersion` int(11) NOT NULL,
  `iLastClientVersion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tm_grader_checks`
--

CREATE TABLE IF NOT EXISTS `tm_grader_checks` (
  `ID` bigint(20) NOT NULL,
  `sDescription` mediumtext NOT NULL COMMENT 'TODO',
  `idTask` bigint(20) DEFAULT NULL COMMENT 'TODO',
  `sParams` tinytext NOT NULL COMMENT 'TODO',
  `sSource` mediumtext NOT NULL COMMENT 'TODO',
  `sTestData` mediumtext NOT NULL COMMENT 'TODO',
  `iVersion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tm_hints`
--

CREATE TABLE IF NOT EXISTS `tm_hints` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `iRank` tinyint(11) NOT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_hints`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_hints` AFTER INSERT ON `tm_hints`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_hints` (`ID`,`iVersion`,`idTask`,`iRank`) VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`iRank`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_hints` BEFORE DELETE ON `tm_hints`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_hints` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_hints` (`ID`,`iVersion`,`idTask`,`iRank`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idTask`,OLD.`iRank`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_hints` BEFORE INSERT ON `tm_hints`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_hints` BEFORE UPDATE ON `tm_hints`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idTask` <=> NEW.`idTask` AND OLD.`iRank` <=> NEW.`iRank`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_hints` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_hints` (`ID`,`iVersion`,`idTask`,`iRank`)       VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`iRank`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_hints_strings`
--

CREATE TABLE IF NOT EXISTS `tm_hints_strings` (
  `ID` bigint(20) NOT NULL,
  `idHint` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL DEFAULT 'fr',
  `sTranslator` varchar(100) NOT NULL,
  `sContent` mediumtext NOT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_hints_strings`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_hints_strings` AFTER INSERT ON `tm_hints_strings`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_hints_strings` (`ID`,`iVersion`,`idHint`,`sLanguage`,`sTranslator`,`sContent`) VALUES (NEW.`ID`,@curVersion,NEW.`idHint`,NEW.`sLanguage`,NEW.`sTranslator`,NEW.`sContent`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_hints_strings` BEFORE DELETE ON `tm_hints_strings`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_hints_strings` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_hints_strings` (`ID`,`iVersion`,`idHint`,`sLanguage`,`sTranslator`,`sContent`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idHint`,OLD.`sLanguage`,OLD.`sTranslator`,OLD.`sContent`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_hints_strings` BEFORE INSERT ON `tm_hints_strings`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_hints_strings` BEFORE UPDATE ON `tm_hints_strings`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idHint` <=> NEW.`idHint` AND OLD.`sLanguage` <=> NEW.`sLanguage` AND OLD.`sTranslator` <=> NEW.`sTranslator` AND OLD.`sContent` <=> NEW.`sContent`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_hints_strings` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_hints_strings` (`ID`,`iVersion`,`idHint`,`sLanguage`,`sTranslator`,`sContent`)       VALUES (NEW.`ID`,@curVersion,NEW.`idHint`,NEW.`sLanguage`,NEW.`sTranslator`,NEW.`sContent`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_platforms`
--

CREATE TABLE IF NOT EXISTS `tm_platforms` (
  `ID` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `public_key` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tm_recordings`
--

CREATE TABLE IF NOT EXISTS `tm_recordings` (
  `ID` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL COMMENT 'user who created the recording',
  `idPlatform` bigint(20) NOT NULL COMMENT 'platform on which the recording was created',
  `idTask` bigint(20) NOT NULL,
  `sDateCreation` datetime NOT NULL,
  `sData` mediumtext,
  `iVersion` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_recordings`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_recordings` AFTER INSERT ON `tm_recordings`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_recordings` (`ID`,`iVersion`,`idTask`,`idUser`,`idPlatform`,`sData`,`sDateCreation`) VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`idUser`,NEW.`idPlatform`,NEW.`sData`,NEW.`sDateCreation`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_recordings` BEFORE DELETE ON `tm_recordings`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_recordings` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_recordings` (`ID`,`iVersion`,`idTask`,`idUser`,`idPlatform`,`sData`,`sDateCreation`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idTask`,OLD.`idUser`,OLD.`idPlatform`,OLD.`sData`,OLD.`sDateCreation`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_recordings` BEFORE INSERT ON `tm_recordings`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_recordings` BEFORE UPDATE ON `tm_recordings`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idTask` <=> NEW.`idTask` AND OLD.`idUser` <=> NEW.`idUser` AND OLD.`idPlatform` <=> NEW.`idPlatform` AND OLD.`sData` <=> NEW.`sData` AND OLD.`sDateCreation` <=> NEW.`sDateCreation`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_recordings` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_recordings` (`ID`,`iVersion`,`idTask`,`idUser`,`idPlatform`,`sData`,`sDateCreation`)       VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`idUser`,NEW.`idPlatform`,NEW.`sData`,NEW.`sDateCreation`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_remote_secret`
--

CREATE TABLE IF NOT EXISTS `tm_remote_secret` (
  `idUser` bigint(20) NOT NULL,
  `idPlatform` bigint(20) NOT NULL,
  `sRemoteSecret` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tm_solutions`
--

CREATE TABLE IF NOT EXISTS `tm_solutions` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `bInSolution` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'solution is in the solution part of the task',
  `sLangProg` varchar(10) NOT NULL,
  `sGroup` varchar(50) NOT NULL,
  `sAuthor` varchar(50) NOT NULL,
  `iVersion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_solutions`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_solutions` AFTER INSERT ON `tm_solutions`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_solutions` (`ID`,`iVersion`,`idTask`,`bInSolution`,`sLangProg`,`sGroup`,`sAuthor`) VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`bInSolution`,NEW.`sLangProg`,NEW.`sGroup`,NEW.`sAuthor`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_solutions` BEFORE DELETE ON `tm_solutions`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_solutions` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_solutions` (`ID`,`iVersion`,`idTask`,`bInSolution`,`sLangProg`,`sGroup`,`sAuthor`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idTask`,OLD.`bInSolution`,OLD.`sLangProg`,OLD.`sGroup`,OLD.`sAuthor`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_solutions` BEFORE INSERT ON `tm_solutions`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_solutions` BEFORE UPDATE ON `tm_solutions`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idTask` <=> NEW.`idTask` AND OLD.`bInSolution` <=> NEW.`bInSolution` AND OLD.`sLangProg` <=> NEW.`sLangProg` AND OLD.`sGroup` <=> NEW.`sGroup` AND OLD.`sAuthor` <=> NEW.`sAuthor`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_solutions` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_solutions` (`ID`,`iVersion`,`idTask`,`bInSolution`,`sLangProg`,`sGroup`,`sAuthor`)       VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`bInSolution`,NEW.`sLangProg`,NEW.`sGroup`,NEW.`sAuthor`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_solutions_strings`
--

CREATE TABLE IF NOT EXISTS `tm_solutions_strings` (
  `ID` bigint(20) NOT NULL,
  `idSolution` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL,
  `sTranslator` varchar(50) DEFAULT NULL,
  `sSource` mediumtext NOT NULL,
  `iVersion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_solutions_strings`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_solutions_strings` AFTER INSERT ON `tm_solutions_strings`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_solutions_strings` (`ID`,`iVersion`,`idSolution`,`sLanguage`,`sTranslator`,`sSource`) VALUES (NEW.`ID`,@curVersion,NEW.`idSolution`,NEW.`sLanguage`,NEW.`sTranslator`,NEW.`sSource`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_solutions_strings` BEFORE DELETE ON `tm_solutions_strings`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_solutions_strings` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_solutions_strings` (`ID`,`iVersion`,`idSolution`,`sLanguage`,`sTranslator`,`sSource`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idSolution`,OLD.`sLanguage`,OLD.`sTranslator`,OLD.`sSource`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_solutions_strings` BEFORE INSERT ON `tm_solutions_strings`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_solutions_strings` BEFORE UPDATE ON `tm_solutions_strings`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idSolution` <=> NEW.`idSolution` AND OLD.`sLanguage` <=> NEW.`sLanguage` AND OLD.`sTranslator` <=> NEW.`sTranslator` AND OLD.`sSource` <=> NEW.`sSource`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_solutions_strings` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_solutions_strings` (`ID`,`iVersion`,`idSolution`,`sLanguage`,`sTranslator`,`sSource`)       VALUES (NEW.`ID`,@curVersion,NEW.`idSolution`,NEW.`sLanguage`,NEW.`sTranslator`,NEW.`sSource`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_source_codes`
--

CREATE TABLE IF NOT EXISTS `tm_source_codes` (
  `ID` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL,
  `idPlatform` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sDate` datetime NOT NULL,
  `sParams` tinytext,
  `sName` varchar(250) NOT NULL,
  `sSource` text NOT NULL,
  `bEditable` tinyint(1) NOT NULL,
  `bSubmission` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'corresponds to a submission, not fetched by editor',
  `sType` enum('User','Submission','Task','Solution','Hint') NOT NULL DEFAULT 'User',
  `bActive` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'is active tab',
  `iRank` tinyint(2) NOT NULL DEFAULT '0' COMMENT 'rank in editor tabs',
  `iVersion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_source_codes`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_source_codes` AFTER INSERT ON `tm_source_codes`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_source_codes` (`ID`,`iVersion`,`idUser`,`idTask`,`idPlatform`,`sDate`,`sParams`,`sName`,`sSource`,`bEditable`,`sType`,`bActive`,`bSubmission`,`iRank`) VALUES (NEW.`ID`,@curVersion,NEW.`idUser`,NEW.`idTask`,NEW.`idPlatform`,NEW.`sDate`,NEW.`sParams`,NEW.`sName`,NEW.`sSource`,NEW.`bEditable`,NEW.`sType`,NEW.`bActive`,NEW.`bSubmission`,NEW.`iRank`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_source_codes` BEFORE DELETE ON `tm_source_codes`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_source_codes` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_source_codes` (`ID`,`iVersion`,`idUser`,`idTask`,`idPlatform`,`sDate`,`sParams`,`sName`,`sSource`,`bEditable`,`sType`,`bActive`,`bSubmission`,`iRank`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idUser`,OLD.`idTask`,OLD.`idPlatform`,OLD.`sDate`,OLD.`sParams`,OLD.`sName`,OLD.`sSource`,OLD.`bEditable`,OLD.`sType`,OLD.`bActive`,OLD.`bSubmission`,OLD.`iRank`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_source_codes` BEFORE INSERT ON `tm_source_codes`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_source_codes` BEFORE UPDATE ON `tm_source_codes`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idUser` <=> NEW.`idUser` AND OLD.`idTask` <=> NEW.`idTask` AND OLD.`idPlatform` <=> NEW.`idPlatform` AND OLD.`sDate` <=> NEW.`sDate` AND OLD.`sParams` <=> NEW.`sParams` AND OLD.`sName` <=> NEW.`sName` AND OLD.`sSource` <=> NEW.`sSource` AND OLD.`bEditable` <=> NEW.`bEditable` AND OLD.`sType` <=> NEW.`sType` AND OLD.`bSubmission` <=> NEW.`bSubmission` AND OLD.`iRank` <=> NEW.`iRank`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_source_codes` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_source_codes` (`ID`,`iVersion`,`idUser`,`idTask`,`idPlatform`,`sDate`,`sParams`,`sName`,`sSource`,`bEditable`,`sType`,`bActive`,`bSubmission`,`iRank`)       VALUES (NEW.`ID`,@curVersion,NEW.`idUser`,NEW.`idTask`,NEW.`idPlatform`,NEW.`sDate`,NEW.`sParams`,NEW.`sName`,NEW.`sSource`,NEW.`bEditable`,NEW.`sType`,NEW.`bActive`,NEW.`bSubmission`,NEW.`iRank`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_submissions`
--

CREATE TABLE IF NOT EXISTS `tm_submissions` (
  `ID` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL,
  `idPlatform` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL COMMENT 'Problem''s ID',
  `sDate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `idSourceCode` bigint(20) NOT NULL,
  `bManualCorrection` tinyint(4) NOT NULL DEFAULT '0',
  `bSuccess` tinyint(4) NOT NULL DEFAULT '0',
  `nbTestsTotal` int(11) NOT NULL DEFAULT '0',
  `nbTestsPassed` int(11) NOT NULL DEFAULT '0',
  `iScore` int(11) NOT NULL DEFAULT '0',
  `bCompilError` tinyint(4) NOT NULL DEFAULT '0',
  `sCompilMsg` mediumtext,
  `sErrorMsg` mediumtext,
  `sFirstUserOutput` mediumtext,
  `sFirstExpectedOutput` mediumtext,
  `sManualScoreDiffComment` varchar(255) DEFAULT NULL,
  `bEvaluated` tinyint(4) NOT NULL DEFAULT '0',
  `bConfirmed` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 when saved for getAnswer, 1 once the grade process starts',
  `sMode` enum('Submitted','LimitedTime','Contest','UserTest') NOT NULL DEFAULT 'Submitted',
  `sReturnUrl` varchar(255) DEFAULT NULL,
  `idUserAnswer` varchar(50) DEFAULT NULL,
  `iChecksum` int(11) NOT NULL DEFAULT '0',
  `iVersion` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_submissions`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_submissions` AFTER INSERT ON `tm_submissions`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_submissions` (`ID`,`iVersion`,`idUser`,`idTask`,`idPlatform`,`sDate`,`idSourceCode`,`bManualCorrection`,`bSuccess`,`nbTestsTotal`,`nbTestsPassed`,`iScore`,`bCompilError`,`sCompilMsg`,`sErrorMsg`,`sFirstUserOutput`,`sFirstExpectedOutput`,`sManualScoreDiffComment`,`bEvaluated`,`sMode`,`sReturnUrl`,`idUserAnswer`,`iChecksum`) VALUES (NEW.`ID`,@curVersion,NEW.`idUser`,NEW.`idTask`,NEW.`idPlatform`,NEW.`sDate`,NEW.`idSourceCode`,NEW.`bManualCorrection`,NEW.`bSuccess`,NEW.`nbTestsTotal`,NEW.`nbTestsPassed`,NEW.`iScore`,NEW.`bCompilError`,NEW.`sCompilMsg`,NEW.`sErrorMsg`,NEW.`sFirstUserOutput`,NEW.`sFirstExpectedOutput`,NEW.`sManualScoreDiffComment`,NEW.`bEvaluated`,NEW.`sMode`,NEW.`sReturnUrl`,NEW.`idUserAnswer`,NEW.`iChecksum`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_submissions` BEFORE DELETE ON `tm_submissions`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_submissions` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_submissions` (`ID`,`iVersion`,`idUser`,`idTask`,`idPlatform`,`sDate`,`idSourceCode`,`bManualCorrection`,`bSuccess`,`nbTestsTotal`,`nbTestsPassed`,`iScore`,`bCompilError`,`sCompilMsg`,`sErrorMsg`,`sFirstUserOutput`,`sFirstExpectedOutput`,`sManualScoreDiffComment`,`bEvaluated`,`sMode`,`sReturnUrl`,`idUserAnswer`,`iChecksum`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idUser`,OLD.`idTask`,OLD.`idPlatform`,OLD.`sDate`,OLD.`idSourceCode`,OLD.`bManualCorrection`,OLD.`bSuccess`,OLD.`nbTestsTotal`,OLD.`nbTestsPassed`,OLD.`iScore`,OLD.`bCompilError`,OLD.`sCompilMsg`,OLD.`sErrorMsg`,OLD.`sFirstUserOutput`,OLD.`sFirstExpectedOutput`,OLD.`sManualScoreDiffComment`,OLD.`bEvaluated`,OLD.`sMode`,OLD.`sReturnUrl`,OLD.`idUserAnswer`,OLD.`iChecksum`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_submissions` BEFORE INSERT ON `tm_submissions`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_submissions` BEFORE UPDATE ON `tm_submissions`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idUser` <=> NEW.`idUser` AND OLD.`idTask` <=> NEW.`idTask` AND OLD.`idPlatform` <=> NEW.`idPlatform` AND OLD.`sDate` <=> NEW.`sDate` AND OLD.`idSourceCode` <=> NEW.`idSourceCode` AND OLD.`bManualCorrection` <=> NEW.`bManualCorrection` AND OLD.`bSuccess` <=> NEW.`bSuccess` AND OLD.`nbTestsTotal` <=> NEW.`nbTestsTotal` AND OLD.`nbTestsPassed` <=> NEW.`nbTestsPassed` AND OLD.`iScore` <=> NEW.`iScore` AND OLD.`bCompilError` <=> NEW.`bCompilError` AND OLD.`sCompilMsg` <=> NEW.`sCompilMsg` AND OLD.`sErrorMsg` <=> NEW.`sErrorMsg` AND OLD.`sFirstUserOutput` <=> NEW.`sFirstUserOutput` AND OLD.`sFirstExpectedOutput` <=> NEW.`sFirstExpectedOutput` AND OLD.`sManualScoreDiffComment` <=> NEW.`sManualScoreDiffComment` AND OLD.`bEvaluated` <=> NEW.`bEvaluated` AND OLD.`sMode` <=> NEW.`sMode` AND OLD.`sReturnUrl` <=> NEW.`sReturnUrl` AND OLD.`idUserAnswer` <=> NEW.`idUserAnswer` AND OLD.`iChecksum` <=> NEW.`iChecksum`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_submissions` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_submissions` (`ID`,`iVersion`,`idUser`,`idTask`,`idPlatform`,`sDate`,`idSourceCode`,`bManualCorrection`,`bSuccess`,`nbTestsTotal`,`nbTestsPassed`,`iScore`,`bCompilError`,`sCompilMsg`,`sErrorMsg`,`sFirstUserOutput`,`sFirstExpectedOutput`,`sManualScoreDiffComment`,`bEvaluated`,`sMode`,`sReturnUrl`,`idUserAnswer`,`iChecksum`)       VALUES (NEW.`ID`,@curVersion,NEW.`idUser`,NEW.`idTask`,NEW.`idPlatform`,NEW.`sDate`,NEW.`idSourceCode`,NEW.`bManualCorrection`,NEW.`bSuccess`,NEW.`nbTestsTotal`,NEW.`nbTestsPassed`,NEW.`iScore`,NEW.`bCompilError`,NEW.`sCompilMsg`,NEW.`sErrorMsg`,NEW.`sFirstUserOutput`,NEW.`sFirstExpectedOutput`,NEW.`sManualScoreDiffComment`,NEW.`bEvaluated`,NEW.`sMode`,NEW.`sReturnUrl`,NEW.`idUserAnswer`,NEW.`iChecksum`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_submissions_subtasks`
--

CREATE TABLE IF NOT EXISTS `tm_submissions_subtasks` (
  `ID` bigint(20) NOT NULL,
  `bSuccess` tinyint(1) NOT NULL,
  `iScore` tinyint(3) NOT NULL,
  `idSubtask` bigint(20) NOT NULL,
  `idSubmission` bigint(20) NOT NULL,
  `iVersion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_submissions_subtasks`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_submissions_subtasks` AFTER INSERT ON `tm_submissions_subtasks`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_submissions_subtasks` (`ID`,`iVersion`,`bSuccess`,`iScore`,`idSubtask`,`idSubmission`) VALUES (NEW.`ID`,@curVersion,NEW.`bSuccess`,NEW.`iScore`,NEW.`idSubtask`,NEW.`idSubmission`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_submissions_subtasks` BEFORE DELETE ON `tm_submissions_subtasks`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_submissions_subtasks` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_submissions_subtasks` (`ID`,`iVersion`,`bSuccess`,`iScore`,`idSubtask`,`idSubmission`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`bSuccess`,OLD.`iScore`,OLD.`idSubtask`,OLD.`idSubmission`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_submissions_subtasks` BEFORE INSERT ON `tm_submissions_subtasks`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_submissions_subtasks` BEFORE UPDATE ON `tm_submissions_subtasks`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`bSuccess` <=> NEW.`bSuccess` AND OLD.`iScore` <=> NEW.`iScore` AND OLD.`idSubtask` <=> NEW.`idSubtask` AND OLD.`idSubmission` <=> NEW.`idSubmission`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_submissions_subtasks` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_submissions_subtasks` (`ID`,`iVersion`,`bSuccess`,`iScore`,`idSubtask`,`idSubmission`)       VALUES (NEW.`ID`,@curVersion,NEW.`bSuccess`,NEW.`iScore`,NEW.`idSubtask`,NEW.`idSubmission`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_submissions_tests`
--

CREATE TABLE IF NOT EXISTS `tm_submissions_tests` (
  `ID` bigint(20) NOT NULL,
  `idSubmission` bigint(20) NOT NULL DEFAULT '0',
  `idTest` bigint(20) NOT NULL DEFAULT '0',
  `iScore` tinyint(3) NOT NULL DEFAULT '0',
  `iTimeMs` int(11) NOT NULL DEFAULT '0',
  `iMemoryKb` int(11) NOT NULL DEFAULT '0',
  `iErrorCode` int(11) NOT NULL DEFAULT '0',
  `sOutput` mediumtext,
  `sExpectedOutput` mediumtext,
  `sErrorMsg` mediumtext,
  `sLog` mediumtext,
  `bNoFeedback` tinyint(1) NOT NULL DEFAULT '0',
  `jFiles` mediumtext,
  `iVersion` int(11) NOT NULL,
  `idSubmissionSubtask` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_submissions_tests`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_submissions_tests` AFTER INSERT ON `tm_submissions_tests`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_submissions_tests` (`ID`,`iVersion`,`idSubmission`,`idTest`,`iScore`,`iTimeMs`,`iMemoryKb`,`iErrorCode`,`sOutput`,`sExpectedOutput`,`sLog`,`bNoFeedback`,`jFiles`,`sErrorMsg`,`idSubmissionSubtask`) VALUES (NEW.`ID`,@curVersion,NEW.`idSubmission`,NEW.`idTest`,NEW.`iScore`,NEW.`iTimeMs`,NEW.`iMemoryKb`,NEW.`iErrorCode`,NEW.`sOutput`,NEW.`sExpectedOutput`,NEW.`sLog`,NEW.`bNoFeedback`,NEW.`jFiles`,NEW.`sErrorMsg`,NEW.`idSubmissionSubtask`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_submissions_tests` BEFORE DELETE ON `tm_submissions_tests`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_submissions_tests` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_submissions_tests` (`ID`,`iVersion`,`idSubmission`,`idTest`,`iScore`,`iTimeMs`,`iMemoryKb`,`iErrorCode`,`sOutput`,`sExpectedOutput`,`sLog`,`bNoFeedback`,`jFiles`,`sErrorMsg`,`idSubmissionSubtask`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idSubmission`,OLD.`idTest`,OLD.`iScore`,OLD.`iTimeMs`,OLD.`iMemoryKb`,OLD.`iErrorCode`,OLD.`sOutput`,OLD.`sExpectedOutput`,OLD.`sLog`,OLD.`bNoFeedback`,OLD.`jFiles`,OLD.`sErrorMsg`,OLD.`idSubmissionSubtask`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_submissions_tests` BEFORE INSERT ON `tm_submissions_tests`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_submissions_tests` BEFORE UPDATE ON `tm_submissions_tests`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idSubmission` <=> NEW.`idSubmission` AND OLD.`idTest` <=> NEW.`idTest` AND OLD.`iScore` <=> NEW.`iScore` AND OLD.`iTimeMs` <=> NEW.`iTimeMs` AND OLD.`iMemoryKb` <=> NEW.`iMemoryKb` AND OLD.`iErrorCode` <=> NEW.`iErrorCode` AND OLD.`sOutput` <=> NEW.`sOutput` AND OLD.`sExpectedOutput` <=> NEW.`sExpectedOutput` AND OLD.`sLog` <=> NEW.`sLog` AND OLD.`bNoFeedback` <=> NEW.`bNoFeedback` AND OLD.`jFiles` <=> NEW.`jFiles` AND OLD.`sErrorMsg` <=> NEW.`sErrorMsg` AND OLD.`idSubmissionSubtask` <=> NEW.`idSubmissionSubtask`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_submissions_tests` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_submissions_tests` (`ID`,`iVersion`,`idSubmission`,`idTest`,`iScore`,`iTimeMs`,`iMemoryKb`,`iErrorCode`,`sOutput`,`sExpectedOutput`,`sLog`,`bNoFeedback`,`jFiles`,`sErrorMsg`,`idSubmissionSubtask`)       VALUES (NEW.`ID`,@curVersion,NEW.`idSubmission`,NEW.`idTest`,NEW.`iScore`,NEW.`iTimeMs`,NEW.`iMemoryKb`,NEW.`iErrorCode`,NEW.`sOutput`,NEW.`sExpectedOutput`,NEW.`sLog`,NEW.`bNoFeedback`,NEW.`jFiles`,NEW.`sErrorMsg`,NEW.`idSubmissionSubtask`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_tasks`
--

CREATE TABLE IF NOT EXISTS `tm_tasks` (
  `ID` bigint(20) NOT NULL,
  `sTextId` varchar(100) NOT NULL,
  `sSupportedLangProg` varchar(255) NOT NULL DEFAULT '*',
  `sEvalTags` varchar(255) NOT NULL DEFAULT '',
  `sAuthor` varchar(100) NOT NULL,
  `sAuthorSolution` varchar(100) NOT NULL,
  `bShowLimits` tinyint(1) NOT NULL DEFAULT '1',
  `bEditorInStatement` tinyint(1) NOT NULL DEFAULT '0',
  `bUserTests` tinyint(1) NOT NULL DEFAULT '1',
  `bChecked` tinyint(1) NOT NULL DEFAULT '0',
  `iEvalMode` tinyint(1) NOT NULL DEFAULT '0',
  `bUsesLibrary` tinyint(1) NOT NULL,
  `bUseLatex` tinyint(1) NOT NULL DEFAULT '0',
  `iTestsMinSuccessScore` tinyint(3) NOT NULL DEFAULT '100',
  `bIsEvaluable` tinyint(1) NOT NULL DEFAULT '1',
  `sTemplateName` varchar(100) NOT NULL DEFAULT '',
  `sScriptAnimation` text,
  `sDefaultEditorMode` enum('simple','normal','expert','') NOT NULL DEFAULT 'normal',
  `sEvalResultOutputScript` varchar(50) DEFAULT NULL,
  `bTestMode` tinyint(1) NOT NULL DEFAULT '0',
  `sTaskPath` varchar(100) NOT NULL COMMENT 'taskPath as documented in taskgrader',
  `sRevision` varchar(100) DEFAULT NULL,
  `sAssetsBaseUrl` varchar(250) DEFAULT NULL,
  `iVersion` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_tasks`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_tasks` AFTER INSERT ON `tm_tasks`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_tasks` (`ID`,`iVersion`,`sScriptAnimation`,`sTextId`,`sSupportedLangProg`,`sEvalTags`,`bShowLimits`,`bEditorInStatement`,`bUserTests`,`bUseLatex`,`iTestsMinSuccessScore`,`bIsEvaluable`,`sEvalResultOutputScript`,`sTaskPath`,`sRevision`,`sAssetsBaseUrl`,`sDefaultEditorMode`,`bTestMode`) VALUES (NEW.`ID`,@curVersion,NEW.`sScriptAnimation`,NEW.`sTextId`,NEW.`sSupportedLangProg`,NEW.`sEvalTags`,NEW.`bShowLimits`,NEW.`bEditorInStatement`,NEW.`bUserTests`,NEW.`bUseLatex`,NEW.`iTestsMinSuccessScore`,NEW.`bIsEvaluable`,NEW.`sEvalResultOutputScript`,NEW.`sTaskPath`,NEW.`sRevision`,NEW.`sAssetsBaseUrl`,NEW.`sDefaultEditorMode`,NEW.`bTestMode`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_tasks` BEFORE DELETE ON `tm_tasks`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_tasks` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_tasks` (`ID`,`iVersion`,`sScriptAnimation`,`sTextId`,`sSupportedLangProg`,`sEvalTags`,`bShowLimits`,`bEditorInStatement`,`bUserTests`,`bUseLatex`,`iTestsMinSuccessScore`,`bIsEvaluable`,`sEvalResultOutputScript`,`sTaskPath`,`sRevision`,`sAssetsBaseUrl`,`sDefaultEditorMode`,`bTestMode`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`sScriptAnimation`,OLD.`sTextId`,OLD.`sSupportedLangProg`,OLD.`sEvalTags`,OLD.`bShowLimits`,OLD.`bEditorInStatement`,OLD.`bUserTests`,OLD.`bUseLatex`,OLD.`iTestsMinSuccessScore`,OLD.`bIsEvaluable`,OLD.`sEvalResultOutputScript`,OLD.`sTaskPath`,OLD.`sRevision`,OLD.`sAssetsBaseUrl`,OLD.`sDefaultEditorMode`,OLD.`bTestMode`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_tasks` BEFORE INSERT ON `tm_tasks`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_tasks` BEFORE UPDATE ON `tm_tasks`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`sScriptAnimation` <=> NEW.`sScriptAnimation` AND OLD.`sTextId` <=> NEW.`sTextId` AND OLD.`sSupportedLangProg` <=> NEW.`sSupportedLangProg` AND OLD.`sEvalTags` <=> NEW.`sEvalTags` AND OLD.`bShowLimits` <=> NEW.`bShowLimits` AND OLD.`bEditorInStatement` <=> NEW.`bEditorInStatement` AND OLD.`bUserTests` <=> NEW.`bUserTests` AND OLD.`bUseLatex` <=> NEW.`bUseLatex` AND OLD.`iTestsMinSuccessScore` <=> NEW.`iTestsMinSuccessScore` AND OLD.`bIsEvaluable` <=> NEW.`bIsEvaluable` AND OLD.`sEvalResultOutputScript` <=> NEW.`sEvalResultOutputScript` AND OLD.`sTaskPath` <=> NEW.`sTaskPath` AND OLD.`sRevision` <=> NEW.`sRevision` AND OLD.`sAssetsBaseUrl` <=> NEW.`sAssetsBaseUrl` AND OLD.`sDefaultEditorMode` <=> NEW.`sDefaultEditorMode` AND OLD.`bTestMode` <=> NEW.`bTestMode`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_tasks` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_tasks` (`ID`,`iVersion`,`sScriptAnimation`,`sTextId`,`sSupportedLangProg`,`sEvalTags`,`bShowLimits`,`bEditorInStatement`,`bUserTests`,`bUseLatex`,`iTestsMinSuccessScore`,`bIsEvaluable`,`sEvalResultOutputScript`,`sTaskPath`,`sRevision`,`sAssetsBaseUrl`,`sDefaultEditorMode`,`bTestMode`)       VALUES (NEW.`ID`,@curVersion,NEW.`sScriptAnimation`,NEW.`sTextId`,NEW.`sSupportedLangProg`,NEW.`sEvalTags`,NEW.`bShowLimits`,NEW.`bEditorInStatement`,NEW.`bUserTests`,NEW.`bUseLatex`,NEW.`iTestsMinSuccessScore`,NEW.`bIsEvaluable`,NEW.`sEvalResultOutputScript`,NEW.`sTaskPath`,NEW.`sRevision`,NEW.`sAssetsBaseUrl`,NEW.`sDefaultEditorMode`,NEW.`bTestMode`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_tasks_limits`
--

CREATE TABLE IF NOT EXISTS `tm_tasks_limits` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sLangProg` varchar(255) NOT NULL DEFAULT '*',
  `iMaxTime` int(11) NOT NULL DEFAULT '10000' COMMENT 'max allowed time in ms',
  `iMaxMemory` int(11) NOT NULL COMMENT 'max allowed memory in kb',
  `iVersion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_tasks_limits`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_tasks_limits` AFTER INSERT ON `tm_tasks_limits`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_tasks_limits` (`ID`,`iVersion`,`idTask`,`sLangProg`,`iMaxTime`,`iMaxMemory`) VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`sLangProg`,NEW.`iMaxTime`,NEW.`iMaxMemory`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_tasks_limits` BEFORE DELETE ON `tm_tasks_limits`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_tasks_limits` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_tasks_limits` (`ID`,`iVersion`,`idTask`,`sLangProg`,`iMaxTime`,`iMaxMemory`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idTask`,OLD.`sLangProg`,OLD.`iMaxTime`,OLD.`iMaxMemory`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_tasks_limits` BEFORE INSERT ON `tm_tasks_limits`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_tasks_limits` BEFORE UPDATE ON `tm_tasks_limits`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idTask` <=> NEW.`idTask` AND OLD.`sLangProg` <=> NEW.`sLangProg` AND OLD.`iMaxTime` <=> NEW.`iMaxTime` AND OLD.`iMaxMemory` <=> NEW.`iMaxMemory`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_tasks_limits` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_tasks_limits` (`ID`,`iVersion`,`idTask`,`sLangProg`,`iMaxTime`,`iMaxMemory`)       VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`sLangProg`,NEW.`iMaxTime`,NEW.`iMaxMemory`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_tasks_strings`
--

CREATE TABLE IF NOT EXISTS `tm_tasks_strings` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `sLanguage` varchar(5) NOT NULL,
  `sTitle` varchar(100) NOT NULL COMMENT 'title of the task',
  `sTranslator` varchar(100) NOT NULL,
  `sStatement` mediumtext NOT NULL,
  `sSolution` mediumtext,
  `iVersion` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_tasks_strings`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_tasks_strings` AFTER INSERT ON `tm_tasks_strings`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_tasks_strings` (`ID`,`iVersion`,`idTask`,`sLanguage`,`sTitle`,`sTranslator`,`sStatement`,`sSolution`) VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`sLanguage`,NEW.`sTitle`,NEW.`sTranslator`,NEW.`sStatement`,NEW.`sSolution`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_tasks_strings` BEFORE DELETE ON `tm_tasks_strings`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_tasks_strings` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_tasks_strings` (`ID`,`iVersion`,`idTask`,`sLanguage`,`sTitle`,`sTranslator`,`sStatement`,`sSolution`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idTask`,OLD.`sLanguage`,OLD.`sTitle`,OLD.`sTranslator`,OLD.`sStatement`,OLD.`sSolution`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_tasks_strings` BEFORE INSERT ON `tm_tasks_strings`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_tasks_strings` BEFORE UPDATE ON `tm_tasks_strings`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idTask` <=> NEW.`idTask` AND OLD.`sLanguage` <=> NEW.`sLanguage` AND OLD.`sTitle` <=> NEW.`sTitle` AND OLD.`sTranslator` <=> NEW.`sTranslator` AND OLD.`sStatement` <=> NEW.`sStatement` AND OLD.`sSolution` <=> NEW.`sSolution`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_tasks_strings` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_tasks_strings` (`ID`,`iVersion`,`idTask`,`sLanguage`,`sTitle`,`sTranslator`,`sStatement`,`sSolution`)       VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`sLanguage`,NEW.`sTitle`,NEW.`sTranslator`,NEW.`sStatement`,NEW.`sSolution`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_tasks_subtasks`
--

CREATE TABLE IF NOT EXISTS `tm_tasks_subtasks` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `iRank` tinyint(3) NOT NULL COMMENT 'position of the subtask in the task',
  `name` varchar(255) NOT NULL,
  `comments` text NOT NULL,
  `iPointsMax` tinyint(11) NOT NULL,
  `iVersion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_tasks_subtasks`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_tasks_subtasks` AFTER INSERT ON `tm_tasks_subtasks`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_tasks_subtasks` (`ID`,`iVersion`,`idTask`,`name`,`comments`,`iPointsMax`,`iRank`) VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`name`,NEW.`comments`,NEW.`iPointsMax`,NEW.`iRank`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_tasks_subtasks` BEFORE DELETE ON `tm_tasks_subtasks`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_tasks_subtasks` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_tasks_subtasks` (`ID`,`iVersion`,`idTask`,`name`,`comments`,`iPointsMax`,`iRank`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idTask`,OLD.`name`,OLD.`comments`,OLD.`iPointsMax`,OLD.`iRank`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_tasks_subtasks` BEFORE INSERT ON `tm_tasks_subtasks`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_tasks_subtasks` BEFORE UPDATE ON `tm_tasks_subtasks`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idTask` <=> NEW.`idTask` AND OLD.`name` <=> NEW.`name` AND OLD.`comments` <=> NEW.`comments` AND OLD.`iPointsMax` <=> NEW.`iPointsMax` AND OLD.`iRank` <=> NEW.`iRank`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_tasks_subtasks` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_tasks_subtasks` (`ID`,`iVersion`,`idTask`,`name`,`comments`,`iPointsMax`,`iRank`)       VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`name`,NEW.`comments`,NEW.`iPointsMax`,NEW.`iRank`) ; END IF; END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tm_tasks_tests`
--

CREATE TABLE IF NOT EXISTS `tm_tasks_tests` (
  `ID` bigint(20) NOT NULL,
  `idTask` bigint(20) NOT NULL,
  `idSubtask` bigint(20) DEFAULT NULL,
  `idSubmission` bigint(20) DEFAULT NULL,
  `sGroupType` enum('Example','User','Evaluation','Submission') NOT NULL DEFAULT 'User',
  `idUser` bigint(20) DEFAULT NULL,
  `idPlatform` bigint(20) DEFAULT NULL,
  `iRank` tinyint(3) NOT NULL DEFAULT '0',
  `bActive` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'current tab or not, relevant only with user tests',
  `sName` varchar(100) NOT NULL,
  `sInput` mediumtext,
  `sOutput` mediumtext,
  `iVersion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tm_tasks_tests`
--
DELIMITER //
CREATE TRIGGER `after_insert_tm_tasks_tests` AFTER INSERT ON `tm_tasks_tests`
 FOR EACH ROW BEGIN INSERT INTO `history_tm_tasks_tests` (`ID`,`iVersion`,`idTask`,`idSubmission`,`sGroupType`,`sOutput`,`sInput`,`sName`,`iRank`,`idSubtask`) VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`idSubmission`,NEW.`sGroupType`,NEW.`sOutput`,NEW.`sInput`,NEW.`sName`,NEW.`iRank`,NEW.`idSubtask`); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_delete_tm_tasks_tests` BEFORE DELETE ON `tm_tasks_tests`
 FOR EACH ROW BEGIN SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; UPDATE `history_tm_tasks_tests` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL; INSERT INTO `history_tm_tasks_tests` (`ID`,`iVersion`,`idTask`,`idSubmission`,`sGroupType`,`sOutput`,`sInput`,`sName`,`iRank`,`idSubtask`, `bDeleted`) VALUES (OLD.`ID`,@curVersion,OLD.`idTask`,OLD.`idSubmission`,OLD.`sGroupType`,OLD.`sOutput`,OLD.`sInput`,OLD.`sName`,OLD.`iRank`,OLD.`idSubtask`, 1); END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_insert_tm_tasks_tests` BEFORE INSERT ON `tm_tasks_tests`
 FOR EACH ROW BEGIN IF (NEW.ID IS NULL OR NEW.ID = 0) THEN SET NEW.ID = FLOOR(RAND() * 1000000000) + FLOOR(RAND() * 1000000000) * 1000000000; END IF ; SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion;SET NEW.iVersion = @curVersion; END
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER `before_update_tm_tasks_tests` BEFORE UPDATE ON `tm_tasks_tests`
 FOR EACH ROW BEGIN IF NEW.iVersion <> OLD.iVersion THEN SET @curVersion = NEW.iVersion; ELSE SELECT (UNIX_TIMESTAMP() * 10) INTO @curVersion; END IF; IF NOT (OLD.`ID` = NEW.`ID` AND OLD.`idTask` <=> NEW.`idTask` AND OLD.`idSubmission` <=> NEW.`idSubmission` AND OLD.`sGroupType` <=> NEW.`sGroupType` AND OLD.`sOutput` <=> NEW.`sOutput` AND OLD.`sInput` <=> NEW.`sInput` AND OLD.`sName` <=> NEW.`sName` AND OLD.`iRank` <=> NEW.`iRank` AND OLD.`idSubtask` <=> NEW.`idSubtask`) THEN   SET NEW.iVersion = @curVersion;   UPDATE `history_tm_tasks_tests` SET `iNextVersion` = @curVersion WHERE `ID` = OLD.`ID` AND `iNextVersion` IS NULL;   INSERT INTO `history_tm_tasks_tests` (`ID`,`iVersion`,`idTask`,`idSubmission`,`sGroupType`,`sOutput`,`sInput`,`sName`,`iRank`,`idSubtask`)       VALUES (NEW.`ID`,@curVersion,NEW.`idTask`,NEW.`idSubmission`,NEW.`sGroupType`,NEW.`sOutput`,NEW.`sInput`,NEW.`sName`,NEW.`iRank`,NEW.`idSubtask`) ; END IF; END
//
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `error_log`
--
ALTER TABLE `error_log`
 ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `history_tm_hints`
--
ALTER TABLE `history_tm_hints`
 ADD PRIMARY KEY (`historyID`), ADD KEY `idTask` (`idTask`), ADD KEY `synchro` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_hints_strings`
--
ALTER TABLE `history_tm_hints_strings`
 ADD PRIMARY KEY (`historyID`), ADD KEY `idHint` (`idHint`), ADD KEY `idHintsLanguage` (`idHint`,`sLanguage`), ADD KEY `synchro` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_recordings`
--
ALTER TABLE `history_tm_recordings`
 ADD PRIMARY KEY (`historyID`), ADD KEY `idTask` (`idTask`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_solutions`
--
ALTER TABLE `history_tm_solutions`
 ADD PRIMARY KEY (`historyID`), ADD KEY `idTask` (`idTask`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_solutions_strings`
--
ALTER TABLE `history_tm_solutions_strings`
 ADD PRIMARY KEY (`historyID`), ADD KEY `idSolution` (`idSolution`), ADD KEY `idSolutionsLanguage` (`idSolution`,`sLanguage`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_source_codes`
--
ALTER TABLE `history_tm_source_codes`
 ADD PRIMARY KEY (`historyID`), ADD KEY `UserTask` (`idUser`,`idTask`,`idPlatform`), ADD KEY `idTask` (`idTask`), ADD KEY `recordID` (`ID`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_submissions`
--
ALTER TABLE `history_tm_submissions`
 ADD PRIMARY KEY (`historyID`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`), ADD KEY `checksum` (`iChecksum`), ADD KEY `date` (`sDate`), ADD KEY `user` (`idUser`,`idPlatform`), ADD KEY `idTask` (`idTask`), ADD KEY `userTask` (`idTask`,`idUser`,`idPlatform`), ADD KEY `idSourceCode` (`idSourceCode`);

--
-- Indexes for table `history_tm_submissions_subtasks`
--
ALTER TABLE `history_tm_submissions_subtasks`
 ADD PRIMARY KEY (`historyID`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_submissions_tests`
--
ALTER TABLE `history_tm_submissions_tests`
 ADD PRIMARY KEY (`historyID`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`), ADD KEY `idSubmission` (`idSubmission`), ADD KEY `idTest` (`idTest`);

--
-- Indexes for table `history_tm_tasks`
--
ALTER TABLE `history_tm_tasks`
 ADD PRIMARY KEY (`historyID`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_tasks_limits`
--
ALTER TABLE `history_tm_tasks_limits`
 ADD PRIMARY KEY (`historyID`), ADD KEY `idTask` (`idTask`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_tasks_strings`
--
ALTER TABLE `history_tm_tasks_strings`
 ADD PRIMARY KEY (`historyID`), ADD KEY `idTask` (`idTask`), ADD KEY `idTasksLang` (`idTask`,`sLanguage`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_tasks_subtasks`
--
ALTER TABLE `history_tm_tasks_subtasks`
 ADD PRIMARY KEY (`historyID`), ADD KEY `idTask` (`idTask`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`);

--
-- Indexes for table `history_tm_tasks_tests`
--
ALTER TABLE `history_tm_tasks_tests`
 ADD PRIMARY KEY (`historyID`), ADD KEY `iVersion` (`iVersion`), ADD KEY `iNextVersion` (`iNextVersion`), ADD KEY `bDeleted` (`bDeleted`), ADD KEY `TaskGroup` (`idTask`,`sGroupType`), ADD KEY `TaskGroupUser` (`idTask`,`sGroupType`,`idUser`,`idPlatform`), ADD KEY `idUser` (`idUser`,`idPlatform`), ADD KEY `idTask` (`idTask`);

--
-- Indexes for table `synchro_version`
--
ALTER TABLE `synchro_version`
 ADD UNIQUE KEY `iVersion_2` (`iVersion`), ADD KEY `iVersion` (`iVersion`);

--
-- Indexes for table `tm_grader_checks`
--
ALTER TABLE `tm_grader_checks`
 ADD PRIMARY KEY (`ID`), ADD KEY `synchro` (`iVersion`), ADD KEY `idTask` (`idTask`);

--
-- Indexes for table `tm_hints`
--
ALTER TABLE `tm_hints`
 ADD PRIMARY KEY (`ID`), ADD KEY `idTask` (`idTask`), ADD KEY `synchro` (`iVersion`);

--
-- Indexes for table `tm_hints_strings`
--
ALTER TABLE `tm_hints_strings`
 ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `idHintsLanguage` (`idHint`,`sLanguage`), ADD KEY `idHint` (`idHint`), ADD KEY `synchro` (`iVersion`);

--
-- Indexes for table `tm_platforms`
--
ALTER TABLE `tm_platforms`
 ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tm_recordings`
--
ALTER TABLE `tm_recordings`
 ADD PRIMARY KEY (`ID`), ADD KEY `idTask` (`idTask`), ADD KEY `synchro` (`iVersion`);

--
-- Indexes for table `tm_remote_secret`
--
ALTER TABLE `tm_remote_secret`
 ADD PRIMARY KEY (`idUser`,`idPlatform`);

--
-- Indexes for table `tm_solutions`
--
ALTER TABLE `tm_solutions`
 ADD PRIMARY KEY (`ID`), ADD KEY `idTask` (`idTask`), ADD KEY `synchro` (`iVersion`);

--
-- Indexes for table `tm_solutions_strings`
--
ALTER TABLE `tm_solutions_strings`
 ADD PRIMARY KEY (`ID`), ADD KEY `idSolution` (`idSolution`), ADD KEY `idSolutionsLanguage` (`idSolution`,`sLanguage`), ADD KEY `synchro` (`iVersion`);

--
-- Indexes for table `tm_source_codes`
--
ALTER TABLE `tm_source_codes`
 ADD PRIMARY KEY (`ID`), ADD KEY `UserTask` (`idUser`,`idTask`,`idPlatform`), ADD KEY `idTask` (`idTask`), ADD KEY `synchro` (`iVersion`);

--
-- Indexes for table `tm_submissions`
--
ALTER TABLE `tm_submissions`
 ADD PRIMARY KEY (`ID`), ADD KEY `synchro` (`iVersion`), ADD KEY `checksum` (`iChecksum`), ADD KEY `date` (`sDate`), ADD KEY `idUser` (`idUser`,`idPlatform`), ADD KEY `idTask` (`idTask`), ADD KEY `userTask` (`idTask`,`idUser`,`idPlatform`), ADD KEY `idSourceCode` (`idSourceCode`);

--
-- Indexes for table `tm_submissions_subtasks`
--
ALTER TABLE `tm_submissions_subtasks`
 ADD PRIMARY KEY (`ID`), ADD KEY `synchro` (`iVersion`), ADD KEY `idSubtask` (`idSubtask`), ADD KEY `idSubmission` (`idSubmission`);

--
-- Indexes for table `tm_submissions_tests`
--
ALTER TABLE `tm_submissions_tests`
 ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `idSubmissionTest` (`idSubmission`,`idTest`), ADD KEY `synchro` (`iVersion`), ADD KEY `idSubmission` (`idSubmission`), ADD KEY `idTest` (`idTest`);

--
-- Indexes for table `tm_tasks`
--
ALTER TABLE `tm_tasks`
 ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `pathRev` (`sTaskPath`,`sRevision`), ADD KEY `synchro` (`iVersion`);

--
-- Indexes for table `tm_tasks_limits`
--
ALTER TABLE `tm_tasks_limits`
 ADD PRIMARY KEY (`ID`), ADD KEY `idTask` (`idTask`), ADD KEY `iVersion` (`iVersion`);

--
-- Indexes for table `tm_tasks_strings`
--
ALTER TABLE `tm_tasks_strings`
 ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `idTasksLang` (`idTask`,`sLanguage`), ADD KEY `idTask` (`idTask`), ADD KEY `iVersion` (`iVersion`);

--
-- Indexes for table `tm_tasks_subtasks`
--
ALTER TABLE `tm_tasks_subtasks`
 ADD PRIMARY KEY (`ID`), ADD KEY `synchro` (`iVersion`), ADD KEY `idTask` (`idTask`);

--
-- Indexes for table `tm_tasks_tests`
--
ALTER TABLE `tm_tasks_tests`
 ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `TaskGroupUserRank` (`idTask`,`sGroupType`,`idUser`,`iRank`,`idPlatform`), ADD KEY `TestName` (`sName`), ADD KEY `synchro` (`iVersion`), ADD KEY `TaskGroup` (`idTask`,`sGroupType`), ADD KEY `TaskGroupUser` (`idTask`,`sGroupType`,`idUser`,`idPlatform`), ADD KEY `idUser` (`idUser`,`idPlatform`), ADD KEY `idSubtask` (`idSubtask`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `error_log`
--
ALTER TABLE `error_log`
MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `history_tm_hints`
--
ALTER TABLE `history_tm_hints`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=152;
--
-- AUTO_INCREMENT for table `history_tm_hints_strings`
--
ALTER TABLE `history_tm_hints_strings`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=152;
--
-- AUTO_INCREMENT for table `history_tm_recordings`
--
ALTER TABLE `history_tm_recordings`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `history_tm_solutions`
--
ALTER TABLE `history_tm_solutions`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `history_tm_solutions_strings`
--
ALTER TABLE `history_tm_solutions_strings`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `history_tm_source_codes`
--
ALTER TABLE `history_tm_source_codes`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=15357;
--
-- AUTO_INCREMENT for table `history_tm_submissions`
--
ALTER TABLE `history_tm_submissions`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9061;
--
-- AUTO_INCREMENT for table `history_tm_submissions_subtasks`
--
ALTER TABLE `history_tm_submissions_subtasks`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=251;
--
-- AUTO_INCREMENT for table `history_tm_submissions_tests`
--
ALTER TABLE `history_tm_submissions_tests`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2336;
--
-- AUTO_INCREMENT for table `history_tm_tasks`
--
ALTER TABLE `history_tm_tasks`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=309;
--
-- AUTO_INCREMENT for table `history_tm_tasks_limits`
--
ALTER TABLE `history_tm_tasks_limits`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=652;
--
-- AUTO_INCREMENT for table `history_tm_tasks_strings`
--
ALTER TABLE `history_tm_tasks_strings`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=381;
--
-- AUTO_INCREMENT for table `history_tm_tasks_subtasks`
--
ALTER TABLE `history_tm_tasks_subtasks`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=52;
--
-- AUTO_INCREMENT for table `history_tm_tasks_tests`
--
ALTER TABLE `history_tm_tasks_tests`
MODIFY `historyID` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=230;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tm_submissions_tests`
--
ALTER TABLE `tm_submissions_tests`
ADD CONSTRAINT `tm_submissions_tests_ibfk_1` FOREIGN KEY (`idTest`) REFERENCES `tm_tasks_tests` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tm_tasks_tests`
--
ALTER TABLE `tm_tasks_tests`
ADD CONSTRAINT `tm_tasks_tests_subtask` FOREIGN KEY (`idSubtask`) REFERENCES `tm_tasks_subtasks` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `tm_tasks_tests_task` FOREIGN KEY (`idTask`) REFERENCES `tm_tasks` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
