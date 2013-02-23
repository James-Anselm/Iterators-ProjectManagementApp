'use strict';

/* App Module */

angular.module('rateMyInterview', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/dashboard', {templateUrl: 'partials/dashboard.html',   controller: DashboardCtrl}).
      when('/login', {templateUrl: 'partials/login.html', controller: LoginCtrl}).
      when('/register', {templateUrl: 'partials/register.html', controller: RegisterCtrl}).
      when('/createProject', {templateUrl: 'partials/createProject.html', controller: CreateProjectCtrl}).
      otherwise({redirectTo: '/login'});
}]);
