ALTER TABLE `tm_tasks_subtasks` ADD `bActive` TINYINT(1) NOT NULL DEFAULT '1' AFTER `iPointsMax`;
ALTER TABLE `history_tm_tasks_subtasks` ADD `bActive` TINYINT(1) NOT NULL DEFAULT '1' AFTER `iPointsMax`;
