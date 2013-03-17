'use strict';

/* App Module */

angular.module('mpdapp', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/dashboard', {templateUrl: 'partials/dashboard.html',   controller: DashboardCtrl}).
      when('/login', {templateUrl: 'partials/login.html', controller: LoginCtrl}).
      when('/register', {templateUrl: 'partials/register.html', controller: RegisterCtrl}).
      when('/createproject', {templateUrl: 'partials/createProject.html', controller: CreateProjectCtrl}).
      when('/createmilestone', {templateUrl: 'partials/createMilestone.html', controller: CreateMilestoneCtrl}).
      otherwise({redirectTo: '/login'});
}]);
