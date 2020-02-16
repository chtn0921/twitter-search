app.factory('auth', ['$http', '$window', '$state',
    function($http, $window, $state) {
        var auth = {};

        auth.saveToken = function(token) {
            $window.localStorage['vod-auth-token'] = token;
        };

        auth.getToken = function() {
            return $window.localStorage['vod-auth-token'];
        };

        auth.logOut = function() {
            $window.localStorage.removeItem('vod-auth-token');
            $state.go('login');
        };

        auth.isLoggedIn = function() {
            var token = auth.getToken();
            if ((token != 'undefined') && (token != null) && (token != "")) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function() {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.register = function(user) {
            return $http.post('/register', user).then(function(data) {
                auth.saveToken(data.data.token);
            });
        };

        auth.logIn = function(user) {
            return $http.post('/login', user).then(function(data) {
                auth.saveToken(data.data.token);
            });
        };

        return auth;
    }
]);

app.factory('posts', ['$http', 'auth',
    function($http, auth) {
        var o = {
            searchTweets: function(searchText) {
                return $http({
                    url: '/tweets',
                    method: "GET",
                    params: { source: searchText },
                    headers: { Authorization: 'Bearer ' + auth.getToken() }
                }).then(function(response) {
                    return response.data.statuses;
                }, function(error) {
                    return error;
                });
            }
        };
        return o;
    }
]);