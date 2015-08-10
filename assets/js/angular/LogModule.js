angular.module('LogModule', ['toastr','ngRoute','ngCookies']);
angular.module('LogModule')
.controller('LogInController', ['$scope','$route','$window','$routeParams', '$location', '$http', 'toastr','$cookies', function($scope,$route,$window,$routeParams, $location, $http, toastr,$cookies) {
	$scope.logInForm = {
		loading: false
	}
	$scope.submitLogInForm = function () {
		console.log($scope._csrf)
		$http.post('/session/create', {
			pseudo: $scope.pseudo,
			mdp: $scope.mdp,
			_csrf: $scope._csrf
		})
		.then(function onSuccess (sailsResponse) {
			var logInSuccessfull = sailsResponse.status == 209;
			if (logInSuccessfull) {
				// toasterService.addToaster("Login");

  				$window.sessionStorage.setItem( 'toaster', 'LogIn' );
  				$window.sessionStorage.setItem( 'sailsResponse', JSON.stringify(sailsResponse ));
				$window.location.reload();
				return;
			};
		})
		.catch(function onError(sailsResponse) {
			// Handle known error type(s)
			// If using sails-disk adapter -- Handle Duplicate key
			var emailOrPasswordInvalid = sailsResponse.status == 410; 
			if (emailOrPasswordInvalid) {
				toastr.error(sailsResponse.data, 'Erreur');
				return;
			};
		})
		.finally(function eitherWay (argument) {
			$scope.logInForm.loading = false;
		})
	}
}]);

angular.module('LogModule')
.controller('LogOutController', ['$scope','$route','$window','$routeParams', '$location', '$http', 'toastr', function($scope,$route,$window,$routeParams, $location, $http, toastr) {
	$scope.submitLogOutForm = function () {
		console.log($scope._csrf)
		$http.post('/session/destroy', {
			_csrf: $scope._csrf
		})
		.then(function onSuccess (sailsResponse) {
			$window.sessionStorage.setItem( 'toaster', 'LogOut' );
  			$window.sessionStorage.setItem( 'sailsResponse', JSON.stringify(sailsResponse ));
			var logInSuccessfull = sailsResponse.status == 210;
				$window.location.reload();
				return;
		})
		.catch(function onError(sailsResponse) {
			// Handle known error type(s)
			// If using sails-disk adapter -- Handle Duplicate key
		})
		.finally(function eitherWay (argument) {
			$scope.logInForm.loading = false;
		})
	}
}]);