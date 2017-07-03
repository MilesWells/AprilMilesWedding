angular.module('WeddingApp')
    .controller('HomeCtrl', function ($scope, $rootScope, $location, $http, $interval, BlogPostService, Finder) {
        let self = this;
        $scope.user = $rootScope.getUser();

        $scope.photos = [
            { path: 'images/bg-splash.png' },
            { path: 'images/newimgweddingsite.jpeg' }
        ];

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
            console.log(postId);
            BlogPostService.deleteBlogPost(postId)
                .then(() => {
                    self.refreshBlog()
                });
        };

        $scope.onGalleryInit = function(gallery) {
            $interval(function() {
                gallery.animateNext();
            }, 5000);
        };

        self.refreshBlog();
    });