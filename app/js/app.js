'use strict';

/* App Module */

var codegenApp = angular.module('codegenApp', [
	'ngRoute',
	'codegenControllers',
	'ngAnimate',
	'angular-loading-bar',
]);

codegenApp.factory('AuthKeys', function() {
  return {
      olapic : 'f48eeae508d1b1f3133df366679eb2b567bae5dc8058d69d679dc5cb140eb857',
      github : 'd0ba313ad6893a528bbb54ac6a651efd99390477'
  };
});

codegenApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.

		// Widget List
		when('/widgets', {
			templateUrl: 'partials/widget-list.html',
			controller: 'WidgetListCtrl',
			resolve: {
				widgetListData: ['$http', 'AuthKeys',function($http, AuthKeys) {

					return $http.get('http://photorankapi-a.akamaihd.net/customers/1/widgets?auth_token='+AuthKeys.olapic+'&version=v2.2&count=50')
					.then(
						function success(response) { return response.data; },
						function error(reason)     { return false; }
					);

				}
			]}
		}).

		// Widget Detail page
		when('/widgets/:widgetId', {
			templateUrl: 'partials/widget-detail.html',
			controller: 'WidgetDetailCtrl',
			resolve: {
				widgetDetailData: ['$http','$route','AuthKeys',function($http, $route, AuthKeys) {

					return $http.get('http://photorankapi-a.akamaihd.net/widgets/' + $route.current.params.widgetId + '?auth_token='+AuthKeys.olapic+'&version=v2.2&count=50')
					.then(
						function success(response) { return response.data; },
						function error(reason)     { return false; }
					);

				}
			]}
		}).

		// Default
		otherwise({
			redirectTo: '/widgets'
		});
	}
]);