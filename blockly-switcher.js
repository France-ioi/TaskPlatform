// Function by stenix on https://stackoverflow.com/questions/7171099/how-to-replace-url-parameter-with-javascript-jquery
function replaceUrlParam(url, paramName, paramValue){
    if(paramValue == null)
        paramValue = '';
    var pattern = new RegExp('\\b('+paramName+'=).*?(&|$)')
    if(url.search(pattern)>=0){
        return url.replace(pattern,'$1' + paramValue + '$2');
    }
    return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue 
}

var blocklySwitcher = (function () {
  var regex = new RegExp("[\\?&]blocklymode=([^&#]*)");
  var results = regex.exec(window.location.href);
  var modeResults = results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  var mode = modeResults ? modeResults : 'blockly';
  return {
    mode: mode,
    switchMode: function() {
      var newMode = (mode == 'blockly') ? 'scratch' : 'blockly';
      var newUrl = replaceUrlParam(window.location.href, 'blocklymode', newMode);
      window.location = newUrl;
    },
    dependencies: mode == 'blockly' ? [
      ["blockly", "blockly-blocks"],
      ["blockly-javascript", "blockly-python", "blockly-fr"],
      'fioi-blockly',
      'quickalgo-blockly',
      'fioi-editor2'
      ] : [
      ["scratch", "scratch-blocks-common", "scratch-blocks"],
      ["blockly-javascript", "blockly-python", "blockly-fr"],
      'fioi-blockly',
      ["scratch-fixes", "scratch-procedures"],
      'quickalgo-blockly',
      'fioi-editor2'
      ]
  }
})();
