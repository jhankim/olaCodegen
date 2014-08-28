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
      olapic : '',
      github : ''
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