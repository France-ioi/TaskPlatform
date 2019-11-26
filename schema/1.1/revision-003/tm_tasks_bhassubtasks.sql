ALTER TABLE `tm_tasks` ADD `bHasSubtasks` TINYINT(1) NOT NULL;
ALTER TABLE `history_tm_tasks` ADD `bHasSubtasks` TINYINT(1) NOT NULL;

UPDATE tm_tasks SET bHasSubtasks = 1 WHERE EXISTS (SELECT * FROM tm_tasks_subtasks WHERE idTask = tm_tasks.ID);
