// Light version of the displayHelper from buttonsAndMessages

window.displayHelper = {
   popupMessageShown: false,
   avatarType: "beaver",
   strings: null,

   languageStrings: {
      fr: {
         alright: "D'accord",
         validate: "Valider",
      },
      en: {
         alright: "Alright",
         validate: "Validate",
      },
      de: {
         alright: "OK",
         validate: "Überprüfen",
      },
      ar: {
         alright: "حسناً",
         validate: "تحقق",
      },
      es: {
         alright: "De acuerdo",
         validate: "Validar",
      }
   },

   initLanguage: function() {
      if (window.stringsLanguage == undefined) {
         window.stringsLanguage = 'fr';
      }
      this.strings = this.languageStrings[window.stringsLanguage];
   },
   getAvatar: function(mood) {
      if (displayHelper.avatarType == "beaver") {
         return "castor.png";
      } else {
         if (mood == "success") {
            return "laptop_success.png";
         } else if (mood == "warning") {
            return "laptop_warning.png";
         }{
            return "laptop_error.png";
         }
      }
   },
   showPopupMessage: function(message, mode, yesButtonText, agreeFunc, noButtonText, avatarMood, defaultText) {
      if(!this.strings) {
         this.initLanguage();
      }

      if ($('#popupMessage').length == 0) {
         $('#sourcesEditor > #fioi-editor2').append('<div id="popupMessage"></div>');
      }
      if (mode == 'blanket' || mode == 'input') {
         $('#popupMessage').addClass('floatingMessage');
      } else {
         $('#taskContent, #displayHelperAnswering').hide();
         $('#popupMessage').removeClass('floatingMessage');
      }

      var imgPath = '/bower_components/bebras-modules/img/';
      if(mode == 'lock') {
         var buttonYes = '';
      } else if (mode == 'input') {
         var buttonYes = '<button class="buttonYes">' + (yesButtonText || this.strings.validate) + '</button>';
      } else {
         var buttonYes = '<button class="buttonYes">' + (yesButtonText || this.strings.alright) + '</button>';
      }
      var buttonNo = '';
      if (noButtonText != undefined) {
         buttonNo = '<button class="buttonNo" style="margin-left: 10px;">' + noButtonText + '</button>';
      }
      var popupHtml = '<div class="container">' +
         '<img class="beaver" src="' + imgPath + this.getAvatar(avatarMood) + '"/>' +
         '<img class="messageArrow" src="' + imgPath + 'fleche-bulle.png"/>' +
         '<div class="message">' + message + '</div>';
      if(mode == 'input') {
         popupHtml += '<input id="popupInput" type="text" value="' + (defaultText ? defaultText : '') + '"></input>';
      }
      popupHtml += buttonYes + buttonNo + '</div>';
      // We use .css('display') to not trigger the event in fioi-editor2, which triggers a Blockly reload
      $('#popupMessage').html(popupHtml).css('display', 'block');
      if(mode == 'input') {
         $('#popupInput').focus();
      }

      var validateFunc = function() {
         $('#popupMessage').css('display', 'none');
         $('#displayHelperAnswering, #taskContent').show();
         displayHelper.popupMessageShown = false;
         if (agreeFunc) {
            if(mode == 'input') {
                agreeFunc($('#popupInput').val());
            } else {
                agreeFunc();
            }
         }
      }
      $('#popupMessage .buttonYes').click(validateFunc);
      $('#popupInput').keypress(function (e) {
         if(e.which === 13) { validateFunc(); }
      });

      $('#popupMessage .buttonNo').click(function() {
         $('#popupMessage').css('display', 'none');
         $('#displayHelperAnswering, #taskContent').show();
         displayHelper.popupMessageShown = false;
      });
      this.popupMessageShown = true;
      try {
         $(parent.document).scrollTop(0);
      } catch (e) {
      }
   },
};
