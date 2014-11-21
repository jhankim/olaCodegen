'use strict';

/* App Module */

var codegenApp = angular.module('codegenApp', [
	'ngCookies',
	'ngRoute',
	'codegenControllers',
	'ngAnimate',
	'angular-loading-bar',
	'oauth.io'
]);

codegenApp.factory('AuthKeys', function() {
  return {
  		client : 'b0da9_aYCOR1GaFmzaG46rzLuSc', // OAuth.io pub key
  };
});

codegenApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.

		// Widget List
		when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		}).

		// Widget List
		when('/widgets', {
			templateUrl: 'partials/widget-list.html',
			controller: 'WidgetListCtrl',
			resolve: {
				widgetListData: ['$http', '$cookieStore', 'AuthKeys' , '$location',function($http, $cookieStore, $location) {

					return $http.get('http://photorankapi-a.akamaihd.net/customers/1/widgets?auth_token='+$cookieStore.get('ola_apikey')+'&version=v2.2&count=50')
					.then(
						function success(response) { 
							return response.data; 
						},
						function error(reason)     { 
							return false; 
						}
					);

				}
			]}
		}).

		// Widget Detail page
		when('/widgets/:widgetId', {
			templateUrl: 'partials/widget-detail.html',
			controller: 'WidgetDetailCtrl',
			resolve: {
				widgetDetailData: ['$http','$route','AuthKeys','$cookieStore',function($http, $route, AuthKeys, $cookieStore) {

					return $http.get('http://photorankapi-a.akamaihd.net/widgets/' + $route.current.params.widgetId + '?auth_token='+$cookieStore.get('ola_apikey')+'&version=v2.2&count=50')
					.then(
						function success(response) { return response.data; },
						function error(reason)     { return false; }
					);

				}
			]}
		}).

		// Default
		otherwise({
			redirectTo: '/home'
		});
	}
],
function(OAuthProvider) {
  OAuthProvider.setHandler('facebook', function (OAuthData, $http) {
    $http.get('https://graph.facebook.com/me?access_token=' + OAuthData.result.access_token)
      .then(function (resp) {
        console.log(resp);
      });
    });
}
);