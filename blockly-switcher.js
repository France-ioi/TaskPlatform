// Function by Mac on https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

var blocklySwitcher = (function () {
  var modeResults = getCookieValue('blocklymode');
  var mode = modeResults ? modeResults : 'blockly';
  return {
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
