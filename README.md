# Making the Merge

A Survivor-themed card battle for a group of friends. Six turns, three locations, win two to earn the jury's votes. Collect castaways through Tree Mail, build up to 10 decks, and climb from Castaway to Sole Survivor.

- **Play:** https://zuddlow.github.io/making-the-merge/
- **Card list:** https://zuddlow.github.io/making-the-merge/cards.html

The site is unlisted (search engines are told not to index it), so share the link with the people you want playing.

## How it fits together

| Path | What it is |
|---|---|
| `src/engine.js` | Rules, cards, locations and the bot opponents |
| `src/ui.html` | Every screen, its styles and the game loop |
| `src/firebase-adapter.js` | Sign-in and saving on the website (Firebase) |
| `src/firebase-config.js` | Your Firebase project's web config (empty = save on each device) |
| `art/` | Card and location art, plus `art.json` with each photo's framing |
| `cardlist/` | Design notes and change log for the card list page |
| `firestore.rules` | Who can read and write what |
| `index.html`, `cards.html` | Built output that GitHub Pages serves (don't edit by hand) |

After changing anything in `src/`, `art/` or `cardlist/`, run `python3 build.py` and commit the rebuilt `index.html` and `cards.html`. `python3 build.py claude` builds the Claude artifact version into `dist/`.

## Turning on Google sign-in (one-time Firebase setup)

Until this is done, the site works but each player's progress stays on their own device.

1. Go to [console.firebase.google.com](https://console.firebase.google.com), click **Create a project**, name it `making-the-merge`, and finish the steps. Google Analytics can be turned off.
2. **Sign-in:** Build → **Authentication** → Get started → **Sign-in method** → **Google** → Enable → pick your support email → Save.
3. **Allow the website:** Authentication → **Settings** → **Authorized domains** → Add domain → `zuddlow.github.io`.
4. **Database:** Build → **Firestore Database** → Create database → choose a location near you → start in **production mode**.
5. **Rules:** in Firestore → **Rules**, replace everything with the contents of `firestore.rules`, change `OWNER_EMAIL_HERE` to the Google email you'll sign in with, and click **Publish**. That email becomes the owner who can edit card art and see designer stats.
6. **Web app config:** Project settings (gear icon) → **Your apps** → the `</>` Web button → register an app named `making-the-merge` (no hosting needed). Copy the `firebaseConfig` values into `src/firebase-config.js`, run `python3 build.py`, and commit.

Everything stays on Firebase's free plan at this scale.
