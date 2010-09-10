var sample1Behavior = {
	
    save: function(){
        alert('...click!');
    }
	
};

var sample2Behavior = {

	init : function(){
		this.canSave = false;
	},

    save: function(){
        alert('now saving');
    },
    
    name: function(value){
        alert("validate name...");
        if (value.length > 0) {
            this.canSave = true;
        }
        else {
            this.canSave = false;
        }
    },
    
    signDate: function(value){
        alert("validate date...");
    }
	
};

var firstContextBehavior = {

    save: function(){
        alert('now saving');
    },
    
    topType: function(subTypeId){		
		$("#sub-type").html(this.subTypesFromRemoteCall(subTypeId));
    },
    
    subTypesFromRemoteCall: function(subTypeId){
        return '<option value="1">Sub type l</option>' + 
				'<option value="2">Sub type 2</option>' +
				'<option value="3">Sub type 3</option>';
    } 
    
};

var sample4Behavior = {
	
    searchAll: function(){
        alert('click!');
    }
	
};




