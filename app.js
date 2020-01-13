'use strict';

angular.
module('SchedulerApp', ['ngCookies',
    'ngGrid',
    'ui',
    'ui.bootstrap',
    'ui.calendar',
    'admin',
    'security',
    'directives.validate',
    'directives.ngMax',
    'colorpicker.module',
    'directives.datetime',
    '$strap.directives',
    'services.loading',
    'services.i18nNotifications',
    'services.misc',
    'services.users',
    'services.events',
    'services.resources'
]).
constant('app.config', {
  name: 'Resource Scheduler',
  version: '1.0.2',
  apiUri: 'https://mastercalendar.cvcaroyals.org/api/', //Restful connection point
  apiDateFormat: 'YYYY-MM-DD HH:mm:ss', //Format that dates come from the api in - MAY NOT NEED THIS
}).
config(['$routeProvider',
  function($routeProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).
    when('/account', {
      templateUrl: 'views/account.html',
      controller: 'AccountCtrl'
    }).
    when('/calendar', {
      templateUrl: 'views/calendar.html',
      controller: 'CalendarCtrl'
    }).
    when('/help', {
      templateUrl: 'views/help.html',
      controller: 'HelpCtrl'
    }).
    when('/events/create', {
      templateUrl: 'views/events.update.tpl.html',
      controller: 'EventsUpdateCtrl'
    }).
    when('/events/create/start/:start', {
      templateUrl: 'views/events.update.tpl.html',
      controller: 'EventsUpdateCtrl'
    }).
    when('/events/update/:id', {
      templateUrl: 'views/events.update.tpl.html',
      controller: 'EventsUpdateCtrl'
    }).
    when('/reports', {
      templateUrl: 'views/reports.html',
      controller: 'ReportsCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  }
]).
config(['$httpProvider',
  function($httpProvider) {
    //CORS
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    //delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.responseInterceptors.push('onErrorInterceptor');
  }
]).
factory('onErrorInterceptor', ['$q', 'i18nNotifications',
  function($q, i18nNotifications) {
    function success(response) {
      //No need to do anything with successfull responses
      return response;
    }

    function error(response) {
      if (response) {
        //These error responses are what we're looking for

        i18nNotifications.pop('api.general.error', 'error', {
          msg: response.data ? response.data : 'Internal Server Error'
        });

      }
      return $q.reject(response);
    }

    return function(promise) {
      return promise.then(success, error);
    };
  }
]).
run(['security',
  function(security) {
    // Get the current user when the application starts
    // (in case they are still logged in from a previous session)
    security.requestCurrentUser();
  }
]);
