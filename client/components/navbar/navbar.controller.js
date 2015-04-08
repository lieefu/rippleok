'use strict';

angular.module('rippleokApp')
	.controller('NavbarCtrl', function($scope, $location, Auth) {
		$scope.menu = [];
		//  [{
		//   'title': 'Home',
		//   'link': '/'
		// }];

		$scope.isCollapsed = true;
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.isAdmin = Auth.isAdmin;
		$scope.getCurrentUser = Auth.getCurrentUser;

		$scope.logout = function() {
			Auth.logout();
			$location.path('/login');
		};

		$scope.isActive = function(route) {
			return route === $location.path();
		};
		$scope.clickQuery = function(data) {
			var address = $('#address')[0].value.trim();
			if (address[0] == 'r' || address[0] == '~') {
        document.forms[0].action = "ledger/account.html#"+address;
      }else{
        document.forms[0].action = "ledger/transaction.html#"+address;
      }
      document.forms[0].submit();
		}
	});
