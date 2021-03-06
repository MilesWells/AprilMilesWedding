angular.module('WeddingApp')
    .controller('HomeCtrl', function ($scope, $rootScope, $location, $http, BlogPostService) {
        let self = this;
        $scope.user = $rootScope.getUser();

        self.refreshBlog = function() {
            BlogPostService.getAllBlogPosts()
                .then(result => {
                    $scope.blogPosts = result.data.Items;
                });
        };

        $scope.$watch(
            () => $rootScope.user,
            () => {
                $scope.user = $rootScope.user;
            }, true);

        $rootScope.$on('$locationChangeSuccess', () => {
            $scope.showNavBar = $location.path().trim() !== '/';

            if(!$scope.showNavBar) {
                self.refreshBlog();
            }
        });

        $scope.logout = function() {
            $http.get('/logout')
                .then(() => {
                    $rootScope.setUser(null);

                    $location.url('/');
                });
        };

        $scope.deleteBlogPost = function(postId) {
            BlogPostService.deleteBlogPost(postId)
                .then(() => {
                    self.refreshBlog()
                });
        };

        self.refreshBlog();
    });