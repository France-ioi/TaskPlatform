var conceptViewer = {
  concepts: {},
  loaded: false,
  load: function () {
    // Load the conceptViewer into the DOM
    if(this.loaded) { return; }
    $('body').append(''
      + '<div id="conceptViewer" style="display: none;">'
      + '  <div class="content">'
      + '    <div class="exit" onclick="conceptViewer.hide();">x</div>'
      + '    <div class="navigation">'
      + '      <div class="navigationContent"></div>'
      + '    </div>'
      + '    <div class="viewer">'
      + '      <iframe class="viewerContent" name="viewerContent"></iframe>'
      + '    </div>'
      + '  </div>'
      + '</div>');

    var that = this;
    $('#conceptViewer').on('click', function (event) {
      if (!$(event.target).closest('#conceptViewer .content').length) {
        that.hide();
      }
    });
    this.loaded = true;
  },

  loadConcepts: function (newConcepts) {
    // Load new concept information
    if(!this.loaded) { this.load(); }
    $('#conceptViewer .navigation').html('<ul></ul>');
    for (var i=0; i<newConcepts.length; i++) {
      var curConcept = newConcepts[i];
      var curHtml = '<li><a href="'+curConcept.url+'" target="viewerContent" data-id="'+curConcept.id+'"';
      if(curConcept.highlight) {
        curHtml += ' class="highlight"';
      }
      curHtml += '>'+curConcept.name+'</a></li>';
      $(curHtml).appendTo('#conceptViewer .navigation ul');
      if(curConcept.isDefault) {
        $('#conceptViewer .viewerContent').attr('src', curConcept.url);
      }
    }
    this.concepts = newConcepts;
  },

  show: function () {
    // Display the conceptViewer
    if(!this.loaded) { this.load(); }
    $('#conceptViewer').fadeIn(500);

    if (this.concepts.length > 0 && ! $('#conceptViewer .viewerContent').attr('src')) {
      $('#conceptViewer .viewerContent').attr('src', this.concepts[0].url);
    }
  },

  hide: function () {
    // Hide the conceptViewer
    if(!this.loaded) { this.load(); }
    $('#conceptViewer').fadeOut(500);
  },

  showConcept: function (concept) {
    // Show a specific concept
    // Either a concept object can be given, either a concept ID can be given
    // directly
    this.show();
    if (concept.url) {
      $('#conceptViewer .viewerContent').attr('src', concept.url);
    } else {
      var targetId = concept.id ? concept.id : concept;
      for (var i=0; i<this.concepts.length; i++) {
        if(this.concepts[i].id == targetId) {
          $('#conceptViewer .viewerContent').attr('src', this.concepts[i].url);
          return;
        }
      }
    }
  }
}


var testConcepts = [
    {id: 'taskplatform', name: 'Résolution des exercices', url: 'help.html#taskplatform'},
    {id: 'blockly', name: 'Programmation avec Blockly', url: 'help.html#blockly'},
    {id: 'blockly_print', name: 'Afficher du texte', url: 'help.html#blockly_print'},
    {id: 'blockly_print_no_end', name: 'Afficher consécutivement du texte', url: 'help.html#blockly_print_no_end'},
    {id: 'blockly_control_repeat', name: 'Programming en Blockly', url: 'help.html#blockly_control_repeat'},
    {id: 'robot_commands', name: 'Commandes du robot', url: 'help.html#robot_commands'},
    {id: 'arguments', name: 'Fonctions avec arguments', url: 'help.html#arguments'}
    ];


function conceptsFill(baseConcepts, allConcepts) {
  var concepts = [];
  var baseConceptsById = {};
  for(var b=0; b<baseConcepts.length; b++) {
    var curConcept = baseConcepts[b];
    if(typeof curConcept === 'string') {
      baseConceptsById[curConcept] = {id: curConcept};
    } else {
      baseConceptsById[curConcept.id] = curConcept;
    }
  }
  for(var c=0; c<allConcepts.length; c++) {
    var fullConcept = allConcepts[c];
    if(baseConceptsById[fullConcept.id]) {
      var curConcept = baseConceptsById[fullConcept.id]; 
      if(!curConcept.name) {
        curConcept.name = fullConcept.name;
      }
      if(!curConcept.url) {
        curConcept.url = fullConcept.url;
      }
      concepts.push(curConcept);
      delete baseConceptsById[fullConcept.id];
    }
  }

  for(var leftConcept in baseConceptsById) {
    concepts.push(baseConceptsById[leftConcept]);
  }

  return concepts;
}

function getConceptsFromBlocks(includeBlocks, allConcepts) {
  if(!includeBlocks.standardBlocks) { return []; }

  var allConceptsById = {};
  for(var c = 0; c<allConcepts.length; c++) {
    allConceptsById[allConcepts[c].id] = allConcepts[c];
  }

  var concepts = ['blockly'];
  if(includeBlocks.standardBlocks.includeAll) {
    for(var c = 0; c<allConcepts.length; c++) {
      if(allConcepts[c].name.substr(0, 7) == 'blockly_') {
        concepts.push(allConcepts[c]);
      }
    }
  } else if(includeBlocks.standardBlocks.singleBlocks) {
    for(var b = 0; b<includeBlocks.standardBlocks.singleBlocks; b++) {
      var blockName = includeBlocks.standardBlocks.singleBlocks[b];
      if(allConceptsById['blockly_'+blockName]) {
        concepts.push(allConceptsById['blockly_'+blockName]);
      }
    }
  }

  return concepts;
}

function getConceptsFromTask(allConcepts) {
  if(typeof taskSettings === 'undefined') { return; }

  var baseConcepts = ['taskplatform'];
 
  if(taskSettings.conceptViewer.length) {
    baseConcepts = baseConcepts.concat(taskSettings.conceptViewer);
  }
  if(taskSettings.blocklyOpts && taskSettings.blocklyOpts.includeBlocks) {
    baseConcepts = baseConcepts.concat(getConceptsFromBlocks(taskSettings.blocklyOpts.includeBlocks, allConcepts));
  }

  return conceptsFill(baseConcepts, allConcepts);
}
