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
		$scope.clickQuery = function() {
			var xid = $scope.xid;
			if (xid[0] == 'r' || xid[0] == '~') {
        document.forms[0].action = "ledger/account.html#"+xid;
      }else if(xid.length>15){
        document.forms[0].action = "ledger/transaction.html#"+xid;
      }else{
				document.forms[0].action = "ledger/ledger.html#"+xid;
			}
      document.forms[0].submit();
		}
	});
