var view = require('ui/core/view');
var http = require('http');
var appSettings = require('application-settings');
var frames = require('ui/frame');
var gestures = require('ui/gestures');
var animation = require('ui/animation');

var baseUri = 'http://104.168.141.225:2080/api/';
var usernameTextField;
var passwordTextField;
var loginButton;

function pageLoaded(args) {
    var page = args.object;

    var gridContainer = page.getViewById('gridLoginContainer');

    usernameTextField = page.getViewById('tfUsername');

    passwordTextField = page.getViewById('tfPassword');

    loginButton = page.getViewById('loginButton');

    var definitions = new Array();
    definitions.push({target: usernameTextField, opacity: 1, duration: 500});
    definitions.push({target: passwordTextField, opacity: 1, duration: 500});
    definitions.push({target: loginButton, opacity: 1, duration: 500});
    var animationSet = new animation.Animation(definitions, true);
    animationSet.play();
    
    gridContainer.observe(gestures.GestureTypes.tap, function (args) {
        usernameTextField.dismissSoftInput();
        passwordTextField.dismissSoftInput();
    });
}

exports.pageLoaded = pageLoaded;

exports.loginButtonTapped = function () {
    console.log('Username entered: ' + usernameTextField.text);
    var username = usernameTextField.text;

    console.log('https://104.168.141.225:2080/api/users/get_userdetails/?username=' + username);
    
    var url = baseUri + 'https://104.168.141.225:2080/api/users/get_userdetails/?username=' + usernameTextField.text

    var result;

    http.getJSON('http://104.168.141.225:2080/api/users/get_userdetails/?username=' + usernameTextField.text).then(function(r) {
        if (passwordTextField.text == r.password) {
            appSettings.setString('username', username);
			frames.topmost().navigate('main-page');
        }
    }, function (e) {
        console.log(e);
    });
};