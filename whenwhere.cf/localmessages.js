var oldtag = '';

function spiral(distance) {
	// https://mathoverflow.net/questions/29038/ulam-spiral-coordinate-system
	let k=Math.ceil((Math.sqrt(distance)-1)/2);
	let t=2*k+1;
	let m=t*t;
	t--;
	if (distance>=m-t) {
		return [k-(m-distance),-k];
	} else {
		m=m-t;
	}
	if (distance>=m-t) {
		return [-k,-k+(m-distance)];
	} else {
		m=m-t;
	}
	if (distance>=m-t) {
		return [-k+(m-distance),k];
	} else {
		return [k,k-(m-distance-t)];
	}
}

function getdtag(tag, distance) {
	let iterate = "23456789cfghjmpqrvwx";
	let geti = { "2": 0, "3": 1, "4": 2, "5": 3, "6": 4, "7": 5, "8": 6, "9": 7,
		     "c": 8, "f": 9, "g": 10, "h": 11, "j": 12, "m": 13, "p": 14, 
		     "q": 15, "r": 16, "v": 17, "w": 18, "x": 19 }
	let ntag = [geti[tag[3]], geti[tag[4]],geti[tag[5]],geti[tag[6]],geti[tag[7]],geti[tag[8]]];
	let sc = spiral(distance);
	let x = sc[0];
	let y = sc[1];
	for (let l = 0; l < 6; l+=2) {
		let cx = ntag[5-l];
		let cy = ntag[4-l];
		ntag[4-l] = (cy+y+100)%20;
		ntag[5-l] = (cx+x+100)%20;
		console.log(l,y,x,ntag[4-l],ntag[5-l]);
		x = Math.floor((cy+y)/20);
		y = Math.floor((cx+x)/20);
	}
	let rtag = "geo"+iterate[ntag[0]]+iterate[ntag[1]]+iterate[ntag[2]]+iterate[ntag[3]]+iterate[ntag[4]]+iterate[ntag[5]];
	console.log(tag,distance,rtag);
	return rtag;
}

function messages(olctag, elem, local) {
	olctag = olctag.toLowerCase();
	if (olctag == oldtag) { return }
	elem.innerHTML='<div id="gettag">Your '+ (local?'local':'destination')+ ' hashtag is #'+olctag+'</div>'+
			'<div id="social-media">You can look for it on <a href="https://twitter.com/hashtag/'+olctag+'">Twitter</a> and <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwhenwhere.cf&hashtags='+olctag+'">tweet with the tag</a>, find posts on <a href="https://www.facebook.com/hashtag/'+olctag+'">Facebook</a> or follow local messages on <a href="https://www.instagram.com/explore/tags/'+olctag+'/">Instagram.</a> On all these networks, add #'+olctag+' as a tag to your post to make it findable to people around you.</div>'+
			'<div id="IRC"> Chat with your region at <a href="https://web.libera.chat/#whenwhere.cf,##'+olctag+'">Libera.Chat (IRC)</a>!</div>'+
			'<hr /><div id="postmessage"><a href="https://hive.blog/submit.html?category='+olctag+'">Write on Hive to people nearby</a> - <a href="https://signup.hive.io/">Create a Hive account to start writing</a></div>';
	let m = 100;
	let d = 0;
	function getLocData(){
		let msgtag = getdtag(olctag, d);
		hivejs.api.getDiscussionsByTrending({
			tag: msgtag,
			limit: 10,
		}, function(err, result) {
			console.log(err, result);
			for (var i = 0; i < result.length; i++) {
				elem.innerHTML += '<div class="message"><small>#' + msgtag + ' <a href="https://hive.blog' +
					result[i].url + '">'+result[i].title+'</a> @'+ result[i].author +'</small>'+
					markdown.toHTML(result[i].body) + '</div>';
			}
			m -= result.length;
		});
		d++;
		console.log("location written...",m,d);
		let wait = 1000;
		if (d > 1) wait = 500;
		if (d > 9 || m < 1) wait = 100;
		if (d < 400 && m > 0) setTimeout(getLocData, wait);
	}
	getLocData();
	oldtag = olctag;
}
