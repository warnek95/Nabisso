angular.module('EditUserModule', ['compareTo']);
angular.module('EditUserModule')
.controller('EditUserController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {
	$scope.password = true;
    $scope.togglePassword = function() {
        $scope.password = $scope.password === false ? true: false;
    };
}]);