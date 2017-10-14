// Function by Mac on https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(window.location.toString());
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var blocklySwitcher = (function () {
  var modeResults = getCookieValue('blocklymode');
  var mode = modeResults ? modeResults : 'blockly';
  var language = getLocale.localeLang;

  var availableLanguages = ['fr', 'en'];
  if(availableLanguages.indexOf(language) < 0) {
    language = availableLanguages[0];
  }
  window.stringsLanguage = language;

  return {
    language: language,
    mode: mode,
    switchMode: function() {
      var newMode = (mode == 'blockly') ? 'scratch' : 'blockly';
      document.cookie = 'blocklymode=' + newMode;
      $('body').append('' +
        '<div class="modal" id="blocklySwitcherModal">' +
        '  <div class="modal-dialog">' +
        '    <div class="modal-content">' +
        '      <div class="modal-header">' +
        '        <h4>Changement de mode Blockly/Scratch</h4>' +
        '      </div>' +
        '      <div class="modal-body">' +
        '        Changement de mode effectué, veuillez recharger la page.' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>');
      $('#blocklySwitcherModal').modal({backdrop: 'static', keyboard: false});
    },
    dependencies: mode == 'blockly' ? [
      ["blockly", "blockly-blocks"],
      ["blockly-javascript", "blockly-python", "blockly-"+language],
      'fioi-blockly',
      'quickalgo-blockly',
      'fioi-editor2'
      ] : [
      ["scratch", "scratch-blocks-common", "scratch-blocks"],
      ["blockly-javascript", "blockly-python", "blockly-"+language],
      'fioi-blockly',
      ["scratch-fixes", "scratch-procedures"],
      'quickalgo-blockly',
      'fioi-editor2'
      ]
  }
})();
