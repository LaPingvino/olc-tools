let oldtag = "";

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
  const iterate = "23456789cfghjmpqrvwx";
  const geti = {
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

  // Process ntag (tag components) in three pairs, from end to start.
  // In each step:
  // 1. `cx`, `cy` are values from the current `ntag` pair.
  // 2. Update the `ntag` pair using `x` and `y` (initially from `spiral`, then carry-overs).
  //    `+ 100` ensures the modulo operand is positive, as `x`, `y` can be negative.
  // 3. Calculate new `x`, `y` as "carry-over" values for the next pair, using integer division by 20.
  for (let l = 0; l < 6; l += 2) {
    let cx = ntag[5 - l];
    let cy = ntag[4 - l];

    // Preserve current x, y for this iteration's calculations.
    // x and y will be updated to be carry-overs for the *next* iteration.
    let x_for_this_iteration = x;
    let y_for_this_iteration = y;

    // Update current ntag pair.
    ntag[4 - l] = (cy + y_for_this_iteration + 100) % 20;
    ntag[5 - l] = (cx + x_for_this_iteration + 100) % 20;

    console.log(
      l,
      y_for_this_iteration,
      x_for_this_iteration,
      ntag[4 - l],
      ntag[5 - l],
    );

    // Calculate 'x' carry-over for the next iteration.
    x = Math.floor((cy + y_for_this_iteration) / 20);
    // Calculate 'y' carry-over for the next iteration.
    // BUGFIX: Uses x_for_this_iteration (original x for this step) not the just-updated carry x.
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

function fetchBlueskyPostsByTag(tag, limit, callback) {
  console.log(`[API] Fetching Bluesky posts for tag: #${tag}, limit: ${limit}`);
  const API_BASE_URL = "https://api.bsky.app/xrpc/app.bsky.feed.searchPosts";
  // 'q' parameter for general search; prepend '#' for tags.
  // 'sort=latest' is default.
  const searchQuery = `#${tag}`;
  const url = `${API_BASE_URL}?q=${encodeURIComponent(searchQuery)}&limit=${limit}&sort=latest`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        // Try to get error message from Bluesky.
        return response
          .json()
          .then((errData) => {
            throw new Error(
              `HTTP error! status: ${response.status}, message: ${errData.message || "Unknown error"}`,
            );
          })
          .catch(() => {
            // If parsing error response fails.
            throw new Error(`HTTP error! status: ${response.status}`);
          });
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.posts) {
        callback(null, data.posts);
      } else {
        // Unexpected response structure or missing posts array.
        console.warn(
          `[API] Unexpected response structure for tag #${tag}:`,
          data,
        );
        callback(null, []); // Treat as no posts found.
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
  if (olctag === oldtag) {
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
    '" target="_blank">Bluesky</a>' +
    ' and <a href="https://bsky.app/intent/compose?text=%23' +
    olctag +
    '" target="_blank">post with the tag</a>. Add #' +
    olctag +
    " to your posts on Bluesky to make them findable by people nearby.</div>" +
    '<div id="IRC"> Chat with your region at <a href="https://web.libera.chat/#whenwhere.cf,##' +
    olctag +
    '">Libera.Chat (IRC)</a>!</div>' +
    "<hr />";

  let m = 10; // Target number of messages to display.
  let d = 0; // Iteration counter / distance for getdtag.

  function getLocData() {
    let msgtag = getdtag(olctag, d);

    fetchBlueskyPostsByTag(msgtag, 10, function (err, result) {
      // Limit API call to 10 posts.
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
            " This might be a network connectivity issue or a Cross-Origin Resource Sharing (CORS) restriction. " +
            "If running locally or from a different domain, browser security might block the request. " +
            "Check network and browser console for CORS errors.";
        }
        elem.innerHTML += `<div class="message error"><small>${detailedErrorMessage}</small></div>`;
        console.log(
          `[API] Fetching stopped for ${olctag} due to an error with #${msgtag}.`,
        );
        return; // Stop trying to fetch further on error.
      }

      // No error, proceed with processing results.
      console.log(
        `[API] Received ${result ? result.length : 0} Bluesky posts for ${msgtag}:`,
        result,
      );
      if (result && result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          if (m <= 0) break; // Stop if target number of messages is met.

          let post = result[i];
          // Ensure post structure is as expected (app.bsky.feed.defs.postView).
          if (!post || !post.author || !post.record) {
            console.warn(
              "[API] Skipping post with unexpected structure:",
              post,
            );
            continue;
          }

          // Construct URL to the post on bsky.app (rkey is last part of uri).
          let postUrl = `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split("/").pop()}`;
          let authorDisplayName = post.author.displayName || post.author.handle;
          let postText = post.record.text || "[no text content]";

          elem.innerHTML += `<div class="message">
																																													<small>#${msgtag}
																																															<a href="${postUrl}" target="_blank">Post by @${authorDisplayName}</a>
																																															${post.record.createdAt ? " - " + new Date(post.record.createdAt).toLocaleString() : ""}
																																													</small>
																																													<div>${postText.replace(/\n/g, "<br>")}</div>
																																											</div>`;
          m--; // Decrement count of messages still needed.
        }
      } else {
        // Optionally, indicate no posts were found for this specific msgtag.
        // elem.innerHTML += `<div class="message"><small>No new posts found for #${msgtag} on Bluesky in this batch.</small></div>`;
      }

      d++;
      console.log(
        `Bluesky data processed for ${msgtag}. Messages remaining to target (m): ${m}, Iteration (d): ${d}`,
      );

      // If no error, continue fetching if more messages are needed (m > 0) and within iteration limit (d < 400).
      if (d < 400 && m > 0) {
        let wait;
        // d is count of fetches completed. For next fetch (d=1 means 1 completed, 2nd fetch upcoming):
        if (d < 3) {
          // For 2nd and 3rd fetches (when d is 1 or 2).
          wait = 500; // Fast.
        } else if (d < 8) {
          // For 4th through 8th fetches.
          wait = 1000; // Medium.
        } else {
          // For 9th fetch onwards.
          wait = 1500; // Slow.
        }
        setTimeout(getLocData, wait);
      } else {
        console.log(
          `Stopping Bluesky data fetch for ${olctag}. Conditions: d=${d}, m=${m}`,
        );
        if (m > 0 && d >= 400) {
          // Show if iteration limit was the reason for stopping.
          elem.innerHTML += `<div class="message"><small>Stopped fetching further messages. Reached iteration limit for #${olctag}.</small></div>`;
        } else if (m <= 0 && result && result.length > 0) {
          // Optionally, confirm target met if posts were found.
          // elem.innerHTML += `<div class="message"><small>Reached target number of messages for #${olctag}.</small></div>`;
        }
      }
    });
  }
  getLocData();
  oldtag = olctag;
}
