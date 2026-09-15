# ARCMAN: Final Settlement

A neon pixel-art arcade game about the one thing a payment network has to get right: **settlement**.
You play Arc Man, launching a USDC coin along a ballistic arc into the Settlement Zone — and between
levels, the game teaches you how Arc, USDC and on-chain payments actually work.

**Play it at [arcmangame.com](https://arcmangame.com)** · English · Русский · 中文 · Bahasa Indonesia

Scores are computed and signed by the server, finalized on **Arc Testnet**, and ranked on an on-chain
leaderboard. Finish the run and you can mint an ERC-721 completion certificate.

---

## Contents

- [How a run works](#how-a-run-works)
- [Scoring](#scoring)
- [Levels](#levels)
- [Learning content](#learning-content)
- [Languages](#languages)
- [Architecture](#architecture)
- [Anti-cheat and score signing](#anti-cheat-and-score-signing)
- [Smart contracts](#smart-contracts)
- [Running locally](#running-locally)
- [Deploying](#deploying)
- [Project notes](#project-notes)

---

## How a run works

The main mode is **Tournament**: 20 levels, 5 lives, one run.

1. **Aim and launch.** Drag to set direction and power — a glowing line traces the arc the coin
   will fly — and release to launch.
2. **Reach the Settlement Zone.** Fly out of bounds and you lose a life and replay the level.
3. **Learn, then answer.** Every completed level is followed by a short info screen, then a quiz on
   what that screen just said. A correct answer restores a life (up to 5).
4. **Rescue quiz — once per run.** Lose your last life and you get one way back: a hint on a topic,
   then three questions on it.

   | Correct answers | Result |
   |---|---|
   | 3 of 3 | Carry on from the same level with 3 lives |
   | 2 of 3 | Carry on from the same level with 1 life |
   | 0–1 | The run restarts from level 1 |

   The score, the level and the server session carry on through a rescue. A second loss in the same
   run goes straight to a restart.
5. **Finish.** After level 20: finalize the score on-chain, mint the completion NFT, and check the
   leaderboard.

A wallet (MetaMask, Rabby) is only needed for the on-chain steps — the game itself plays without one.
Test USDC for gas comes from the [Circle faucet](https://faucet.circle.com/).

**Other menu entries**

- **Community Levels** — levels submitted by players and approved by the maintainers.
- **Level Editor** — build a level, test it in place, export it, or submit it for review.
- **Statistics** — games played and completed, best scores, times and totals, stored in the browser.
- **Leaderboard** — top 10 / 25 / 50 / 100 from the contract, with your own rank.

---

## Scoring

Each level scores:

```
level score = floor( (100 + 10 × clouds passed + 10 × barrier hits) × (1 + 0.5 × gates passed) )
```

The run score is the sum of its level scores.

| Object | What it does | Score effect |
|---|---|---|
| **Arc Gate** | Speeds the coin up horizontally as it passes | +0.5× multiplier |
| **Slippage Cloud** | Slows the coin (×0.85) on entry | +10 |
| **Barrier** | Bounces the coin — large at full speed, medium at half, small at a quarter | +10, once per barrier per shot |
| **Life Restore** | Tournament only: +1 life, up to 5 | — |
| **Settlement Zone** | Ends the level | Base 100 |

The number on screen is for the player. The score that reaches the chain is recomputed by the server
from validated in-game events — see [Anti-cheat and score signing](#anti-cheat-and-score-signing).

---

## Levels

Twenty levels in `levels.js`, in two acts. Levels 1–9 and 20 ("Final Settlement") are hand-built;
levels 10–19 are the second act, each named after the info screen that follows it.

### Design rules for the second act

Levels 10–19 were built and checked against a headless re-implementation of the shot physics
(`js/agent.js`, see [Project notes](#project-notes)). Every one of them meets these rules at 1440×900,
1280×800, 1024×768, 844×390 and 390×844:

- **No free shot.** No winning shot reaches the Settlement Zone without touching an object — the
  player has to fly the intended line.
- **No decoration.** Every object is either met by at least a fifth of the winning shots, or removing
  it opens a free lane or visibly changes the shot window.
- **Everything on the field.** Rotated barriers are checked corner by corner; cloud extents account
  for the aspect ratio.
- **Every gate in one run.** Some single shot collects all the gates, so the top score is reachable.
- **Life restores are a choice.** They sit off the straight line, on roughly a third of winning shots.

New levels should meet the same bar.

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

1. Append the level to `DEFAULT_LEVELS` in `levels.js` with the next `id`.
2. Add an info screen to `js/infoScreens.js` and a quiz to `js/quizzes.js` with **the same `id`**.
3. Add the quiz's correct answer to `private/answer-key.json` on the server — see
   [Learning content](#learning-content).
4. Add the wording to every pack in `js/locales/` (English is the fallback until then).
5. **Restart the backend.** `server.js` reads `levels.js` at startup to know how many levels a run has
   and how many objects each level can report; a stale process rejects finalization of the new run.

The Level Editor's **Export** writes out `DEFAULT_LEVELS` in this same format, so a level can be built
visually and pasted in.

---

## Learning content

Everything the game teaches lives in three data files. They hold the English source, the ids and the
answer order; translations carry wording only. **Which answer is right is not in any of them** — those
files ship to every browser. The server grades answers, see [Server-side quizzes](#server-side-quizzes).

| File | Shown | Contents |
|---|---|---|
| `js/infoScreens.js` | After every level | 20 short explainers — Arc, USDC as gas, finality, the ARC token, x402, agent wallets, CCTP, reserves, minting, EURC, FX settlement, confidential transfers, validators, cross-border payments, irreversibility, the road to mainnet |
| `js/quizzes.js` | Right after that level's info screen | 20 questions, one per level, each checking the screen just read |
| `js/rescueTopics.js` | When the last life is lost | 8 topics, each with a hint and three questions — none repeated from the level quizzes |

Rules that keep this consistent:

- An info screen and its quiz share the level's `id`.
- Every quiz has exactly three answers, and its correct answer is listed in `private/answer-key.json`.
- Every rescue answer must be findable in its own hint — the rescue is meant to be won by reading.
- A rescue topic is `{ id, title, hint, questions: [ …3… ] }`. Adding one to the array puts it in the
  draw; add its wording to the packs in `js/locales/`, or it shows in English.

Content was checked against Arc, Circle and x402 public materials as of September 2026. Arc is a
public testnet; claims about mainnet, the validator set or the ARC token describe announced plans.

---

## Languages

English, Russian, Simplified Chinese and Indonesian. A dropdown in the top-right corner of the menu
switches language without a reload. The choice is stored in `localStorage` (`arcman_language`); on a
first visit the browser language decides.

`js/i18n.js` loads before every other module:

- `I18n.t(key, params)` — also the global `t()` — looks the key up in the current pack, falls back to
  English, then to the key itself, so an unfinished pack shows English rather than blank UI.
- `I18n.levelName()`, `I18n.infoText()`, `I18n.quiz()`, `I18n.rescueTopic()` return translated game
  content — wording only, always in source order, since the server's shuffled order refers to those
  positions.
- Static markup uses `data-i18n` (plus `-html`, `-placeholder`, `-value`, `-title`) and is rewritten by
  `I18n.apply()`; screens built in JavaScript re-render through `I18n.onChange()`.
- `'Tournament'` and `'Community'` are contract values and are never translated.

**Adding a language:** copy `js/locales/en.js` to `js/locales/<code>.js` and translate every value
(English is the canonical key set), add `{ code, label, short }` to `I18n.LANGUAGES`, and add its
`<script>` tag in `index.html` next to the others. The dropdown builds itself.

---

## Architecture

Plain JavaScript, no framework and no build step. Modules are loaded by `<script>` tags in
`index.html`, in dependency order, and talk through global namespace objects (`GameState`,
`GameConfig`, `Physics`, `Renderer`, …). The one external script is ethers.js from a CDN.

```
index.html            markup, styles, canvas, every overlay and screen
levels.js             DEFAULT_LEVELS and LevelManager (also read by server.js)
communityLevels.js    approved community levels
server.js             Express: public files, anti-cheat sessions, score signing, level submissions
server/quizService.js server-side quiz grading
private/              answer-key.json — never committed, deployed to the server like .env
contract.sol          USDCLaunchScore — signature check, best scores, leaderboards
nftContract.sol       ARCMANCompletionNFT — ERC-721 completion certificate
js/
  i18n.js             translation runtime            locales/   en, ru, zh, id packs
  config.js           constants, chain and contract settings
  canvas.js           canvas sizing and responsiveness
  audio.js            music and sound effects
  state.js            GameState — the single source of runtime state
  gameObjects.js      level loading, sprites, player animation
  physics.js          coin flight, collisions, life loss
  renderer.js         all canvas drawing
  scoring.js          level scoring and the level summary screen
  ui.js               HUD updates
  input.js            mouse and touch aiming
  gameFlow.js         modes, level progression, completion, leaderboard and NFT screens
  infoScreens.js      info screen content      infoManager.js   info screen display
  quizzes.js          level quiz content       quiz.js          level quiz display and rewards
  rescueTopics.js     rescue topic base        rescue.js        the rescue quiz
  statistics.js       player statistics in localStorage
  web3.js             wallet connection, network switching, contract calls
  leaderboard.js      leaderboard fetching and formatting
  nft.js              NFT metadata and minting
  levelEditor.js      the level editor
  main.js             game loop and initialisation
  agent*.js           retired Agent Shift mode — not loaded, see Project notes
```

Browser storage keys: `arcman_language`, `arcman_player_stats`, `usdc_launch_custom_levels`
(levels saved from the editor).

---

## Anti-cheat and score signing

The client never submits a score. It reports what happened; the server decides what it was worth.

```
POST /api/session/start     { player?, gameMode }            -> { sessionId, totalLevels }
POST /api/session/event     { sessionId, eventType }         levelStart | gatePassed | cloudPassed |
                                                             barrierHit | levelComplete
POST /api/session/finalize  { sessionId, nonce }             -> { score, signature, signerAddress }
POST /api/submit-level      { level }                        community submission (Telegram notice)
POST /api/quiz/level/start  { sessionId, levelId }           -> { order }
POST /api/quiz/level/answer { sessionId, levelId, choice }   -> { correct, correctPosition }
POST /api/quiz/rescue/start { sessionId }                    -> { topicId, orders }
POST /api/quiz/rescue/answer{ sessionId, index, choice }     -> { correct, correctPosition,
                                                                  done?, correctCount?, lives? }
GET  /api/health                                             -> { status: "ok", quizzes: "ok" }
```

Every tournament run gets a session. A wallet is optional; only a session started with one can be
finalized.

Checks the server applies:

- one active session per wallet; walletless runs are capped at 20 per IP, the oldest dropped first
- every session is bound to the IP that started it and expires after an hour. The server trusts
  `X-Forwarded-For` only from a loopback proxy, so behind the reverse proxy `req.ip` is the player's
  address and cannot be spoofed by a direct request
- events are capped per level by that level's real object counts in `levels.js`
- no event within 0.5 s of a level starting, and no level completed in under 3 s
- finalization needs every level completed, a total time of at least 3 s per level, and a 60 s
  cooldown between finalizations per player
- the score is recomputed from the recorded events with the formula in [Scoring](#scoring)

The server then signs
`keccak256(abi.encodePacked(player, score, levelId, nonce, gameMode))` with the Ethereum signed-message
prefix, where `levelId` is the number of levels completed. The contract recovers the signer and
accepts the score only if it matches its configured server signer.

Only the game itself is served publicly — `index.html`, `levels.js`, `communityLevels.js`, `js/`,
`images/` and `audio/`. `server.js`, the package files, `server/` and `private/` return 404.

### Server-side quizzes

The browser knows every question and the wording of every answer, never which one is right.

- **Level quiz.** `level/start` opens the quiz only for a level this session has completed on the
  server, and returns the order to show its answers in. `level/answer` grades the chosen on-screen
  position, once, and says which position was right. A correct answer restores a life.
- **Rescue quiz.** The server draws the topic (never the same one twice in a row from an IP), shuffles
  each question, grades the three answers in order and returns the verdict: 3 of 3 → 3 lives,
  2 of 3 → 1, otherwise none. Once per session.
- **Shuffled per session**, so "the right answer is the second one" does not travel between players.
- **If the server is unreachable**, the level quiz does not count and the run continues; the rescue
  cannot be graded and the run restarts from level 1.

The answers live in `private/answer-key.json`, as the **exact English text** of each correct answer:

```json
{
  "level":  { "1": "An EVM-compatible Layer-1 built by Circle for stablecoin finance", "...": "..." },
  "rescue": { "stablecoin": ["…answer to question 1…", "…2…", "…3…"], "...": ["..."] }
}
```

Text rather than positions means reordering answers in the content keeps working. If the key and the
content disagree — a quiz without an answer, or a correct answer reworded in `js/quizzes.js` but not in
the key — the server logs `QUIZZES UNAVAILABLE`, `/api/health` reports `"quizzes": "unavailable"`,
and the rest of the backend keeps running. The file is never committed: the repository is public.
`ANSWER_KEY_PATH` overrides its location.

---

## Smart contracts

Deployed on **Arc Testnet** (chain id `5042002`, RPC `https://rpc.testnet.arc.network`).

| Contract | Address |
|---|---|
| `USDCLaunchScore` (`contract.sol`) | `0x1E880c3165f5f2ee6B4d00598C9B5e1BfAC6ED0f` |
| `ARCMANCompletionNFT` (`nftContract.sol`) | `0x6695B1B9d03fB3E94fdC7599abeB97DDF3E9a764` |

**USDCLaunchScore**

- `finalizeScore(scoreData, signature)` — the caller must be the player; verifies the server
  signature, keeps the player's best score per game mode and updates that mode's leaderboard.
- `getLeaderboard(count, gameMode)`, `getPlayerScore(player, gameMode)` — read views.
- Leaderboards hold the top 100 per game mode. The game finalizes to `Tournament`; records from the
  retired Immortal mode remain on-chain and are no longer shown.

**ARCMANCompletionNFT**

- `mintCompletionNFT(player, finalScore, levelsCompleted, completionTime, gameMode, tokenURI)` —
  players can only mint for themselves, one certificate per game mode.
- `hasCompletionNFT`, `getPlayerTokenId`, `getCompletionData`, `totalSupply` — read views.
- Metadata is built client-side in `js/nft.js`; the image comes from `GameConfig.BLOCKCHAIN.NFT_IMAGES`.

---

## Running locally

Requires Node.js (production runs v20).

```bash
npm install
npm start               # http://localhost:3000
```

Create a `.env` next to `server.js`:

```bash
PRIVATE_KEY=0x...            # server signer; must match the contract's serverSigner to finalize
TELEGRAM_BOT_TOKEN=...       # optional: notifications for community level submissions
TELEGRAM_CHAT_ID=...         # optional
PORT=3000                    # optional
```

Without `PRIVATE_KEY` the server generates a throwaway key on each start — the game runs, but
finalization will be rejected by the deployed contract. `npm run get-address` prints the signer
address for the key in `.env`.

**Quizzes need the answer key.** Put `answer-key.json` in `private/` (ask a maintainer for it). Without
it the game runs, but every quiz reports that the server did not answer.

**The client talks to the backend that served it.** `API_URL` in `js/config.js` resolves to the page's
own origin, so `npm start` on `http://localhost:3000` just works. Opened from a file, it falls back to
production.

**Serve over HTTP, not `file://`.** Wallet extensions do not inject into local files. A plain static
server (`python3 -m http.server 8000`) runs the game, but without the backend there are no sessions,
no quizzes and no on-chain finalization.

`npm run dev` runs the server under nodemon.

---

## Deploying

The production site is `server.js` behind a reverse proxy: it serves the static files and the API from
the same process.

1. Copy the repository files to the server, **excluding** `.git/`, `node_modules/` and `.env`. The
   server keeps its own `.env` with the signing key — never overwrite it and never commit it.
   `private/answer-key.json` is deployed the same way: kept on the server, never in git. Update it
   whenever a quiz is added or a correct answer is reworded.
2. Run `npm install` if `package.json` changed.
3. **Restart the Node process** (for example `systemctl restart <service>`). Static files are picked up
   immediately, but `levels.js` is read once at startup — a process that still believes the run has a
   different number of levels rejects every finalization.
4. Check `/api/health` — it must say `"quizzes": "ok"` — then load the site and confirm the new files
   are served. Browsers cache `js/*.js` aggressively; test with a hard reload.

---

## Project notes

- **Arc is a testnet.** Everything on-chain here uses test USDC with no value.
- **Retired modes.** Immortal mode was removed; Tournament is the only scored mode. The Agent Shift
  mode was retired from the game, but `js/agent.js`, `agentShift.js`, `agentWallet.js`,
  `agentOnboarding.js` and `agentMode.js` stay in the tree with their markup and styles. No script tag
  loads them, and their markup is not translated.
- **`js/agent.js` is a useful tool.** `AgentSolver` is a deterministic, headless copy of the shot
  physics that runs in Node and the browser. `buildWorld(level)`, `simulate(world, shot)` and
  `solve(world)` answer "is this level winnable, and how?" — it is how the second act was validated.
  In the browser, inject it and hand its aim to `GameFlow.launchCoin()` to finish a level without
  playing. Note that the live player bobs (`player.floatOffset`), which the solver ignores.
- **Community levels** are played locally and are not finalized on-chain.
- `PROJECT_DESCRIPTION.md` is an older long-form description and predates the current game.

## License

MIT
