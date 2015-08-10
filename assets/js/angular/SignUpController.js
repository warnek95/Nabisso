angular.module('SignUpModule')
.controller('SignUpController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {
	$scope.signUpForm = {
		loading: false
	}

	$scope.submitSignupForm = function () {
		$scope.signUpForm.loading = true;
		$http.post('/signup', {
			name: $scope.signupForm.name,
			title: $scope.signupForm.title,
			email: $scope.signupForm.email,
			password: $scope.signupForm.password
		})
		.then(function onSuccess () {
			window.location = '/user';
		})
		.catch(function onError(sailsResponse) {
			// Handle known error type(s)
			// If using sails-disk adapter -- Handle Duplicate key
			var emailAddressAlreadyInUse = sailsResponse.status == 409;
			if (emailAddressAlreadyInUse) {
				toastr.error('That email address has already been taken, please try again.', 'Error');
				return;
			};
		})
		.finally(function eitherWay (argument) {
			$scope.signUpForm.loading = false;
		})
	}
}]);