var oldtag = "";

function spiral(distance) {
  // https://mathoverflow.net/questions/29038/ulam-spiral-coordinate-system
  let k = Math.ceil((Math.sqrt(distance) - 1) / 2);
  let t = 2 * k + 1;
  let m = t * t;
  t--;
  if (distance >= m - t) {
    return [k - (m - distance), -k];
  } else {
    m = m - t;
  }
  if (distance >= m - t) {
    return [-k, -k + (m - distance)];
  } else {
    m = m - t;
  }
  if (distance >= m - t) {
    return [-k + (m - distance), k];
  } else {
    return [k, k - (m - distance - t)];
  }
}

function getdtag(tag, distance) {
  let iterate = "23456789cfghjmpqrvwx";
  let geti = {
    2: 0,
    3: 1,
    4: 2,
    5: 3,
    6: 4,
    7: 5,
    8: 6,
    9: 7,
    c: 8,
    f: 9,
    g: 10,
    h: 11,
    j: 12,
    m: 13,
    p: 14,
    q: 15,
    r: 16,
    v: 17,
    w: 18,
    x: 19,
  };
  let ntag = [
    geti[tag[3]],
    geti[tag[4]],
    geti[tag[5]],
    geti[tag[6]],
    geti[tag[7]],
    geti[tag[8]],
  ];
  let sc = spiral(distance);
  let x = sc[0];
  let y = sc[1];
  // This loop processes the ntag array in three pairs of values, iterating from the
  // end of the array towards the beginning (pairs are [ntag[5], ntag[4]],
  // then [ntag[3], ntag[2]], then [ntag[1], ntag[0]]).
  // In each iteration:
  // 1. It retrieves a pair of values (cx, cy) from ntag. `cx` can be thought of as
  //    an "x-like" component and `cy` as a "y-like" component of the pair.
  // 2. It updates these `ntag` elements based on the current `x` and `y` coordinates
  //    (which are initially from the `spiral` function and then become carry-overs
  //    from the previous pair's processing). The `+ 100` ensures the operand for
  //    the modulo `% 20` operation is positive, providing a consistent positive remainder,
  //    as spiral coordinates (x, y) can be negative.
  // 3. It then calculates new `x` and `y` values. These act as "carry-over" values,
  //    propagated to the transformation of the next pair of `ntag` elements (or used
  //    after the loop if it were to continue). They are derived from the integer
  //    division by 20 of the sums (before modulo) used in step 2.
  for (let l = 0; l < 6; l += 2) {
    let cx = ntag[5 - l]; // Current 'x-like' component from ntag (e.g., ntag[5], ntag[3], ntag[1])
    let cy = ntag[4 - l]; // Current 'y-like' component from ntag (e.g., ntag[4], ntag[2], ntag[0])

    // Store the values of x and y as they are at the beginning of this iteration.
    // These will be used for calculations within this iteration, as the main
    // x and y variables will be updated to become the carry-overs for the *next* iteration.
    let x_for_this_iteration = x;
    let y_for_this_iteration = y;

    // Update the current pair of ntag elements.
    // ntag[4-l] (y-like part of pair) is updated using y_for_this_iteration.
    // ntag[5-l] (x-like part of pair) is updated using x_for_this_iteration.
    ntag[4 - l] = (cy + y_for_this_iteration + 100) % 20;
    ntag[5 - l] = (cx + x_for_this_iteration + 100) % 20;

    console.log(
      l,
      y_for_this_iteration,
      x_for_this_iteration,
      ntag[4 - l],
      ntag[5 - l],
    );

    // Calculate the "carry-over" values for the next iteration.
    // The new 'x' carry is derived from the 'y-like' component (cy) and y_for_this_iteration.
    x = Math.floor((cy + y_for_this_iteration) / 20);

    // The new 'y' carry is derived from the 'x-like' component (cx) and x_for_this_iteration.
    // CORRECTED BUG: The original code used the *newly updated* 'x' (from the line above)
    // in this calculation (i.e., `Math.floor((cx + x) / 20)` where `x` was already updated).
    // It now correctly uses 'x_for_this_iteration' (the value of 'x' at the start of this
    // iteration), ensuring both carry-overs are based on the input state of this iteration.
    y = Math.floor((cx + x_for_this_iteration) / 20);
  }
  let rtag =
    "geo" +
    iterate[ntag[0]] +
    iterate[ntag[1]] +
    iterate[ntag[2]] +
    iterate[ntag[3]] +
    iterate[ntag[4]] +
    iterate[ntag[5]];
  console.log(tag, distance, rtag);
  return rtag;
}

// Replaced stub with actual Bluesky API integration
function fetchBlueskyPostsByTag(tag, limit, callback) {
  console.log(`[API] Fetching Bluesky posts for tag: #${tag}, limit: ${limit}`);
  const API_BASE_URL = "https://api.bsky.app/xrpc/app.bsky.feed.searchPosts";
  // The 'q' parameter is used for general search. To search for a tag,
  // we prepend '#' to the tag.
  // 'sort=latest' is default, but explicit.
  const searchQuery = `#${tag}`;
  const url = `${API_BASE_URL}?q=${encodeURIComponent(searchQuery)}&limit=${limit}&sort=latest`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        // Try to get error message from Bluesky if available
        return response
          .json()
          .then((errData) => {
            throw new Error(
              `HTTP error! status: ${response.status}, message: ${errData.message || "Unknown error"}`,
            );
          })
          .catch(() => {
            // If parsing error response fails, throw generic error
            throw new Error(`HTTP error! status: ${response.status}`);
          });
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.posts) {
        callback(null, data.posts);
      } else {
        // Response structure might be different than expected, or posts array is missing
        console.warn(
          `[API] Unexpected response structure for tag #${tag}:`,
          data,
        );
        callback(null, []); // Treat as no posts found
      }
    })
    .catch((error) => {
      console.error(
        `[API] Error fetching Bluesky posts for tag #${tag}:`,
        error,
      );
      callback(error, null);
    });
}

function messages(olctag, elem, local) {
  olctag = olctag.toLowerCase();
  if (olctag == oldtag) {
    return;
  }
  elem.innerHTML =
    '<div id="gettag">Your ' +
    (local ? "local" : "destination") +
    " hashtag is #" +
    olctag +
    "</div>" +
    '<div id="social-media">You can look for posts with #' +
    olctag +
    ' on <a href="https://bsky.app/search?q=%23' +
    olctag +
    '" target="_blank">Bluesky</a> and <a href="https://bsky.app/intent/compose?text=%23' +
    olctag +
    '" target="_blank">post with the tag</a>. Add #' +
    olctag +
    " to your posts on Bluesky to make them findable by people nearby.</div>" +
    '<div id="IRC"> Chat with your region at <a href="https://web.libera.chat/#whenwhere.cf,##' +
    olctag +
    '">Libera.Chat (IRC)</a>!</div>' +
    "<hr />";
  let m = 10; // Target number of messages to display
  let d = 0; // Iteration counter / distance for getdtag

  function getLocData() {
    let msgtag = getdtag(olctag, d);

    fetchBlueskyPostsByTag(msgtag, 10, function (err, result) {
      // Using a limit of 10 for API call
      if (err) {
        console.error(
          `[API] Error fetching Bluesky posts for #${msgtag}:`,
          err,
        );
        let detailedErrorMessage = `Error fetching posts for #${msgtag} from Bluesky.`;
        if (err.message) {
          detailedErrorMessage += ` Details: ${err.message}.`;
        }

        if (
          err instanceof TypeError &&
          (err.message.toLowerCase().includes("failed to fetch") ||
            err.message.toLowerCase().includes("networkerror"))
        ) {
          detailedErrorMessage +=
            " This might be a network connectivity issue or a Cross-Origin Resource Sharing (CORS) restriction. If you are running this from a local file or a different domain than the API, the browser's security policy might be blocking the request. Check your network connection and the browser's console for more specific CORS errors.";
        }
        elem.innerHTML += `<div class="message error"><small>${detailedErrorMessage}</small></div>`;
        console.log(
          `[API] Fetching stopped for ${olctag} due to an error with #${msgtag}.`,
        );
        return; // Stop trying to fetch further on error
      }

      // No error, proceed with processing results
      console.log(
        `[API] Received ${result ? result.length : 0} Bluesky posts for ${msgtag}:`,
        result,
      );
      if (result && result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          if (m <= 0) break; // Stop adding if we've hit the target

          let post = result[i];
          // Ensure post structure is as expected (app.bsky.feed.defs.postView)
          if (!post || !post.author || !post.record) {
            console.warn(
              "[API] Skipping post with unexpected structure:",
              post,
            );
            continue;
          }

          // Construct URL to the post on bsky.app
          // rkey is the last part of the uri.
          let postUrl = `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split("/").pop()}`;

          let authorDisplayName = post.author.displayName || post.author.handle;
          let postText = post.record.text || "[no text content]";

          // Basic HTML structure for a post
          elem.innerHTML += `<div class="message">
																																													<small>#${msgtag}
																																															<a href="${postUrl}" target="_blank">Post by @${authorDisplayName}</a>
																																															${post.record.createdAt ? " - " + new Date(post.record.createdAt).toLocaleString() : ""}
																																													</small>
																																													<div>${postText.replace(/\n/g, "<br>")}</div>
																																											</div>`;
          m--; // Decrement count of messages still needed
        }
      } else {
        // Optionally, indicate no posts were found for this specific msgtag if desired
        // elem.innerHTML += `<div class="message"><small>No new posts found for #${msgtag} on Bluesky in this batch.</small></div>`;
      }

      d++;
      console.log(
        "Bluesky data processed for " +
          msgtag +
          ". Messages remaining to target (m):",
        m,
        "Iteration (d):",
        d,
      );

      // Continue fetching if more messages are desired (m > 0) and we haven't hit the iteration limit (d < 400)
      // This part is only reached if there was no error in fetchBlueskyPostsByTag
      if (d < 400 && m > 0) {
        let wait;
        // d is the count of fetches already completed.
        // For the next fetch (d is 1-indexed here, e.g., d=1 means 1 fetch completed):
        if (d < 3) {
          // For the 2nd and 3rd fetches (i.e., when d is 1 or 2)
          wait = 500; // Fast
        } else if (d < 8) {
          // For the 4th through 8th fetches (i.e., when d is 3, 4, 5, 6, 7)
          wait = 1000; // Medium
        } else {
          // For the 9th fetch onwards (i.e., when d >= 8)
          wait = 1500; // Slow
        }
        setTimeout(getLocData, wait);
      } else {
        console.log(
          "Stopping Bluesky data fetch for " +
            olctag +
            ". Conditions: d=" +
            d +
            ", m=" +
            m,
        );
        if (m > 0 && d >= 400) {
          // Only show "reached iteration limit" if that was the reason
          elem.innerHTML += `<div class="message"><small>Stopped fetching further messages. Reached iteration limit for #${olctag}.</small></div>`;
        } else if (m <= 0 && result && result.length > 0) {
          // Only if we actually got some posts and then m hit 0
          // This message might be too verbose if shown every time.
          // elem.innerHTML += `<div class="message"><small>Reached target number of messages for #${olctag}.</small></div>`;
        }
      }
    });
  }
  getLocData();
  oldtag = olctag;
}
