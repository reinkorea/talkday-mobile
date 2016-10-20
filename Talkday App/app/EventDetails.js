var view = require('ui/core/view');
var http = require('http');
var container;

exports.onNavigatingTo = function (args) {
    container = args.object;

    var eventDetails = container.navigationContext;
	
	var abEventDetails = container.getViewById('abEventDetails');
	abEventDetails.title = eventDetails.eventName;
	
    var lblEventName = container.getViewById('lblEventName');
    lblEventName.text = eventDetails.eventName;
    
    var lblEventDesc = container.getViewById('lblEventDesc');
    lblEventDesc.text = eventDetails.eventDesc;

    var lblEventType = container.getViewById('lblEventType');
    lblEventType.text = eventDetails._eventType.typeName;

    var lblEventCategory = container.getViewById('lblEventCategory');
    lblEventCategory.text = eventDetails._eventCategory.categoryName;
};