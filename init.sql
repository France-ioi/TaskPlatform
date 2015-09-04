INSERT INTO `tm_tasks` (`ID`, `sTextId`, `sSupportedLangProg`, `sAuthor`, `sAuthorSolution`, `bShowLimits`, `bUserTests`, `bChecked`, `iEvalMode`, `bUsesLibrary`, `bUseLatex`, `iTestsMinSuccessScore`, `bIsEvaluable`, `sTemplateName`, `sTaskPath`, `iVersion`, `sScriptAnimation`) VALUES
(1, 'FranceIOI/Tests/test_1', '*', '', '', 1, 0, 0, 0, 0, 0, 100, 1, '', '$ROOT_PATH/FranceIOI/Contests/2015/Algorea_tour_2/billes_d', 1308, '');

INSERT INTO `tm_tasks_limits` (`ID`, `idTask`, `sLangProg`, `iMaxTime`, `iMaxMemory`, `iVersion`) VALUES
(1, 1, '*', 10000, 130000, 0);
