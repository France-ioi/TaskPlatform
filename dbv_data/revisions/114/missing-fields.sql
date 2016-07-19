ALTER TABLE `tm_submissions_tests` ADD `sExpectedOutput` mediumtext NULL DEFAULT NULL AFTER `sOutput`;
ALTER TABLE `history_tm_submissions_tests` ADD `sExpectedOutput` mediumtext NULL DEFAULT NULL AFTER `sOutput`;
