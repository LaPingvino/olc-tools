var cacheresult = false;
function messages(olctag, elem) {
	olctag = olctag.toLowerCase();
	if (cacheresult) { return }
	hivejs.api.getDiscussionsByCreated({
		tag: olctag,
		limit: 10,
	}, function(err, result) {
		console.log(err, result);
		elem.innerHTML='<div id="gettag">Your local hashtag is #'+olctag+'</div>'+
			'<div id="twitter"><a href="https://twitter.com/hashtag/'+olctag+'">See tweets around you</a> - <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwhenwhere.cf&hashtags='+olctag+'">Write a tweet for people around you</a></div>'+
			'<div id="facebook"><a href="https://www.facebook.com/hashtag/'+olctag+'">Find local messages on Facebook</a> - You can create a public post with #'+olctag+' in it to be found there</div>'+
			'<div id="instagram"><a href="https://www.instagram.com/explore/tags/'+olctag+'/">Find local posts on Instagram and follow them there</a> (post with #'+olctag+' to make your pictures appear there)</div>'+
			'<div id="postmessage"><a href="https://hive.blog/submit.html?category='+olctag+'">Write a message on HIVE to the people around you</a></div>';
		for (var i = 0; i < result.length; i++) {
			elem.innerHTML += '<div class="message">' + markdown.toHTML(result[i].body) + '</div>';
		}
		cacheresult = result;
	});
}
