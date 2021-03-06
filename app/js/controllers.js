'use strict';

/* Controllers */
var codegenControllers = angular.module('codegenControllers', []);

codegenControllers.controller('HomeCtrl', ['$scope', '$http', '$location','$cookieStore',
	function ($scope, $http, $location, $cookieStore) {

		if ( $cookieStore.get('ola_apikey') ) {
			$cookieStore.remove('ola_apikey');
		}

		$scope.submit = function() {
        
		$http.get('//photorankapi-a.akamaihd.net/?auth_token=' + $scope.auth_apikey).
		  success(function(data, status, headers, config) {
		    if ( data.metadata.code == 200 ) {
		    	$cookieStore.put('ola_apikey',$scope.auth_apikey);

		    	$location.path('/widgets');
				$location.replace();
		    }
		  }).
		  error(function(data, status, headers, config) {
		    console.log(status);
		  });
      };

	}
]);

codegenControllers.controller('WidgetListCtrl', ['$scope', '$http', 'widgetListData', 'AuthKeys', '$cookieStore', '$location',
	function ($scope, $http, widgetListData, AuthKeys, $cookieStore, $location) {

		if ( !$cookieStore.get('ola_apikey') ) {
			console.log('no cookie');
			$location.path('/home');
			$location.replace();
			return false;
		}

		$scope.widgets = widgetListData.data._embedded.widgetinstance;

		$scope.orderProp = 'age';

	}
]);

codegenControllers.controller('WidgetDetailCtrl', ['$scope', '$routeParams', 'AuthKeys' , 'widgetDetailData' , '$http', '$cookieStore', '$location',
	function($scope, $routeParams, AuthKeys, widgetDetailData, $http, $cookieStore, $location) {

		if ( !$cookieStore.get('ola_apikey') ) {
			console.log('no cookie');
			$location.path('/home');
			$location.replace();
			return false;
		}

		// Toggle textarea
        $scope.code = true;
        $scope.toggleCode = function() {
            $scope.code = $scope.code === false ? true: false;
        };

		$scope.widgetSetting = widgetDetailData.data;

		var partOne = [
			"# Olapic Widget Code Instructions",
			" ",
			"Each widget will require a `<script>` that will pull content from our CMS, and a `<div>` that will be populated by our JS with the desired content. You can only have one `<script>` and one `<div>` per page template.",
			" ",
			"## Code instruction for `" + $scope.widgetSetting.name + "`",
			" ",
			"**Step 1.** Place the following `<div>` where you want to display the widget",
			" ",
			"```html",
			"<div id=\"olapic_specific_widget\"></div>",
			"```"
		].join("\n");


		var partTwoStatic = [
			" ",
			"**Step 2.** Place the following `<script>` anywhere after the `<div>` from above. This will ensure that our script finds the required `<div>`.",
			" ",
			"```html",
			"<script type=\"text/javascript\"",
			"	src=\"//photorankstatics-a.akamaihd.net/81b03e40475846d5883661ff57b34ece/static/frontend/latest/build.min.js\"",
			"	data-olapic=\"olapic_specific_widget\"",
			"	data-instance=\"" + $scope.widgetSetting.id + "\"",
			"	data-apikey=\"" + $cookieStore.get('ola_apikey') + "\"",
			"	async=\"async\">",
			"</script>",
			"```"
		].join("\n");


		var partTwoDynamic = [
			" ",
			"**Step 2.** Place the following `<script>` anywhere after the `<div>` from above. This will ensure that our script finds the required `<div>`.",
			" ",
			"```html",
			"<script type=\"text/javascript\"",
			"	src=\"//photorankstatics-a.akamaihd.net/81b03e40475846d5883661ff57b34ece/static/frontend/latest/build.min.js\"",
			"	data-olapic=\"olapic_specific_widget\"",
			"	data-instance=\"" + $scope.widgetSetting.id + "\"",
			"	data-apikey=\"" + $cookieStore.get('ola_apikey') + "\"",
			"	data-tags=\"INSERT_PRODUCT_ID_HERE\"",
			"	async=\"async\">",
			"</script>",
			"```",
			" ",
			"**[!] Important Note:** Pay close attention to the `data-tags=\"\"` attribute. Within the quotation marks, you will need to input the corresponding product/category ID (EAN/UPC or internal ID's), like so: `data-tags=\"087300700052\";`.",
			"Remember, this has to be a dynamic variable served from your PDP or CDP template, and it will need to match the ID that is within the product feed."
		].join("\n");


		if ($scope.widgetSetting.type == 'best_photos' || $scope.widgetSetting.type == 'by_gallery' || $scope.widgetSetting.type == 'by_category') {
			$scope.generatedCode = partOne + partTwoStatic;
		} else {
			$scope.generatedCode = partOne + partTwoDynamic;
		}

		var generatedCode = $scope.generatedCode;
		$scope.gistStatus = [];

		// Random String Generator
		function randomString(length, chars) {
		    var result = '';
		    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
		    return result;
		}
		var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

		OAuth.initialize(AuthKeys.client);

		$scope.createGist = function(generatedCode){

			var provider = 'github';

			OAuth.popup(provider, {'state':rString})
			.done(function(result) {

				console.log(result);

		        $http.post('https://api.github.com/gists?access_token=' + result.access_token, 
		        	{
						"description": "This gist is automatically generated for " + $scope.widgetSetting._embedded.customer.name,
						"public": false,
						"files": {
							"instructions.md": {
					    		"content": $scope.generatedCode
					    	}
					  	}
					})
		        .success(function(data, status, headers, config) {
		            if (data.msg != '') {
		                $scope.gistStatus = 'success';
		            	$scope.gistLink = 'http://gist.github.com/' + data.owner.login + '/' + data.id;
		            } else {
		            	$scope.gistStatus = 'warning';
		            }
		        })
		        .error(function(data, status) { // called asynchronously if an error occurs
		            // or server returns response with an error status.
		            $scope.gistStatus = 'error';
		        });

			    result.me()
			    .done(function (response) {
			        console.log(response);
			    })
			    .fail(function (err) {
			        //handle error with err
			    });
			})
			.fail(function (err) {
			    //handle error with err
			});

		};

		// Handle external file load
		$scope.loadScript = function(url, type, charset) {
		    if (type===undefined) type = 'text/javascript';
		    if (url) {
		        var script = document.querySelector("script[src*='"+url+"']");
		        if (!script) {
		            var heads = document.getElementsByTagName("head");
		            if (heads && heads.length) {
		                var head = heads[0];
		                if (head) {
		                    script = document.createElement('script');
		                    script.setAttribute('src', url);
		                    script.setAttribute('type', type);
		                    if (charset) script.setAttribute('charset', charset);
		                    head.appendChild(script);
		                }
		            }
		        }
		        return script;
		    }
		};

		$scope.loadScript('//photorankstatics-a.akamaihd.net/81b03e40475846d5883661ff57b34ece/static/frontend/latest/build.min.js', 'text/javascript', 'utf-8');


	}]
);