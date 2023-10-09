ALTER TABLE `tm_submissions` ADD COLUMN `sMetadata` mediumtext DEFAULT NULL AFTER `sErrorMsg`;
ALTER TABLE `tm_submissions_tests` ADD COLUMN `sMetadata` mediumtext DEFAULT NULL AFTER `sErrorMsg`;
ALTER TABLE `history_tm_submissions` ADD COLUMN `sMetadata` mediumtext DEFAULT NULL AFTER `sErrorMsg`;
ALTER TABLE `history_tm_submissions_tests` ADD COLUMN `sMetadata` mediumtext DEFAULT NULL AFTER `sErrorMsg`;