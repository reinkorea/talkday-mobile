var observable = require('data/observable');
var frameModule =require('ui/frame');
var http = require('http');
var calendar = require('nativescript-telerik-ui-pro/calendar');
var frames = require('ui/frame');
var appSettings = require('application-settings');
var tabView = require('ui/tab-view');
var view = require('ui/core/view');
var gridLayout = require("ui/layouts/grid-layout");
var listViewModule = require("ui/list-view");
var mapbox = require("nativescript-mapbox");
var platform = require("platform");
var isIOS = platform.device.os === platform.platformNames.ios;
var locationModule = require("location");
var listView = new listViewModule.ListView();


var color = require('color');
var Color = color.Color;
var tabViewControl;
var mbEventsNeaby;
var oldIndex;

var residents = new Array();
var pageData;

function pageLoaded(args) {
    var page = args.object;
    //var emptyContext = new observable.Observable();
    //page.bindingContext = emptyContext;
    
    mapbox.hasFineLocationPermission().then(
        function(granted) {
            // if this is 'false' you probably want to call 'requestFineLocationPermission' now
            console.log("Has Location Permission? " + granted);

            if (!granted) {
                // if no permission was granted previously this wil open a user consent screen
                mapbox.requestFineLocationPermission().then(
                    function() {
                        console.log("Location permission requested");
                    }
                );
            }
            else {
                locationModule.getLocation({ maximumAge: 3000, timeout: 5000 }).then(function (location) {
                    console.log('User Location: (Lat: ' + location.latitude + ', Lng: ' + location.longitude + ')');
                }, function (error) {
                    //console.log('Location error received: ' + error);
                });
            }
        }
    );
	
	if (!appSettings.hasKey('username')) {
        var navigationPage = {
            moduleName: 'LoginScreen',
            backstackVisible: false,
            animated: false
        };

        frames.topmost().navigate(navigationPage);
    }
    else {
        console.log('Welcome back ' + appSettings.getString('username'));
    }
	
	tabViewControl = page.getViewById('tabView');
    tabViewControl.selectedColor = new Color('#0078ff');
    tabViewControl.selectedIndex = 0;
    
	
	var eventsList = page.getViewById('eventsList');
	
	http.getJSON('http://104.168.141.225:2080/api/events/get_all_events').then(function(r) {
		eventsList.items = r;
	});
	
	var calEvents = page.getViewById('calEvents');
    var events = new Array();

    http.getJSON('http://104.168.141.225:2080/api/events/get_all_events').then(function(r) {
        for (var i = 0; i < r.length; i++) {
            var startDate = new Date(r[i].startDate);
            var timeSlotStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes());
            var endDate = new Date(r[i].endDate);
            var timeSlotEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endDate.getHours(), endDate.getMinutes());
            var color = new Color(r[i]._eventCategory.colorCode);
            var eventTitle = r[i].eventName + ' (' + r[i]._eventCategory.categoryName + ')';

            var event = new calendar.CalendarEvent(eventTitle, timeSlotStart, timeSlotEnd, false, color);
            events.push(event);
            
            console.log('Event title: ' + event.title + ', Start Time: ' + event.startDate + ', End Time: ' + event.endDate + ', ColorCode: ' + event.eventColor);
        }

        console.log('Events available: ' + events.length.toString());

        events.forEach(function (event, index) {
            console.log('Event title: ' + event.title + ', Start Time: ' + event.startDate + ', End Time: ' + event.endDate + ', ColorCode: ' + event.eventColor);
        });

        calEvents.eventSource = events;
        calEvents.eventsViewMode = calendar.CalendarEventsViewMode.Inline;
    });
}

function tabViewLoaded(args) {
	var container = args.object;
	
	http.getJSON('http://104.168.141.225:2080/api/events/get_all_events').then(function(r) {

		var tabItemData = new Observable({
			eventsList: r
		});

		container.bindingContext = tabItemData;
	});
}

function eventItemTapped(args) {
	http.getJSON('http://104.168.141.225:2080/api/events/get_all_events').then(function(r) {
    	var itemIndex = args.index;
		
		var navigationOptions={
			moduleName:'EventDetails',
			context: r[itemIndex]
		};

		frameModule.topmost().navigate(navigationOptions);
	});
}

function onMapReady(args) {
    locationModule.getLocation({ maximumAge: 3000, timeout: 5000 }).then(function (location) {
        console.log('User Location: (Lat: ' + location.latitude + ', Lng: ' + location.longitude + ')');
        http.getJSON('http://104.168.141.225:2080/api/events/get_all_events').then(function(r) {
            r.forEach(function(event, index) {
                args.map.addMarkers([
                {
                    lat: event._eventVenue.latitude,
                    lng: event._eventVenue.longitude,
                    title: event.eventName,
                    subtitle: event._eventCategory.categoryName,
                    onCalloutTap: function() {
                        console.log("'Nice location' marker callout tapped");
                    }
                }]);
            });
        });
        
    }, function (error) {
        //console.log('Location error received: ' + error);
    });

	
}

exports.onMapReady = onMapReady;
exports.eventItemTapped = eventItemTapped;
exports.tabViewLoaded = tabViewLoaded;
exports.pageLoaded = pageLoaded;
