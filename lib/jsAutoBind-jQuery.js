if(typeof jsab === "undefined"){
	alert("Missing jsAutoBind core file");
}

jsab.domHelper = {

    getElementById: function(id, context){
        if (typeof context === "undefined") {
            return jQuery("#" + id);
        }
        return jQuery("#" + id, context);
    },
    
    setAttributeOnElement: function(domElement, attributeName, attributeValue){
    	jQuery(domElement).attr(attributeName, attributeValue);
    },
    
    appendElement: function(node, elements){
        jQuery(node).append(elements);
    },
    
    getElementType: function(id){
        return jQuery("#" + id).get(0).tagName;
    },
    
    bindEventToElement: function(eventType, domElement, callback){
        jQuery(domElement).bind(eventType, function(){
            callback.call();
        });
    }
    
};

