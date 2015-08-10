var module = angular.module('app.controllers', ['ngCookies','toastr']);

/**
 * Controlleur des cartes.
 */
module.controller('CardController', ['$scope','$q','$http',  function($scope,$q,$http) {
    
  var postDeferred = $q.defer();
   $http
      .get('http://localhost:1337/video/findTitles', {
       })
       .success(function (data,status) {
        postDeferred.resolve(data);
       });
     postDeferred.promise
     .then(function(data) {
          $scope.cardslist = data;
      }, function(error) {
          console.log('My first promise failed', error);
      });

  
  // saisie du nom de la carte
  $scope.card = null;
    
}]);

module.controller('MiscController', ['$scope','$q','$http','$cookies','$window','toastr',  function($scope,$q,$http,$cookies,$window,toastr) {
  var toaster = $window.sessionStorage.getItem( 'toaster' );
  if ($window.sessionStorage.getItem( 'sailsResponse' ) != 'null') {
    var sailsResponse = JSON.parse($window.sessionStorage.getItem( 'sailsResponse' ));
  };
  if (toaster == 'LogIn' && sailsResponse != 'null') {
    toastr.success(sailsResponse.data.replace('\n','<br />'), 'Connecté', {
      allowHtml: true
    });
  } else if ( toaster == 'LogOut' ) { 
    toastr.success(sailsResponse.data, 'Déconnecté');
  }
  $window.sessionStorage.setItem( 'toaster', '' );
  $window.sessionStorage.setItem( 'sailsResponse', 'null');
}]);

