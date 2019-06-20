var taskPlatformAdapterPlatform = {
    validate: function(mode, success, error) {
        $('#validateOk').show();
    },
    getTaskParams: function(key, defaultValue, success, error) {
        var res = {'minScore': 0, 'maxScore': 100, 'noScore': 0, 'readOnly': true, 'randomSeed': "0", 'options': {}}; // TODO :: randomSeed
        if(key && key in res) {
            res = res[key];
        } else if(key) {
            res = defaultValue;
        }
        if(success) {
            success(res);
        } else {
            return res;
        }},
    askHint: function(hint, success, error) {
        success();
    },
    updateDisplay: function(params, success, error) {
        success();
    }
};

platform.setPlatform(taskPlatformAdapterPlatform);
$(function () {
    task.load(null, function () {
        var source = window.parent.adapterApi.getSource();
        task.reloadAnswerObject({'easy': [{'blockly': source.sourceCode}]});

        setTimeout(function() {
            $('.contentCentered').hide();
            $('#submitBtn').hide();
            $('#displayHelperAnswering').hide();
            }, 0);
        });

        var updateHeight = null;
        updateHeight = function() {
            window.parent.adapterApi.setHeight($('body').outerHeight(true));
            setTimeout(updateHeight, 1000);
        };
        updateHeight();
        setTimeout(function() {
            task.displayedSubTask.getGrade(function(results) {
                if(results.successRate >= 1) {
                    $('#success').show();
                    window.parent.adapterApi.displayPopup();
                }
                task.displayedSubTask.run();
                }, true);
        }, 1000);
});

if(window.Blockly) {
  Blockly.JavaScript['input_num'] = function(block) {
    Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                   + "function readStdin() {\n"
                                                   + "    if (stdinBuffer == '')\n"
                                                   + "        return input();\n"
                                                   + "    if (typeof stdinBuffer === 'undefined')\n"
                                                   + "        stdinBuffer = '';\n"
                                                   + "    return stdinBuffer;\n"
                                                   + "};";
    var code = 'parseInt(readStdin())';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  Blockly.JavaScript['input_num_next'] = function(block) {
    Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                   + "function readStdin() {\n"
                                                   + "    if (stdinBuffer == '')\n"
                                                   + "        return input();\n"
                                                   + "    if (typeof stdinBuffer === 'undefined')\n"
                                                   + "        stdinBuffer = '';\n"
                                                   + "    return stdinBuffer;\n"
                                                   + "};";
    Blockly.JavaScript.definitions_['input_word'] = "function input_word() {\n"
                                                  + "    while (!stdinBuffer || stdinBuffer.trim() == '')\n"
                                                  + "        stdinBuffer = readStdin();\n"
                                                  + "    if (typeof stdinBuffer === 'undefined')\n"
                                                  + "        stdinBuffer = '';\n"
                                                  + "    var re = /\\S+\\s*/;\n"
                                                  + "    var w = re.exec(stdinBuffer);\n"
                                                  + "    stdinBuffer = stdinBuffer.substr(w[0].length);\n"
                                                  + "    return w[0];\n"
                                                  + "};";
    var code = 'parseInt(input_word())';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  Blockly.JavaScript['input_char'] = function(block) {
    Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                   + "function readStdin() {\n"
                                                   + "    if (stdinBuffer == '')\n"
                                                   + "        return input();\n"
                                                   + "    if (typeof stdinBuffer === 'undefined')\n"
                                                   + "        stdinBuffer = '';\n"
                                                   + "    return stdinBuffer;\n"
                                                   + "};";
    Blockly.JavaScript.definitions_['input_char'] = "function input_char() {\n"
                                                  + "    var buf = readStdin();\n";
                                                  + "    stdinBuffer = buf.substr(1);\n";
                                                  + "    return buf.substr(0, 1);\n";
                                                  + "};\n";
    var code = 'input_char()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  Blockly.JavaScript['input_word'] = function(block) {
    Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                   + "function readStdin() {\n"
                                                   + "    if (stdinBuffer == '')\n"
                                                   + "        return input();\n"
                                                   + "    if (typeof stdinBuffer === 'undefined')\n"
                                                   + "        stdinBuffer = '';\n"
                                                   + "    return stdinBuffer;\n"
                                                   + "};";
    Blockly.JavaScript.definitions_['input_word'] = "function input_word() {\n"
                                                  + "    while (!stdinBuffer || stdinBuffer.trim() == '')\n"
                                                  + "        stdinBuffer = readStdin();\n"
                                                  + "    if (typeof stdinBuffer === 'undefined')\n"
                                                  + "        stdinBuffer = '';\n"
                                                  + "    var re = /\\S+\\s*/;\n"
                                                  + "    var w = re.exec(stdinBuffer);\n"
                                                  + "    stdinBuffer = stdinBuffer.substr(w[0].length);\n"
                                                  + "    return w[0];\n"
                                                  + "};";
    var code = 'input_word()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  Blockly.JavaScript['input_line'] = function(block) {
    Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                   + "function readStdin() {\n"
                                                   + "    if (stdinBuffer == '')\n"
                                                   + "        return input();\n"
                                                   + "    if (typeof stdinBuffer === 'undefined')\n"
                                                   + "        stdinBuffer = '';\n"
                                                   + "    return stdinBuffer;\n"
                                                   + "};";
    var code = 'readStdin()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  Blockly.JavaScript['input_num_list'] = function(block) {
    Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                   + "function readStdin() {\n"
                                                   + "    if (stdinBuffer == '')\n"
                                                   + "        return input();\n"
                                                   + "    if (typeof stdinBuffer === 'undefined')\n"
                                                   + "        stdinBuffer = '';\n"
                                                   + "    return stdinBuffer;\n"
                                                   + "};";
    Blockly.JavaScript.definitions_['input_num_list'] = "function input_num_list() {\n"
                                                      + "    var parts = readStdin().split(/\\s+/);\n"
                                                      + "    for(var i=0; i<parts.length; i++) {\n"
                                                      + "        parts[i] = parseInt(parts[i]);\n"
                                                      + "    }\n"
                                                      + "    return parts;\n"
                                                      + "};";
    var code = 'input_num_list()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  
  Blockly.JavaScript['text_print'] = function(block) {
    return "print(" + (Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) || "''") + ");\n";
  };
  Blockly.JavaScript['text_print_noend'] = function(block) {
    return "print(" + (Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) || "''") + ", '');\n";
  };
}
