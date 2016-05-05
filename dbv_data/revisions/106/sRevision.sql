ALTER TABLE `tm_tasks` ADD `sRevision` VARCHAR(100) NULL DEFAULT NULL AFTER `sTaskPath`;
ALTER TABLE `history_tm_tasks` ADD `sRevision` VARCHAR(100) NULL DEFAULT NULL AFTER `sTaskPath`;

ALTER TABLE `tm_tasks` ADD UNIQUE KEY `pathRev` (`sTaskPath`,`sRevision`);

ALTER TABLE tm_tasks DROP INDEX text_id;