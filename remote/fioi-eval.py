#!/usr/bin/env python2
# coding=utf-8

from __future__ import print_function
from __future__ import unicode_literals
import argparse, json, logging, os, os.path, sys, time, math
import urllib2

def myError(errorStr):
    logging.error(errorStr)
    print(errorStr)
    sys.exit(1)

def getConfig(fileName):
    """
    reads the config file and returns the corresponding object
    """
    configStr = ''
    with open(fileName, 'r') as f:
        configStr = f.read()
    if not configStr:
        logging.error('config file %s empty' % fileName)
        sys.exit(1)
    config = {}
    try:
        config = json.loads(configStr)
    except ValueError:
        myError('config file %s is not valid json' % fileName)
    if 'token' not in config:
        myError('missing parameter %s in config file %s, please refresh your config file' % ('token', fileName))
    if 'platform' not in config:
        myError('missing parameter %s in config file %s, please refresh your config file' % ('platform', fileName))
    if 'taskId' not in config:
        myError('missing parameter %s in config file %s, please refresh your config file' % ('taskId', fileName))
    if 'baseUrl' not in config:
        myError('missing parameter %s in config file %s, please refresh your config file' % ('baseUrl', fileName))
    return config

def sendRequest(url, postVars):
    """
    sends some post vars to url, return the    answer as an object.    
    """
    logging.debug('sending '+json.dumps(postVars)+' to '+url)
    request = urllib2.Request(url, json.dumps(postVars))
    r = urllib2.urlopen(request).read().decode()
    logging.debug('receiving '+r)
    try:
        res = json.loads(r)
    except ValueError:
        myError('cannot decode result from '+url)
    if 'bSuccess' in res and not res['bSuccess']:
        error = ''
        if 'sError' in res:
            error = res['sError']
        myError('receiving error from '+url+' : '+error)
    return res

def addTests(submission, changes):
    if 'tm_submissions_tests' not in changes or 'inserted' not in changes['tm_submissions_tests']:
        return
    tests = {}
    for idSubmissionTest, submissionTest in changes['tm_submissions_tests']['inserted'].items():
        submissionTest = submissionTest['data']
        tests[int(submissionTest['test_iRank'])] = submissionTest
    submission['tests'] = tests

def getSubmission(config, idSubmission):
    idSubmission = str(idSubmission)
    params = {
        "minServerVersion": 0,
        "requestSets": {},
        "changes": {},
        "params": {
            "requests": {},
            "action": "getAll",
            "sPlatform": config['platform'],
            "sToken": config['token'],
            "taskId": config['taskId'],
            "getSubmissionTokenFor": {}
        }
    }
    params['params']['getSubmissionTokenFor'][str(idSubmission)] = ""
    res = sendRequest(config['baseUrl']+'/commonFramework/sync/syncServer.php?json=1', params)
    if not 'changes' in res or not 'tm_submissions' in res['changes'] or not 'inserted' in res['changes']['tm_submissions'] or len(res['changes']['tm_submissions']['inserted']) == 0:
        return False
    if not idSubmission in res['changes']['tm_submissions']['inserted']:
        error('sync received some unwanted submissions, but did not receive the asked one')
    submission = res['changes']['tm_submissions']['inserted'][idSubmission]['data']
    if submission['bEvaluated'] == '1':
        addTests(submission, res['changes'])
    return submission


TEST_ERROR_TO_STR = {
    '6': """   Votre programme a retourné un "Abort".
   En C++, il peut s'agir d'une exception non traitée par votre programme.""",
    '7': """   Votre programme a retourné un "Bus Error".
   Il peut s'agir d'un problème lié à l'utilisation de pointeurs.""",
    '8': """   Votre programme s'est terminé par un "floating point exception".
   Il a probablement tenté d'effectuer une division par zéro.""",
    '11': """   Votre programme a échoué à la suite d'un accès mémoire en dehors des zones réservées, ou d'un dépassement de la limite de mémoire.
   Cela peut venir d'une des raisons suivantes :
      - votre programme a dépassé la limite de mémoire autorisée pour ce problème, que ce soit sous la forme de variables statiques, d'allocations dynamiques, ou bien de la pile ;
      - votre programme a tenté de faire un accès mémoire en dehors des zones allouées.""",
    '137': """   Votre programme a dépassé la limite de temps.
   Cela peut venir de deux raisons :
      - soit il est trop lent pour passer ce test dans la limite de temps du sujet ;
      - soit il boucle indéfiniment et ne se termine jamais."""
}

def printJsonLog(log):
    if 'msg' in log and log['msg']:
        print('    message: '+log['msg'])
    print('    Voici un extrait de votre sortie près de la première erreur :')
    print('    '+log['displayedSolutionOutput'])
    print('    Voici l\'extrait correspondant de la sortie attendue :')
    print('    '+log['displayedExpectedOutput'])

def printSubmission(submission):
    if submission['bSuccess'] == '1':
        print('Bravo, vous avez validé l\'exercice !')
    else:
        print('Vous n\'avez pas validé l\'exercice:')
    print('Score: '+submission['iScore']+'/100')
    if submission['bCompilError'] == '1':
        print('Votre code a produit l\'erreur de compilation suivante :')
        print(submission['sCompilMsg'])
    elif submission['sCompilMsg']:
        print('Votre code a produit le message de compilation suivant :')
        print(submission['sCompilMsg'])
    nbTestsTotal = int(submission['nbTestsTotal'])
    if nbTestsTotal > 0:
        nbTestsPassed = int(submission['nbTestsPassed'])
        sornot = 's' if nbTestsPassed > 1 else ''
        print('Vous avez validé '+str(nbTestsPassed)+' test'+sornot+' sur '+str(nbTestsTotal))
    for rankTest, test in submission['tests'].items():
        print(' Test '+test['test_sName']+' ('+test['iScore']+'/100):')
        tpsSec = math.floor(int(test['iTimeMs'])/10)/100
        if test['iErrorCode'] != '0' and test['iErrorCode'] != '1':
            if test['iErrorCode'] not in TEST_ERROR_TO_STR:
                print('Code d\'erreur '+test['iErrorCode']+' inconnu!')
            else:
                print(TEST_ERROR_TO_STR[test['iErrorCode']])
            break
        if test['iScore'] == '100':
            print('  Bonne réponse en '+str(tpsSec)+' s')
        elif test['iScore'] == '0':
            print('  Réponse incorrecte')
        else:
            print('  Vous avez obtenu un score partiel. Vous pouvez améliorer votre programme pour augmenter votre score.')
        if test['sLog']:
            try:
                log = json.loads(test['sLog'])
                printJsonLog(log)
            except ValueError:
                log = test['sLog']
                print(log)


def saveSubmission(answer, config):
    params = {
        "sToken": config['token'],
        "sPlatform": config['platform'],
        "taskId": config['taskId'],
        "oAnswer": answer
    }
    res = sendRequest(config['baseUrl']+'/saveSubmission.php', params)
    if 'idSubmission' not in res:
        myError('saveSubmission.php did not send submission\' id')
    return res['idSubmission']

def gradeTask(answer, config, idSubmission):
    params = {
        "sToken": config['token'],
        "sPlatform": config['platform'],
        "taskId": config['taskId'],
        "idSubmission": idSubmission
    }
    sendRequest(config['baseUrl']+'/grader/gradeTask.php', params)



EXT_TO_LANG = {
    "py": "python",
    "js": "javascript",
    "c": "c",
    "cpp": "cpp",
    "java": "java",
    "jvs": "javascool",
    "php": "php",
    "ps": "pascal"
}

def getAnswerObject(fileName):
    """
    reads a file and returns the answer object as needed by saveSubmission.php
    """
    with open(fileName, 'r') as f:
        answerStr = f.read()
    ext = os.path.splitext(fileName)[1][1:  ]
    if ext not in EXT_TO_LANG:
        logging.error('l\'extension de fichier %s n\'est pas gérée' % ext)
        sys.exit(1)
    lang = EXT_TO_LANG[ext]
    return {"sSourceCode": answerStr, "sLangProg": lang}


if __name__ == '__main__':
    # Read command line options
    argParser = argparse.ArgumentParser(description="Lance l'évaluation d'un fichier sur la plateforme France-IOI")
    argParser.add_argument('fileName', help='le fichier à évaluer', metavar='FILENAME')
    argParser.add_argument('-d', '--debug', help='Mode debug (implique -v)', action='store_true')
    argParser.add_argument('-L', '--logfile', help='Écrit les logs dans LOGFILE', action='store', metavar='LOGFILE', default="fioi-remote.log")
    argParser.add_argument('-c', '--config-file', help='Lit la configuration dans le fichier', action='store_true', default="fioi-remote.json", dest="configFile")
    argParser.add_argument('-v', '--verbose', help='Be more verbose', action='store_true')

    args = argParser.parse_args()

    if not args.fileName:
        logging.error('missing FILENAME argument')
        sys.exit(1)

    # Set logging options
    logLevel = logging.ERROR
    if args.debug: logLevel = min(logLevel, logging.DEBUG)
    if args.verbose: logLevel = min(logLevel, logging.INFO)

    logConfig = {'level': logLevel,
        'format': '%(asctime)s - %(levelname)s - %(message)s'}
    if args.logfile: logConfig['filename'] = args.logfile
    logging.basicConfig(**logConfig)

    if args.logfile and args.verbose:
        # Also show messages on stderr
        logStderr = logging.StreamHandler()
        logStderr.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        logging.getLogger().addHandler(logStderr)

    logging.info('Reading configuration file `%s`...' % args.configFile)
    config = getConfig(args.configFile)
    logging.debug('Got ' + json.dumps(config))

    answer = getAnswerObject(args.fileName)
    logging.debug('computing answer object: '+json.dumps(answer))

    if not args.verbose:
        print('.', end="")
        sys.stdout.flush()
    idSubmission = saveSubmission(answer, config)
    if not args.verbose:
        print('.', end="")
        sys.stdout.flush()
    gradeTask(answer, config, idSubmission)
    if not args.verbose:
        print('.', end="")
        sys.stdout.flush()

    submissionEvaluated = False
    submission = None
    while not submissionEvaluated:
        if not args.verbose:
            print('.', end="")
            sys.stdout.flush()
        logging.debug('waiting 1 second for the evaluation')
        time.sleep(1)
        logging.debug('waking up')
        submission = getSubmission(config, idSubmission)
        if submission['bEvaluated'] == '1':
            submissionEvaluated = True

    if not args.verbose:
        print('\n')
    printSubmission(submission)