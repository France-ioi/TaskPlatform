ALTER TABLE `tm_tasks` ADD `sEvalTags` VARCHAR(255) NOT NULL DEFAULT '' AFTER `sSupportedLangProg`;
ALTER TABLE `history_tm_tasks` ADD `sEvalTags` VARCHAR(255) NOT NULL DEFAULT '' AFTER `sSupportedLangProg`;
