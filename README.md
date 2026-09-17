# ARCMAN: Final Settlement

You launch a USDC coin on a ballistic arc, thread it past barriers and slippage clouds, and put it
down in the Settlement Zone. Twenty levels of that. In between, the game explains how Arc, USDC and
on-chain payments actually work, then asks you a question about what it just said.

It's an arcade game with a syllabus hidden inside it.

**[arcmangame.com](https://arcmangame.com)** · English · Русский · 中文 · Bahasa Indonesia

Arc's public mainnet opened on 16 September 2026. The contracts here went up the day after, which
explains some of what follows better than any amount of architecture talk would.

Scores are computed and signed by the server, then written to Arc at the server's expense. Finish a
course and there's a USDC reward waiting.

## How a run works

Tournament is the main mode: 20 levels, 10 lives, one run.

Drag to aim. A glowing line traces the arc the coin will fly, and power scales with how far you pull
back. Release and the physics takes over. Fly out of bounds, lose a life, replay the level.

Every level you clear is followed by a short info screen and then one question about it. Answer
correctly and you get a life back, up to 10. Those answers also decide whether you qualify for the
reward, so it pays to read the screen instead of clicking past it.

Lose your last life and the game gives you one way back in. It shows a hint on some topic, then asks
three questions about it:

| Correct | What happens |
|---|---|
| 3 of 3 | Same level, 3 lives |
| 2 of 3 | Same level, 1 life |
| 0 or 1 | Back to level 1 |

Everything else survives a rescue: your score, the level you were on, the server session. Lose your
lives a second time in the same run and it's a restart. There's no second rescue.

After level 20 you can claim the reward, write the score to the chain, and see where you landed on the
leaderboard.

A wallet (MetaMask, Rabby) is only needed for the on-chain parts. The game plays fine without one, and
when you do connect it, it needs nothing in it. We pay the gas for both the score and the reward.

**The rest of the menu.** Community Levels holds player-submitted levels that have been approved. The
Level Editor builds one, tests it in place, and exports it or sends it in for review. Statistics live
in your browser. The Leaderboard shows the top 10 through 100, read off the chain, with your own rank
marked.

## Scoring

Each level is worth:

```
level score = floor( (100 + 10 × clouds passed + 10 × barrier hits) × (1 + 0.5 × gates passed) )
```

The run score is the sum of the levels.

| Object | What it does | Score effect |
|---|---|---|
| **Arc Gate** | Speeds the coin up horizontally as it passes | +0.5× multiplier |
| **Slippage Cloud** | Slows the coin (×0.85) on entry | +10 |
| **Barrier** | Bounces the coin: large at full speed, medium at half, small at a quarter | +10, once per barrier per shot |
| **Life Restore** | Tournament only: +1 life, up to 10 | none |
| **Settlement Zone** | Ends the level | Base 100 |

The number on screen is for the player. The score that reaches the chain gets recomputed by the server
from events it validated itself, which is the subject of
[Anti-cheat and score signing](#anti-cheat-and-score-signing).

## Levels

Twenty levels in `levels.js`, in two acts. Levels 1–9 and 20 ("Final Settlement") were placed by hand.
Levels 10–19 are the second act, each named after the info screen that follows it.

### Design rules for the second act

The second act was built against a headless copy of the shot physics (`js/agent.js`, see
[Notes](#notes)), which made it cheap to ask whether a level was actually any good. Each one satisfies
the following at 1440×900, 1280×800, 1024×768, 844×390 and 390×844.

No free shot: nothing reaches the Settlement Zone without touching an object first, so the player has
to fly the intended line rather than lob the coin and hope.

No decoration: every object is either met by at least a fifth of winning shots, or removing it opens a
free lane or visibly changes the window you have to hit.

Everything stays on the field, with rotated barriers checked corner by corner and cloud extents
adjusted for aspect ratio.

Some single shot collects every gate, so the top score is actually gettable.

Life restores sit off the straight line, on roughly a third of winning shots, so taking one is a
decision.

New levels should clear the same bar.

### Level format

All coordinates are relative (0–1) and scaled to the canvas at load time.

```javascript
{
    id: 21,
    name: "Level Name",
    player: { x: 0.08, y: 0.78 },
    arcGates: [
        { x: 0.40, y: 0.30, width: 0.05, height: 0.13, active: true, rotation: 0 }
    ],
    slippageClouds: [
        { x: 0.55, y: 0.40, radius: 0.06 }
    ],
    settlementZone: { x: 0.84, y: 0.60, width: 0.10, height: 0.13 },
    barriers: [
        { x: 0.60, y: 0.35, width: 0.01, height: 0.3, size: "large", rotation: 30 }
    ],
    lifeRestores: [
        { x: 0.30, y: 0.45, radius: 0.022 }
    ]
}
```

| Field | Anchor and units |
|---|---|
| `arcGates`, `settlementZone` | `x, y` is the top-left corner; `width` in fractions of canvas width, `height` of canvas height |
| `slippageClouds`, `lifeRestores` | `x, y` is the centre; `radius` is a fraction of canvas **width** |
| `barriers` | `x, y` is the top-left of the unrotated rectangle; `rotation` in degrees around its centre; `size` sets bounce strength (`large` 1.0, `medium` 0.5, `small` 0.25) |

### Adding a level

1. Append it to `DEFAULT_LEVELS` in `levels.js` with the next `id`.
2. Add an info screen to `js/infoScreens.js` under **the same `id`**, plus three question variants in
   `js/quizzes.js` with `level` set to that id and ids `<level>a`, `<level>b`, `<level>c`.
3. Put each variant's correct answer in `private/answer-key.json` on the server. See
   [Learning content](#learning-content).
4. Translate the wording in every pack under `js/locales/`. English shows until you do.
5. Restart the backend. `server.js` reads `levels.js` once at startup to learn how many levels a run
   has and how many objects each level can legitimately report, so a stale process will reject every
   finalization of the new course.

The Level Editor exports `DEFAULT_LEVELS` in exactly this format, so you can build a level visually and
paste it in.

## Learning content

Everything the game teaches sits in three data files. They hold the English source, the ids and the
answer order. Translations carry wording only. **None of them says which answer is right**, because all
three ship to the browser. Grading happens on the server.

| File | Shown | Contents |
|---|---|---|
| `js/infoScreens.js` | After every level | 20 short explainers: Arc, USDC as gas, finality, the ARC token, x402, agent wallets, CCTP, reserves, minting, EURC, FX settlement, confidential transfers, validators, cross-border payments, irreversibility, the mainnet launch |
| `js/quizzes.js` | Right after that level's info screen | 60 questions, three variants per level, one drawn by the server per run, each answerable from the screen just read |
| `js/rescueTopics.js` | When the last life is lost | 8 topics, each with a hint and five questions, of which the server asks three. None repeat the level quizzes |

A level quiz looks like `{ id: '7b', level: 7, question, answers: [ …3… ] }`. Every variant has to be
answerable from that level's info screen, and its correct answer belongs in `private/answer-key.json`
under the same id.

Rescue answers must be findable in the hint above them. The rescue is meant to be winnable by reading
carefully under pressure, not by already knowing the material.

A rescue topic is `{ id, title, hint, questions: [ …at least 3… ] }`, and adding one to the array puts
it in the draw. Translate it or it shows in English.

Nothing about an answer's shape may give it away. The right answer shouldn't be the longest, the
shortest, the most hedged, or the only one that names a real product, and its position in the source
array varies from question to question. The source order is public even though the key isn't, and the
same discipline applies to every translation.

Correct answers never enter git. Any question whose answer was committed at some point is burned and
should be replaced.

Content was checked against Arc, Circle and x402 public materials as of September 2026. Arc's public
mainnet opened on 16 September 2026. Claims about the ARC token and the move to Proof-of-Stake describe
announced plans; ARC has not launched.

## Languages

English, Russian, Simplified Chinese and Indonesian. The dropdown in the top-right of the menu switches
between them without a reload, and the choice is remembered in `localStorage` under `arcman_language`.
On a first visit the browser decides.

`js/i18n.js` loads before every other module. `I18n.t(key, params)`, exposed globally as `t()`, looks a
key up in the current pack, falls back to English, then to the key itself, so a half-finished pack
shows English instead of blank UI. Game content comes through `I18n.levelName()`, `I18n.infoText()`,
`I18n.quiz()` and `I18n.rescueTopic()`, which return wording only and always in source order, since the
server's shuffled order refers to those positions.

Static markup carries `data-i18n` attributes (plus `-html`, `-placeholder`, `-value`, `-title`) and gets
rewritten by `I18n.apply()`. Screens built in JavaScript re-render through `I18n.onChange()`. The
strings `'Tournament'` and `'Community'` are contract values and never get translated.

To add a language, copy `js/locales/en.js` to `js/locales/<code>.js` and translate every value, add
`{ code, label, short }` to `I18n.LANGUAGES`, and drop a `<script>` tag into `index.html` beside the
others. The dropdown builds itself from there.

## Architecture

Plain JavaScript. No framework, no build step. Modules load through `<script>` tags in `index.html` in
dependency order and talk to each other through global namespace objects (`GameState`, `GameConfig`,
`Physics`, `Renderer`, and so on). The only external script is ethers.js from a CDN.

```
index.html            markup, styles, canvas, every overlay and screen
levels.js             DEFAULT_LEVELS and LevelManager (server.js reads this too)
communityLevels.js    approved community levels
server.js             Express: static files, anti-cheat sessions, score signing, level submissions
server/
  quizService.js      quiz grading
  scoreService.js     sends the score, builds the ranking from the board's events
  claimService.js     the reward: X sign-in, the ledger, the EIP-712 release
  relay.js            one queue per wallet, so two transactions never share a nonce
  *-test.mjs          flow tests that run against a live server
private/              answer-key.json and claims.json, kept on the server, never committed
contract.sol          the retired score contract, kept for the record
chain/                ARCMANScoreBoard and ARCMANRewardPool, with tests and deploy scripts
js/
  i18n.js             translation runtime            locales/   en, ru, zh, id packs
  config.js           constants, chain and contract settings
  canvas.js           canvas sizing and responsiveness
  audio.js            music and sound effects
  state.js            GameState, the single source of runtime state
  gameObjects.js      level loading, sprites, player animation
  physics.js          coin flight, collisions, life loss
  renderer.js         all canvas drawing
  scoring.js          level scoring and the summary screen
  ui.js               HUD updates
  input.js            mouse and touch aiming
  gameFlow.js         modes, level progression, completion and leaderboard screens
  infoScreens.js      info screen content      infoManager.js   info screen display
  quizzes.js          level quiz content       quiz.js          level quiz display and rewards
  rescueTopics.js     rescue topic base        rescue.js        the rescue quiz
  statistics.js       player statistics in localStorage
  web3.js             wallet connection, network switching, contract calls
  leaderboard.js      leaderboard fetching and formatting
  claim.js            the reward claim on the completion screen
  token.js            the token address on the menu, dormant until launch
  levelEditor.js      the level editor
  main.js             game loop and initialisation
  agent*.js           retired Agent Shift mode, not loaded, see Notes
```

Browser storage keys: `arcman_language`, `arcman_player_stats`, `usdc_launch_custom_levels` (levels
saved out of the editor).

## Anti-cheat and score signing

The client never submits a score. It reports what happened and the server decides what that was worth.

```
POST /api/session/start     { gameMode, player? }            -> { sessionId, totalLevels,
                                                                  walletMessage }
POST /api/session/event     { sessionId, eventType }         levelStart | gatePassed | cloudPassed |
                                                             barrierHit | levelComplete
POST /api/session/wallet    { sessionId, address, signature} attaches a wallet to a finished run
POST /api/session/finalize  { sessionId, nonce }             -> { score, txHash, relayed: true }
POST /api/submit-level      { level }                        community submission (Telegram notice)
POST /api/quiz/level/start  { sessionId, levelId }           -> { questionId, order, correctSoFar }
POST /api/quiz/level/answer { sessionId, levelId, choice }   -> { correct, correctPosition,
                                                                  correctSoFar }
POST /api/quiz/rescue/start { sessionId }                    -> { topicId, questions, orders }
POST /api/quiz/rescue/answer{ sessionId, index, choice }     -> { correct, correctPosition,
                                                                  done?, correctCount?, lives? }
GET  /api/leaderboard                                        -> ranking, read from chain events
GET  /api/health                                             -> { status: "ok", quizzes: "ok" }
```

The reward claim adds `/api/claim/pool`, `/api/claim/start`, `/api/claim/wallet`, `/api/claim/x/start`,
`/api/claim/x/callback`, `/api/claim/status` and `/api/claim/submit`, covered under
[The reward](#the-reward).

Every tournament run gets a session. The wallet comes at the end rather than the beginning: you play
without one and name it only when there's something to put on chain, by signing the `walletMessage`
handed out when the session opened. Asking up front used to cost people whole runs whenever the wallet
failed to connect.

What the server checks:

- one active session per wallet, with walletless runs capped at 20 per IP and the oldest dropped first
- every session is bound to the IP that opened it and expires after an hour. `X-Forwarded-For` is
  trusted only from a loopback proxy, so behind the reverse proxy `req.ip` is the player's real address
  and a direct request can't spoof it
- events are capped per level by that level's real object counts in `levels.js`
- nothing counts within 0.5 s of a level starting
- a level finished in under 3 s gets recorded and flagged, never dropped. The run is then judged
  as a whole: if more than half of it went that fast, neither the score nor the reward goes through
- finalization requires every level completed, a total time of at least 3 s per level, and a 60 s
  cooldown per player
- the score is recomputed from the recorded events using the formula in [Scoring](#scoring)

The server signs
`keccak256(abi.encodePacked(chainId, board, player, score, levelId, nonce, gameMode))` with the
Ethereum signed-message prefix, where `levelId` is the number of levels completed. The contract
recovers the signer and accepts the score only if it matches the server signer it was configured with.
The chain id and the board's own address are in there so a signature can't travel between deployments.

Finalization then sends the transaction itself and returns the hash. The player's wallet signs nothing
and needs no balance. Without a relayer configured, the signature comes back instead for the wallet to
send. A run only gets signed once; asking again resends the same signature, since the contract spends
signatures on use and a duplicate is cheaper than a lost run.

Only the game is served publicly: `index.html`, `levels.js`, `communityLevels.js`, `js/`, `images/` and
`audio/`. Requests for `server.js`, the package files, `server/` or `private/` get a 404.

### Server-side quizzes

The browser knows every question and the exact wording of every answer. It never learns which one is
correct.

`level/start` opens a quiz only for a level this session has actually completed on the server, draws
one of that level's three variants, and returns its `questionId` along with the order to display the
answers in. `level/answer` grades the on-screen position you picked, once, and replies with the
position that was right. Correct answers restore a life.

The rescue quiz draws a topic (never the same one twice in a row from one IP), picks three of its
questions, shuffles each, grades all three in order and returns the verdict: 3 of 3 for three lives,
2 of 3 for one, otherwise nothing. Once per session.

Answer order is shuffled per session, so "it's the second one" doesn't travel between players. If the
server is unreachable the level quiz simply doesn't count and the run continues; a rescue that can't be
graded sends the run back to level 1.

Answers live in `private/answer-key.json` as the **exact English text** of the correct option:

```json
{
  "level":  { "1a": "…exact text of the right answer…", "1b": "…", "1c": "…", "...": "..." },
  "rescue": { "stablecoin": ["…answer to question 1…", "…2…", "…3…", "…4…", "…5…"], "...": ["..."] }
}
```

Storing text rather than positions means you can reorder answers in the content without breaking
anything. When the key and the content disagree, which usually means a quiz with no answer or an answer
reworded in `js/quizzes.js` but not in the key, the server logs `QUIZZES UNAVAILABLE`, `/api/health`
starts reporting `"quizzes": "unavailable"`, and everything else keeps running. The file never gets
committed, since this repository is public. `ANSWER_KEY_PATH` overrides where it lives.

## The reward

Finish the course and you can claim a fixed USDC reward, once. Three steps on the completion screen,
each re-checked server-side:

1. **Wallet.** Connect it and sign a short message. No transaction, no balance needed.
2. **X account.** Sign in through X. It has to be Premium and at least six months old.
3. **Reward.** We sign an EIP-712 release and send it, so your wallet needs nothing in it.

The Premium-and-six-months requirement isn't a judgement about anyone. It's just the cheapest signal we
could ask for that costs a farm real money and costs an ordinary player nothing.

One claim per wallet and one per X account, tracked in a ledger on disk and enforced again by the
contract. The handle itself is never stored, only a salted hash of the account id, which is enough to
catch a second attempt and not enough to tell anyone who claimed.

A run also has to answer **15 of the 20 level quizzes** correctly and pass the pace check above. The
quiz screen shows how many you have so far, and tells you outright once the reward has become
unreachable, so nobody plays out the rest of the course for nothing.

The whole section hides itself when the pool is empty or paused, and says which of the two it is.
Refusals it can explain, it explains: an exhausted pool, a shared connection that has hit its limit, a
wallet or an account that already claimed.

| Setting | Default | What it does |
|---|---|---|
| `CLAIM_MIN_QUIZ_CORRECT` | `0` | Correct level quizzes required. Production asks 15 |
| `CLAIM_MIN_ACCOUNT_AGE_DAYS` | `183` | How old the X account has to be |
| `CLAIM_MAX_PER_IP` | `3` | Claims from one address before it starts refusing |
| `CLAIM_COURSE_ID` | `1` | Bump it to open a fresh round of claims |
| `CLAIM_LEDGER_PATH` | `private/claims.json` | Who has claimed. Never committed |

## Smart contracts

Arc mainnet is chain id `5042` at `https://rpc.mainnet.arc.io`. The testnet is `5042002` at
`https://rpc.testnet.arc.io`. Gas is USDC on both.

| Contract | Address on Arc mainnet |
|---|---|
| `ARCMANScoreBoard` | `0x54f8D69E62d1E83c4616792c1D95508c539F7715` |
| `ARCMANRewardPool` | `0xC00575601174BC0551E07378E8c0a91097940F10` |

Both deployed 17 September 2026. The owner is a wallet the maintainer holds, separate from every key on
the server, and the two signing keys and the relayer are separate from each other again. No single key
can both authorise a reward and walk off with the money.

**ARCMANScoreBoard** (`chain/contracts/scoreBoard.sol`) verifies the server signature in
`finalizeScore(scoreData, signature)` and keeps each player's best score per game mode. Anyone can send
it, because the signature names the player, so a stranger paying the gas can neither steal the score nor
misplace it. That property is what lets the server pay on behalf of an empty wallet. Signatures are
spent on use and the upper half of the curve is refused, so nothing replays or mirrors.

There's no leaderboard in storage, for reasons under [Things that went wrong](#things-that-went-wrong).
The board emits `NewBestScore` and the server ranks from the events.

`setServerSigner` lets the owner swap the signing key without redeploying, which matters, because
whoever holds it can write any score they like. Ownership itself moves in two steps.

**ARCMANRewardPool** (`chain/contracts/rewardPool.sol`) pays a fixed USDC reward per finished course,
once per wallet and once per X account, released against an EIP-712 signature from the server and
relayed at our expense. The owner can withdraw and pause. The signer can only authorise money the pool
already holds.

## The token

There isn't one yet. When there is, the address goes on the menu screen, and the scaffolding for that
is already in place and switched off.

`GameConfig.TOKEN` in `js/config.js` holds it:

```javascript
TOKEN: {
    launched: false,     // nothing appears on the site while this is false
    address: '',
    symbol: '',
    network: 'ArcMainnet',
    tradeUrl: '',        // optional; the link is dropped when empty
    verifyUrl: ''        // somewhere else we control, normally the pinned post on X
}
```

Launch day is: paste the address, set `launched` to true, deploy. No code changes.

Two things about how `js/token.js` draws it are deliberate and shouldn't be
"tidied up" later.

**The address is never abbreviated.** `0x54f8…7715` is precisely what an address-poisoning attack
survives: grind out an address matching the first and last few characters and anyone checking only the
ends is fooled. The middle is the part that identifies it, so all 42 characters stay on screen and wrap
on a narrow one. There's a copy button for the same reason, since a retyped address is a chance to make
a mistake nobody catches.

**A bad address draws nothing.** The EIP-55 checksum is verified before anything renders, and a failure
hides the whole section and logs why. An address with a typo in it that still looks plausible is worse
than no address at all: one sends money nowhere, the other sends it to a stranger. All-lowercase
addresses carry no checksum and are allowed through, since that form is legal and common.

Nothing is shown before launch, deliberately. An empty box or a "coming soon" placeholder is a
ready-made screenshot for somebody to fill in with their own address.

That covers the site. The site is not the attack: on launch day there will be clones of it with the
address swapped, and no amount of care here touches them. What helps is publishing the address somewhere
else you control, which is what `verifyUrl` points at.

## Running locally

Needs Node.js. Production runs v20.

```bash
npm install
npm start               # http://localhost:3000
```

Then a `.env` next to `server.js`:

```bash
# Scores
PRIVATE_KEY=0x...              # score signer; has to match the board's serverSigner
SCORE_CONTRACT_ADDRESS=0x...   # the board the signature is bound to
SCORE_CHAIN_ID=5042            # the chain it is bound to
SCORE_FIRST_BLOCK=...          # where the ranking starts reading; the deploy script prints it
ARC_RPC_URL=https://rpc.mainnet.arc.io
RELAYER_KEY=0x...              # pays gas for scores and rewards alike

# The reward. Leave it all unset and the claim just doesn't appear.
REWARD_POOL_ADDRESS=0x...
CLAIM_SIGNER_KEY=0x...         # authorises a release; never the relayer, never the owner
IDENTITY_SALT=...              # salts the X account hash in the ledger
X_CLIENT_ID=... X_CLIENT_SECRET=... X_REDIRECT_URI=https://…/api/claim/x/callback
CLAIM_MIN_QUIZ_CORRECT=15      # plus the rest of the table above

# Optional
TELEGRAM_BOT_TOKEN=...         # notifications for community level submissions
TELEGRAM_CHAT_ID=...
PORT=3000
```

Without `PRIVATE_KEY` the server invents a throwaway key at startup and says so in the log. The game
runs, but the deployed board will refuse every score it signs. Startup also compares that key's address
against the board's `serverSigner()` and `SCORE_CHAIN_ID` against the node, and complains about either
mismatch, because a wrong key looks exactly like a working one right up until someone finishes a run.
`npm run get-address` prints the address for whatever key is in `.env`.

Keep the three keys apart. Score signer, claim signer and relayer are separate on purpose, so that no
one key can both authorise money and hold it. The owner key belongs in a wallet, not on a server.

**Quizzes need the answer key.** Drop `answer-key.json` into `private/` (ask a maintainer). Without it
the game still runs, but every quiz reports that the server didn't answer.

**The client talks to whatever backend served it.** `API_URL` in `js/config.js` resolves to the page's
own origin, so `npm start` on `http://localhost:3000` works with no configuration. Opened from a file,
it falls back to production.

**Serve over HTTP, not `file://`.** Wallet extensions don't inject into local files. A plain static
server (`python3 -m http.server 8000`) will run the game, but with no backend there are no sessions, no
quizzes and no finalization.

`npm run dev` runs it under nodemon.

### Tests

```bash
cd chain && npm install && npx hardhat test   # the two contracts, 52 tests
npm run test:claim                            # the whole reward claim, start to finish
npm run test:finalize                         # score finalization, against a running server
npm run test:pace                             # how fast a run may be played, likewise
```

`test:claim` stands up everything it needs by itself, including a local chain, a funded pool and a
stand-in for X, and touches neither the real network nor the production ledger. The other two play real
courses against `localhost:3000` and take a few minutes each, because the anti-cheat rules expect a
course to be played at human speed and the tests play by them.

## Deploying

Production is `server.js` behind a reverse proxy, serving the static files and the API out of one
process.

1. Copy the repository to the server, leaving out `.git/`, `node_modules/` and `.env`. The server keeps
   its own `.env` with the signing keys. Never overwrite it, never commit it.
   `private/answer-key.json` works the same way, and needs updating whenever a quiz is added or a
   correct answer gets reworded.
2. `npm install` if `package.json` changed.
3. Restart the Node process (`systemctl restart <service>`, or whatever runs it). Static files are
   picked up immediately, but `levels.js` is read once at startup, and a process that still believes
   the course is a different length will reject every finalization.
4. Check `/api/health` for `"quizzes": "ok"`, then load the site and confirm the new files are actually
   being served. Browsers cache `js/*.js` hard, so test with a hard reload.

Sessions live in memory, so a restart ends every run in progress. Deploy when nobody is playing.

## Things that went wrong

Worth writing down, if only to avoid a repeat.

**The leaderboard used to live on the chain.** Keeping the top hundred sorted meant re-sorting on every
new entry, which cost up to 1.3M gas, and the worst case landed on whoever had just played best.
Charging your strongest players the most is a strange way to run a game. The board now emits
`NewBestScore` and nothing else, and the server reads the events back and ranks them. Gas per score
dropped by roughly a factor of ten.

**Score finalization never worked for anyone.** The server would only sign for a wallet named when the
session started, but the game didn't ask for a wallet until the run was over, so every signature was
for nobody. It failed quietly until someone actually finished a run and went looking. There's a
`/api/session/wallet` endpoint now: finish the run, then prove the wallet by signing the message the
session was opened with.

**300 USDC went nowhere.** Funding the reward pool from a wallet is an ordinary native transfer, and the
pool had no `receive()`, so the transaction reverted and the money stayed put
([`0xe59a8cf6…`](https://explorer.arc.io/tx/0xe59a8cf6275e5eee16bb023434090011dbe48c553d5914e4d5e9d88f90177976)).
Easier to trip over on Arc than it sounds, because USDC there is both the gas token and an ERC-20 at
`0x3600…0000`: one balance, two views, 18 decimals natively and 6 through the token interface. The pool
has a `receive()` now.

**The three-second rule punished the wrong people.** Any level finished in under three seconds used to
be silently discarded. That does nothing to a script, which can happily wait three seconds, and it
quietly cost a good player a level off their course, with no message at the time and no reward at the
end. Now the level counts and gets flagged, and the run is judged all at once: more than half of it
that fast and nothing goes through.

**A signature for the testnet board would have worked on the mainnet one.** Caught while re-reading the
contract before deploying. The signed hash didn't include the chain id or the contract address, so one
signature was good on any deployment sharing a signer. Both are in the hash now, and there's a test
that signs for one board and checks that another refuses it.

**Arc silently drops transactions priced under 20 Gwei.** No error, no receipt, no trace that you ever
sent anything. Everything we send bids 25.

## Notes

`GameConfig.BLOCKCHAIN.NETWORK` picks the chain. The game runs on Arc mainnet, where the rewards are
real USDC. `ArcTestnet` still works and uses test USDC worth nothing.

Immortal mode is gone; Tournament is the only scored mode. Agent Shift was retired too, but
`js/agent.js`, `agentShift.js`, `agentWallet.js`, `agentOnboarding.js` and `agentMode.js` are still in
the tree along with their markup and styles. Nothing loads them and their markup isn't translated.

`js/agent.js` earns its place anyway. `AgentSolver` is a deterministic headless copy of the shot
physics that runs in Node and in the browser, and `buildWorld(level)`, `simulate(world, shot)` and
`solve(world)` answer "is this level winnable, and how?" It's how the second act got validated. In the
browser you can inject it and hand its aim to `GameFlow.launchCoin()` to clear a level without playing.
One caveat: the live player bobs up and down (`player.floatOffset`) and the solver ignores that.

Community levels are played locally and never finalized on-chain.

## License

MIT
