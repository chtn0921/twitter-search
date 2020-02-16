app.controller('MainCtrl', function($scope, $filter, auth, posts) {
    //setting title to blank here to prevent empty posts
    $scope.title = 'Home';
    $scope.searchText;
    $scope.posts = [];
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.inProgress = false;

    $scope.createdDateTime = function(dateStr) {
        return $filter('date')(new Date(dateStr), 'medium');
    }

    $scope.searchTweets = function() {
        if ($scope.searchText) {
            $scope.inProgress = true;
            posts.searchTweets($scope.searchText).
            then(function(response) {
                $scope.posts = response;
            }).finally(function() {
                $scope.inProgress = false;
            });
        }
    }
});

app.controller('AuthCtrl', function($scope, $state, auth) {
    $scope.user = {};

    $scope.register = function() {
        $scope.error = null;
        auth.register($scope.user).catch(function(error) {
            $scope.error = error.data;
        }).then(function() {
            if (!$scope.error) {
                $state.go('home');
            }
        });
    };

    $scope.logIn = function() {
        $scope.error = null;
        auth.logIn($scope.user).catch(function(error) {
            $scope.error = error.data;
        }).then(function() {
            if (!$scope.error) {
                $state.go('home');
            }
        });
    };
});

app.controller('NavCtrl', function($scope, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
});