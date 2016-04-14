var app = angular.module('requestLog', []);

app.controller('requestsCtrl', function ($http, $scope) {
  $scope.requests = [];

  $http.get('/requests').then(function (response) {
    $scope.requests = $scope.requests.concat(response.data);
  });

  $scope.$on('REQUEST_RECEIVED', function(e, msg) {
    $scope.requests.push(msg);
  });
});

app.run(function ($rootScope) {
  var websocket = io();
  websocket.on('request received', function (msg) {
    $rootScope.$apply(function() {
      $rootScope.$broadcast('REQUEST_RECEIVED', msg);
    });
  });
});

