ALTER TABLE `tm_source_codes` ADD `sType` ENUM('User','Submission','Task','Solution','Hint') NOT NULL DEFAULT 'User' AFTER `bSubmission`;
ALTER TABLE `history_tm_source_codes` ADD `sType` ENUM('User','Submission','Task','Solution','Hint') NOT NULL DEFAULT 'User' AFTER `bSubmission`;

ALTER TABLE `tm_tasks` ADD `sExpectedOutput` mediumtext NULL DEFAULT NULL AFTER `jFiles`;
ALTER TABLE `history_tm_tasks` ADD `sExpectedOutput` mediumtext NULL DEFAULT NULL AFTER `jFiles`;