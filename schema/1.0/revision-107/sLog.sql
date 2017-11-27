ALTER TABLE `tm_submissions_tests` ADD `sLog` MEDIUMTEXT NULL DEFAULT NULL AFTER `sErrorMsg`;
ALTER TABLE `history_tm_submissions_tests` ADD `sLog` MEDIUMTEXT NULL DEFAULT NULL AFTER `sErrorMsg`;