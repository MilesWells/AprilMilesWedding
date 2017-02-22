angular.module('WeddingApp').factory('BlogPostService', [
    '$http', 'toastr',
    ($http, toastr) => {

        return {
            getAllBlogPosts: getAllBlogPosts,
            getBlogPost: getBlogPost,
            addBlogPost: addBlogPost,
            deleteBlogPost: deleteBlogPost
        };

        function getAllBlogPosts() {
            return $http.get('/blogPosts')
                .success(data => data)
                .error(error => {
                    toastr.error('Unable to retrieve blog posts.');
                    return error;
                });
        }

        function getBlogPost(blogPostId) {
            return $http.get('/blogPosts/' + blogPostId)
                .success(data => data)
                .error(error => {
                    toastr.error('Unable to retrieve blog post.');
                    return error;
                });
        }

        function addBlogPost(blogPost) {
            return $http.post('/blogPosts', { blogPost: blogPost })
                .success(() => {
                    toastr.success('Your blog post has been added!');
                    return null;
                })
                .error(error => {
                    toastr.error('Unable to add your blog post.');
                    return error;
                });
        }

        function deleteBlogPost(blogPostId) {
            return $http.delete('/blogPosts/' + blogPostId)
                .success(() => {
                    toastr.success('Your blog post has been removed!');
                    return null;
                })
                .error(error => {
                    toastr.error('Unable to remove your blog post.');
                    return error;
                });
        }
    }]);