define(function () {
    return {
    	displayChecker: function(test) { // tm_submission_test
    		if (!test.jFiles) {return null;}
    		if (!test.files) {
    			test.files = JSON.parse(test.jFiles);
    		}
    		if (!test.files || !test.files.length) {return null;}
		    var imgData = test.files[0].data;
			imgData = imgData.replace(/(\n|\r)/g, " ");
			return 'Le résultat de votre programme est : <br><img style="border:1px solid black;" src="data:image/png;base64,'+ imgData+'">';
    	}
    }
});