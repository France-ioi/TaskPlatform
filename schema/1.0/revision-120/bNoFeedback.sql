ALTER TABLE `tm_submissions_tests` ADD `bNoFeedback` TINYINT(1) NOT NULL DEFAULT '0' AFTER `sLog`;
ALTER TABLE `history_tm_submissions_tests` ADD `bNoFeedback` TINYINT(1) NOT NULL DEFAULT '0' AFTER `sLog`;
