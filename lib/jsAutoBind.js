
if (typeof jsab !== "undefined") {
    alert('The jsAutoBind "namespace" is already defined, why?');
}

var jsab = {};

jsab.constants = {
    namingPrefix: "Behavior",
    initFunctionName: "init"
};

jsab.string = {

    startsWith: function(textToSearchIn, textToSearchFor){
        return !textToSearchIn.indexOf(textToSearchFor);
    }
    
};

jsab.mapping = { 
    "button": "click",
    "select": "change",
    "radio": "change",
    "checkbox": "change",
    "span": "click",
    "text": "change",
    "select-one": "change",
    "select-multi": "change",
    "td": "click",
    "tr": "click",
    "a": "click",
    "p": "click"
};

jsab.binder = {

    getContext: function(){
        if (typeof jsab.context === "string") {
            jsab.context = jsab.domHelper.getElementById(jsab.context);
        }
        return jsab.context;
    },
    
    runInitOnBehavior: function(behavior){
        if (typeof behavior["init"] !== "undefined") {
            behavior["init"].call(behavior);
        }
    },
    
    bind: function(){
    
        var context = this.getContext();
        var behavior = jsab.behavior;
        
        this.runInitOnBehavior(behavior);
        
        for (func in behavior) {
        
            var elementInfo = this.getElementInfoFrom(func);
            
            var element = this.getElementBy(elementInfo.elementId, context);
            if (element === "n/a") {
                continue;
            }
            
            if (elementInfo.isRestriction === true) {
                this.bindRestriction(element, func, behavior);
            }
            else {
                this.bindAction(element, func, behavior);
            }
        }
    },
    
    getElementInfoFrom: function(func){
    
        var id = "n/a";
        var restriction = false;
        
        if (jsab.string.startsWith(func, "can")) {
            id = func.replace("can", "");
            id = id.toLowerCase();
            restriction = true;
        }
        else {
            if (jsab.setting.useHyphenName) {
                id = func.replace(/([A-Z])/g, "-$1")
                id = id.toLowerCase();
            }
            else {
                id = "" + func;
            }
        }
        
        return {
            elementId: id,
            isRestriction: restriction
        };
    },
    
    getElementBy: function(elementId, context){
        var elements = jsab.domHelper.getElementById(elementId, context);
        if (elements.length == 0) {
            return this.noMatchWasFound(elementId, context);
        }
        return elements.get(0);
    },
    
    noMatchWasFound: function(elementId, context){
        return "n/a";
    },
    
    bindAction: function(element, func, behavior){
    
        var eventType = this.getEventTypeFor(element);
        
        jsab.domHelper.bindEventToElement(eventType, element, function(){
            behavior[func].call(behavior, element.value);
        });
    },
    
    getEventTypeFor: function(element){
        var elementType = element.type.toLowerCase();
        var eventType = jsab.mapping[elementType];
        if (typeof eventType === "undefined") {
            eventType = "Error: Can't find any event mappings for element type " + elementType;
        }
        return eventType;
    },
    
    bindRestriction: function(element, func, behavior){
    
        if (!behavior[func]) {
            jsab.domHelper.setAttributeOnElement(element, "disabled", "disabled");
        }
        
        var self = this;
		
        if (typeof behavior.watch === "function") {
            // Mozilla
            behavior.watch(func, function(id, oldState, newState){
                self.stateChanged(element, newState);
                return newState;
            });
        }
        else 
            if (typeof behavior.__defineSetter__ === "function") {
                // Chrome
                var funcName = "" + func;
                var hiddenFuncValueName = "_" + funcName;
                behavior[hiddenFuncValueName] = func;
                
                delete behavior[func];
                
                behavior.__defineGetter__(funcName, function(){
                    return behavior[hiddenFuncValueName];
                });
                
                behavior.__defineSetter__(funcName, function(newState){
                    self.stateChanged(element, newState);
                    behavior[hiddenFuncValueName] = newState;
                });
                
            }
            else 
                if (typeof behavior.onPropertyChange === "function") {
					alert('asd');
                    //name= name.toLowerCase();
                    behavior.onpropertychange = function(){
                        alert('changed!:' + window.event.propertyName);
                    }
                //if (window.event.propertyName.toLowerCase()===name) {}
                //handler.call(obj);
                }
                else {
                	alert("TODO: Do some ugly setInterval stuff");
                }
				
        
    },
    
    stateChanged: function(element, newState){
        var stateToSet = newState ? "" : "disabled";
        jsab.domHelper.setAttributeOnElement(element, "disabled", stateToSet);
    }
};

jsab.setting = {};
jsab.setting.useHyphenName = true;

jsab.context = window.document;

jsab.behavior = (function(){
    var url = window.location.pathname;
    var fileName = url.substring(url.lastIndexOf('/') + 1).split('.')[0];
    var behaviorName = fileName.toLowerCase() + "Behavior";
    var behavior = window[behaviorName]
    return behavior;
})();

jsab.bind = function(){
    jsab.binder.bind();
};

