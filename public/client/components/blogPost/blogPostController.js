angular.module('WeddingApp')
    .controller('BlogPostCtrl', function ($scope, $rootScope, BlogPostService) {
        $scope.user = $rootScope.getUser();
        $scope.blogTitle = $scope.blogTitle || 'Enter the title here';
        $scope.blogContent = $scope.blogContent || '';

        $scope.createPost = function() {
            let user = $rootScope.getUser();
            BlogPostService.addBlogPost({
                UserId: user.UserId,
                BlogTitle: $scope.blogTitle,
                BlogHtml: $scope.blogContent
            }).then(result => {
                if(result.status == 200) {
                    // reset form on success
                    $scope.blogTitle = 'Enter the title here';
                    $scope.blogContent = '';
                }
            });
        };
    });