alter table history_tm_hints
    modify iVersion bigint not null;
alter table history_tm_hints_strings
    modify iVersion bigint not null;
alter table history_tm_recordings
    modify iVersion bigint not null;
alter table history_tm_solutions
    modify iVersion bigint not null;
alter table history_tm_solutions_strings
    modify iVersion bigint not null;
alter table history_tm_source_codes
    modify iVersion bigint not null;
alter table history_tm_submissions
    modify iVersion bigint not null;
alter table history_tm_submissions_subtasks
    modify iVersion bigint not null;
alter table history_tm_submissions_tests
    modify iVersion bigint not null;
alter table history_tm_tasks
    modify iVersion bigint not null;
alter table history_tm_tasks_limits
    modify iVersion bigint not null;
alter table history_tm_tasks_strings
    modify iVersion bigint not null;
alter table history_tm_tasks_subtasks
    modify iVersion bigint not null;
alter table history_tm_tasks_tests
    modify iVersion bigint not null;
alter table synchro_version
    modify iVersion bigint not null;
alter table synchro_version
    modify iLastServerVersion bigint not null;
alter table synchro_version
    modify iLastClientVersion bigint not null;
alter table tm_grader_checks
    modify iVersion bigint not null;
alter table tm_hints
    modify iVersion bigint not null;
alter table tm_hints_strings
    modify iVersion bigint not null;
alter table tm_recordings
    modify iVersion bigint not null;
alter table tm_solutions
    modify iVersion bigint not null;
alter table tm_solutions_strings
    modify iVersion bigint not null;
alter table tm_source_codes
    modify iVersion bigint not null;
alter table tm_submissions
    modify iVersion bigint not null;
alter table tm_submissions_subtasks
    modify iVersion bigint not null;
alter table tm_submissions_tests
    modify iVersion bigint not null;
alter table tm_tasks
    modify iVersion bigint not null;
alter table tm_tasks_limits
    modify iVersion bigint not null;
alter table tm_tasks_strings
    modify iVersion bigint not null;
alter table tm_tasks_subtasks
    modify iVersion bigint not null;
alter table tm_tasks_tests
    modify iVersion bigint not null;

alter table history_tm_hints
    modify iNextVersion bigint default null;
alter table history_tm_hints_strings
    modify iNextVersion bigint default null;
alter table history_tm_recordings
    modify iNextVersion bigint default null;
alter table history_tm_solutions
    modify iNextVersion bigint default null;
alter table history_tm_solutions_strings
    modify iNextVersion bigint default null;
alter table history_tm_source_codes
    modify iNextVersion bigint default null;
alter table history_tm_submissions
    modify iNextVersion bigint default null;
alter table history_tm_submissions_subtasks
    modify iNextVersion bigint default null;
alter table history_tm_submissions_tests
    modify iNextVersion bigint default null;
alter table history_tm_tasks
    modify iNextVersion bigint default null;
alter table history_tm_tasks_limits
    modify iNextVersion bigint default null;
alter table history_tm_tasks_strings
    modify iNextVersion bigint default null;
alter table history_tm_tasks_subtasks
    modify iNextVersion bigint default null;
alter table history_tm_tasks_tests
    modify iNextVersion bigint default null;

alter table history_tm_hints
    alter column bDeleted set default 0;
alter table history_tm_hints_strings
    alter column bDeleted set default 0;
alter table history_tm_recordings
    alter column bDeleted set default 0;
alter table history_tm_solutions
    alter column bDeleted set default 0;
alter table history_tm_solutions_strings
    alter column bDeleted set default 0;
alter table history_tm_source_codes
    alter column bDeleted set default 0;
alter table history_tm_submissions
    alter column bDeleted set default 0;
alter table history_tm_submissions_subtasks
    alter column bDeleted set default 0;
alter table history_tm_submissions_tests
    alter column bDeleted set default 0;
alter table history_tm_tasks
    alter column bDeleted set default 0;
alter table history_tm_tasks_limits
    alter column bDeleted set default 0;
alter table history_tm_tasks_strings
    alter column bDeleted set default 0;
alter table history_tm_tasks_subtasks
    alter column bDeleted set default 0;
alter table history_tm_tasks_tests
    alter column bDeleted set default 0;
