'use strict';

angular.module('rippleokApp')
	.config(function($stateProvider) {
		$stateProvider
			.state('main', {
				url: '/',
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl'
			});
	})
	.filter('exchgrate', function() {
		return function(input, tocur, cur) {
			if (cur == tocur) return input;
			if (cur == 'BTC') return 1 / input;
			if (tocur == 'USD') {
				if (ExchgRate[cur]) return input / ExchgRate[cur];
			} else {
				if (ExchgRate[cur]) return input * ExchgRate['CNY'] / ExchgRate[cur];
			}
			return input;
		}
	});
