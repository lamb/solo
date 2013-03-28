exports.getBlogById = function(blogId){

	var blog = global.blog.blogs.filter(function(blogItem){

		return blogItem.id === blogId;

	});

	if(!blog.length){
		return false;
	}else{
		return blog[0];
	}

};

exports.getBlogsByIds = function(blogIds){

	var blogs = global.blog.blogs.filter(function(blogItem){

		if(blogIds.indexOf(blogItem.id) > -1){
			return true;
		}else{
			return false;
		}

	});

	return blogs;

};