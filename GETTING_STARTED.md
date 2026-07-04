# Little Roots — Getting Started (for a brand-new developer)

This guide is for someone who has **never used Claude Code** and wants to get the
Little Roots mobile app running on their own Mac so they can test it.

You do **not** need to be a programmer. You will install a few tools, download the
project, and then let **Claude Code** (an AI coding assistant that runs in your
terminal) do all the technical work for you. Just copy–paste the commands below.

> ⚠️ **You need a Mac.** Building and running an iOS app requires macOS + Xcode.
> This will not work on Windows or Linux.

---

## What you'll end up with

The Little Roots app running in the **iPhone Simulator** on your Mac, where you can
tap through it, swipe the activity cards, watch the animations, and test sign-in.

The first setup takes about **45–60 minutes**, mostly waiting for downloads and the
first build. After that, launching the app again takes 1–2 minutes.

---

## Step 1 — Install the basic tools (one-time)

### 1a. Xcode (Apple's developer app)
1. Open the **App Store** on your Mac.
2. Search for **Xcode** and click **Get / Install** (it's ~8 GB, so this takes a while).
3. When it finishes, **open Xcode once** and accept the license agreement it shows.
4. Close Xcode.

### 1b. Xcode Command Line Tools
Open the **Terminal** app (press `Cmd + Space`, type "Terminal", hit Enter) and paste:
```bash
xcode-select --install
```
Click **Install** in the popup and wait for it to finish. (If it says
"already installed", that's fine — continue.)

### 1c. Homebrew (a tool installer for Mac)
Paste this into Terminal and follow the prompts (it may ask for your Mac password):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
After it finishes, it may print 2 lines starting with `echo` and `eval` — **copy and
run those** so `brew` works in your terminal.

### 1d. Node.js and Git
```bash
brew install node git watchman
```

---

## Step 2 — Install Claude Code

Claude Code is the AI assistant that will do the technical work. Install it:
```bash
npm install -g @anthropic-ai/claude-code
```

Then start it once to log in:
```bash
claude
```
It opens a browser to sign in with your Anthropic account (create one if needed —
Claude Code requires a paid Claude subscription or API credits). After logging in,
type `/exit` to quit for now.

---

## Step 3 — Download the project from GitHub

Pick a folder to keep your projects in and download (clone) the app there. This creates
the folder if it doesn't exist yet:

```bash
mkdir -p ~/Projects
cd ~/Projects
git clone https://github.com/alemzukic77-dev/little-roots-app.git
cd little-roots-app
```

You now have the whole app in `~/Projects/little-roots-app`.

---

## Step 4 — Let Claude Code set everything up

From inside the project folder, start Claude:
```bash
claude
```

Now **copy–paste this exact message** to Claude and press Enter:

> Set up this React Native / Expo app and run it in the iOS simulator so I can test
> it. Do everything needed: install npm dependencies, run `npx expo prebuild` if
> required, install CocoaPods (`cd ios && pod install`, using `LANG=en_US.UTF-8`
> because CocoaPods needs it on this project), build the iOS dev client with
> xcodebuild for the simulator (use `CODE_SIGNING_ALLOWED=NO`), boot an iPhone
> simulator, install the built app, start the Metro bundler
> (`npx expo start --dev-client`), and launch the app. If anything fails, read the
> error and fix it, then continue. When it's running, take a screenshot so I can see
> it worked. This is a Firebase app (`@react-native-firebase`) — the
> `GoogleService-Info.plist` is already in the repo, so Firebase works without extra
> setup. Do NOT use Expo Go — this app needs a dev client build.

Claude now works through everything automatically, including a ~15–25 minute first
build. **Let it run** — it will tell you when the app is up and show a screenshot.

> 💡 If Claude asks permission to run commands, approve them. You can also start Claude
> with `claude --dangerously-skip-permissions` so it runs without asking each time
> (only do this on a project you trust — this one is yours).

---

## Step 5 — Test the app

Once it's running in the simulator you can:
- **Swipe** the activity cards left/right on the home screen
- **Tap** a card to open the full activity (steps, materials, the looping animation)
- Try the **filters** (All / Popular / categories) and **Search**
- **Sign up / sign in** (email, or Google / Apple)
- **Save** activities (bookmark) and **rate** them
- Open **Profile** → try **Delete account**

To relaunch the app later (after closing the terminal), just:
```bash
cd ~/Projects/little-roots-app
claude
```
and tell Claude: *"start Metro and launch the app in the simulator."*

---

## Notes & good to know

- **The backend is already set up.** The app talks to the shared Firebase project
  (`little-roots-montessori-200ce`). All 134 activities and their animations are
  already live — you don't need to seed anything.
- **You don't need any secret files for local testing.** The App Store signing
  credentials (in a git-ignored `credentials/` folder) are only for publishing to the
  App Store, not for running in the simulator.
- **Red "TurboModuleRegistry / metro" error screen?** It usually means another
  project's Metro is using port 8081. Tell Claude: *"free port 8081 and restart Metro
  for this app."*
- **First build is the slow one.** Later launches are fast (Metro + install only).
- **Want to make a change?** Describe it to Claude in plain English (e.g. "change the
  home screen title color to green") — it edits the code, then reload the app to see it.

---

## If you need deeper access (optional)

- **Firebase console** (to see users, activities, database): ask Alem to add your
  Google account to the `little-roots-montessori-200ce` Firebase project.
- **Publishing to App Store / TestFlight**: needs the Apple Developer account and
  signing credentials — coordinate with Alem / Maryam. Local simulator testing (this
  guide) does not need any of that.

Something breaks? Copy the error text and paste it to Claude — that's the fastest way
to get unstuck.
