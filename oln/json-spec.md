# List of (optional) ideas / elements of OLN

---

## Get new messages to index / distributed search JSON format

Idea: have an RSS-like JSON format, but made for social interactions / Twitter-like messages.

---

### Requirements (all [except Raw text] optional?):
- Raw text
- Origin
    - Username
    - Server or P2P
    - Public key bitcoin-address style

---

- Timestamp for time of publication
- TTL (time in days for relevance since timestamp)
- Hops (measure relevance for unrequested propagation)
- Signing
- Encryption

---

- Hash (for message identification / content based addressing)
    - Based on just raw text? Other fields derived from raw text?
- Tags (hashtag, plustag)

---

- Probably different types?
    - Messages
    - Search index
        - Search on origin, tags, hash
    - Other known feeds
    - Server information
        - Fixed tag for non-changing feeds, otherwise answer query

---

### Example format

```json
{
    server: {
       link: "" // protocol:link or /ipfs/-style
       name: ""
       pubkey: ""
    }
    messages: {
        "hash": {
            raw: "", // can be encrypted, receiver can try decryption with either private key or AES symmetrical encryption
            origin: {
                display: "",
                pubkey: "",
                servername: ""
            }
            sig: "",
            timestamp: "",
            ttl: 0,
            hops: 0,
            tags: ["", "", "", ...]
        },
        "anotherhash": {
                ...
        }
    }
    search: {
        "tag": ["hash", "hash", "link", ...],
        "anothertag": ["hash", "hash", "link" ...],
        "paddedplustag": ["fullplustag", "hash", "link", ...],
        "link": ["hash", "hash", ...],
        ...
    }
    feeds: ["link", "link", ...]
}
```

---

## Endpoints

HTTP(S)-endpoints, usually .json, can be any location on server
If server is enabled to do so, answer requests
Other kinds of endpoints, like smtp, irc, ipfs-pubsub, ssh, ...

---

## Message format notes

Mostly Twitter-style:
- @mentioning for mentioning people by origin or messages by hash
- #hashtags for topics
- http:// and https:// for links, embed when possible/feeling like it (e.g. images) and when safe
- /ipfs/ and /ipns/ links that should be treated similar to http(s)

---

- plustags (locations mentioned by full form pluscode, padded with 00 for increasing range)
- key: entries for any other kind of information
- \[Alttext](mention,tag,link,key) for providing alternative representation, e.g. providing a human-readable location for plustags

---

I'm a bit undecided about a format for time/date in messages, ISO timestamps might be too limited for representing inexact time.

---

## Implementation

Client can implement local indexing of feed information under all of mentioned elements. Need to unpack Alttext-representation. Plustags can add simple or more complex proximity search algorithm, e.g. string-based on several layers.
Need to have pubkey and hash format, I think it's good to use [ipfs multihash format](https://github.com/multiformats/multihash) in base58 like ipfs does, with sha2-256 prefered/default for hash and ed25519-pub for pubkey?

---

