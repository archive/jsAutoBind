
if (typeof jsab === "undefined") {
    alert("Missing jsAutoBind core file");
}

jsab.debug = {

    init: function(){
        this.debugWindowContent = "";
        this.prepareBindAction();
		this.prepareNoMatchWasFound();        
    },
    
    prepareBindAction: function(){
        var originalBindAction = jsab.binder.bindAction;
        jsab.binder.bindAction = function(element, func, behavior){
        
            var eventType = jsab.binder.getEventTypeFor(element);
            jsab.debug.logWithElement(element, eventType, func);
            
            originalBindAction.call(jsab.binder, element, func, behavior);
        };        
    },
    
    prepareNoMatchWasFound: function(){
        var originalNoMatchWasFound = jsab.binder.noMatchWasFound;
        jsab.binder.noMatchWasFound = function(elementId, context){
        
            var log = "No match was found for element with id '" + elementId + "' in context '" + context.id + "'";
            jsab.debug.log(log);
            
            return originalNoMatchWasFound.call(jsab.binder, elementId, context)
        };
    },
    
    show: function(){
        var debugWindow = '<div id="debugWindow" style="position:absolute; top:10px; left:300px; border: solid 1px gray; width: 700px; height: 300px;overflow: scroll;"><span>Log:</span><br />' + this.debugWindowContent + '</div>';
        jsab.domHelper.appendElement(document.body, debugWindow);
    },
    
    log: function(log){
        var tag = "<span>" + log + "</span><br />";
        this.debugWindowContent += tag;
    },
    
    logWithElement: function(element, eventType, func){
        var elementType = jsab.domHelper.getElementType(element.id);
        var log = "Element with id '" + element.id + "' of type '" + elementType + "' is bound to function '" + func + "' via the '" + eventType + "' event";
        this.log(log);
    }
};

(function(){

    jsab.debug.init();
    
    $(document).ready(function(){
        jsab.debug.show();
    });
    
})();
