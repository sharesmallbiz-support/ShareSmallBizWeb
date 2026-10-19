# Repository Story: ShareSmallBizWeb

> Generated 2026-10-18 | Window: 12 months (2025-10-18 → 2026-10-18) | Scope: full

## Executive Summary

ShareSmallBizWeb is the web front end for ShareSmallBiz, a social network for small businesses. It
is a React and TypeScript single-page app (126 Markdown, 84 `.tsx` and 41 `.ts` files touched in the
window). It talks to the hosted ShareSmallBiz API and has no backend of its own. The repository is
438 days old: the first commit landed on 2025-08-06 and the latest on 2026-10-18. There are 81
commits across all branches, and 16 of them fall inside this 12-month window.

Delivery came in bursts, not at a steady pace. Of the 16 commits in the window, 11 landed in
November 2025, when three pull requests reorganized the repository, added a full API specification
with a static mock API, and added profile, settings and analytics pages. After that there was a
four-month pause, then 2 commits in March 2026. Those two removed the mock layer and connected the
app to the real API. Then came a seven-month pause before 1 commit in October 2026. That last commit
adds process tooling rather than product features.

The process is still informal. There are 3 merged pull requests, no release tags, and 9 of 16
commits (56%) follow the conventional-commit format. The repository has no automated tests. Its one
CI workflow builds the app and deploys it to GitHub Pages, and that workflow has failed on the last
two pushes.

The most important fact for planning is that this repository is **on hold by design**. The
ShareSmallBiz API is being rebuilt as a standalone service in another repository. This client will
come back as a thin client generated from that API's OpenAPI contract, so the coming changes here
depend on that API work, not on work in this repository.

## Technical Analysis

### Development Velocity

| Month | Commits |
|---|---|
| 2025-10 | 2 |
| 2025-11 | 11 |
| 2026-03 | 2 |
| 2026-10 | 1 |

- **Lines:** +60,784 / −18,317 across the window. Of those additions, 41,544 come from a single commit
  (`0d7e322`) that vendors the BSW.DevSpark framework. Without that commit the product code changed
  by **+19,240 / −18,317**.
- **Churn ratio** (deletions ÷ additions, without the DevSpark commit) is about **0.95**. Nearly every
  line added was matched by one removed, which points to rewrites rather than growth. The clearest
  case is `77e5d3e` (2026-03-10), which deleted about 14,850 lines of mock API and server code and
  added about 2,180 lines of real API wiring.
- **Baseline:** the script recorded the comparison baseline as `2025-10`, which had 2 commits.
  Compared with that month, activity peaked in November 2025 and then fell to an average of under 1
  commit a month.

### Contributor Dynamics

| Role | Commits in window | Share |
|---|---|---|
| Lead Architect | 7 | 44% |
| Developer A | 5 | 31% |
| Developer B | 3 | 19% |
| Developer C | 1 | 6% |

- **Bus factor:** the top role has 44% of commits. The four git identities are fewer people than
  they look. The Lead Architect role is an automated coding-agent identity that wrote the November
  2025 feature burst. Developer B's 3 commits are all pull-request merges made through the GitHub
  web UI. In practice one maintainer directs all the work, so the bus factor is **1**.
- **Team shape:** contributors are counted per month, not added over time. November 2025 had 3 roles
  active and every other month had 1 or 2.

### Quality Signals

- **Tests:** none. The context script reports `test_file_count: 433`, but no file tracked in git
  matches a test naming pattern (`*.test.*`, `*.spec.*`, `test/`, `tests/`). The 433 figure counts
  something other than tracked tests, so do not rely on it. `test_related_commit_count` is 5, which
  only means 5 commit messages mention testing.
- **Commit messages:** 9 of 16 (56%) use conventional prefixes. Of the 16 subjects, 8 are `feat`, 1
  each are `fix`, `docs` and `refactor`, and 5 have no prefix.
- **Misleading messages:** the latest commit, `0d7e322`, is titled *"Add initial HTML files and asset
  testing for GitHub Pages deployment"*. It actually adds 186 files, nearly all of them the vendored
  BSW.DevSpark framework, plus `_tmp_ssb_build/` build output. Anyone reading the history later will
  be misled by that title.

### Governance & Process Maturity

- **Pull requests:** 3 merged PRs (#1–#3, all on 2025-11-12). Together with a branch-sync merge, merge
  commits are 4 of 16 (25%). All other changes went straight to `main`.
- **Tags:** none. Version history lives in `VERSION.md`, not in git tags.
- **Branch strategy:** trunk-based, with occasional feature branches. One long-lived `replit`
  branch remains from the original prototype.
- **Constitution:** `.knowledge/governance/constitution.md` exists, but it is the *stock*
  BSW.DevSpark framework constitution. Its principles cover the framework itself (for example
  "Platform Parity" and "PR Review Artifact Commit Discipline"), not ShareSmallBiz. It has not been
  customized yet.

### Architecture & Technology

- **Languages present:** TypeScript, JavaScript, Python, PowerShell, Shell and Markdown. The Python,
  PowerShell and Shell files are almost all DevSpark and Speckit tooling. The product itself is
  TypeScript and React.
- **Stack (from README):** React 18, Vite 5, Radix UI/Shadcn, Tailwind CSS, TanStack Query and JWT auth
  against `https://api.sharesmallbiz.com`.
- **Configuration:** `package.json` and one GitHub Actions workflow (`deploy-pages.yml`, which
  runs Node 18, builds, and deploys to Pages). There is no Dockerfile and no lint or format CI.
- **A history of architectural reversals:**
  1. a Replit prototype with a mock Express server (Aug 2025)
  2. an embedded .NET API plus a static mock API (Nov 2025)
  3. the .NET API and Drizzle/Postgres removed, and the client pointed at the hosted API (Mar 2026)
  4. a planned thin client generated from the new API's OpenAPI contract (pending)

## Change Patterns

Top hotspots in the window:

| File | Changes | What it suggests |
|---|---|---|
| `web/client/src/lib/staticApi.ts` | 5 | The mock API was the most-edited file, and it has since been deleted. Effort went into an intermediate layer. |
| `api/API-SPEC.md` | 4 | The API contract was written by hand and revised repeatedly. That is the source of the type drift. |
| `api/ShareSmallBiz.Api.csproj` | 4 | An embedded API, since removed. |
| `api/Services/StorageService.cs` | 3 | Same as above. |
| `api/sharesmallbiz.db-shm` | 3 | **SQLite runtime files were committed.** They should have been git-ignored. |

- **Directories:** among product files that still exist, 86 of 96 tracked files are under `web/`. The
  `api/` hotspots all refer to code that has since been deleted, so most of the window's churn was
  spent on code that no longer exists.
- **Complexity hotspots:** `web/shared/schema.ts` (3 changes) is the hand-written mirror of the API
  types and the file most likely to drift again. Replacing it with generated types is the planned fix.

## Milestone Timeline

There are no release tags. These commits are the closest thing to milestones:

| Date | Commit | Milestone |
|---|---|---|
| 2025-08-06 | `072c2e2` | First commit: Replit prototype, then a GitHub Pages deployment the same day |
| 2025-10-26 | `d921187` | Speckit spec-driven workflow scaffolding |
| 2025-11-12 | PR #1 | Repository reorganized around a .NET API and a unified build |
| 2025-11-13 | PR #2, #3 | API spec, static API mock, profile/settings/analytics pages, SQLite spec |
| 2026-03-10 | `f864402`, `77e5d3e` | Embedded API removed. The client uses the real hosted API with JWT login. |
| 2026-10-18 | `0d7e322` | BSW.DevSpark framework vendored into the repository |

Every period of activity ended with a long gap. No tagged release has followed any of them.

## Constitution Alignment

The constitution present is the generic BSW.DevSpark one, so measuring this repository against it
says little about ShareSmallBiz's own values. Where its principles do apply:

- **Explicit over implied:** commit `0d7e322` falls short. Its title does not describe what it
  changes.
- **Verification discipline:** there are no tests and the latest CI runs failed, so verification is
  missing.
- **Simplicity:** the March 2026 commits fit this principle. They removed about 18k lines of
  scaffolding.

Next step: run `/devspark-discover-constitution` to replace the stock constitution with
ShareSmallBiz principles, then regenerate this story.

## Developer FAQ

### What does this project do?

It is the browser front end for ShareSmallBiz, a social network where small businesses connect,
post discussions and share insights. It is a React single-page app. All data comes from the hosted
API at `https://api.sharesmallbiz.com`, and this repository contains no backend code.

### What tech stack does it use?

React 18 with TypeScript, built with Vite 5. It uses Radix UI/Shadcn components with Tailwind CSS,
TanStack Query for data fetching and wouter for routing. Authentication uses JWT bearer tokens
stored in `localStorage` under `ssb_token`.

### Where do I start?

Start with `web/client/src/lib/api.ts`, the central API client, then `web/shared/schema.ts`, the
API types, and `web/client/src/App.tsx` and `main.tsx`, which are among the most-changed files.
The current history hotspot, `staticApi.ts`, has been deleted, so skip it.

### How do I run it locally?

Install Node.js 18 or later, then run `cd web && npm install && npm run dev`. The app is served
at `http://localhost:5173`. To point it at a different API, set `VITE_API_BASE_URL` in `web/.env`.

### How do I run the tests?

You can't yet. The repository has no tracked test files and no test step in CI. The only check
available is `cd web && npm run build`, as described in the README's Contributing section.

### What is the branching/PR workflow?

Mostly direct commits to `main`. Only 3 pull requests have been merged, all on 2025-11-12, and
merges are 25% of commits. The README asks contributors to use a feature branch and a pull request.
Pushes to `main` trigger the GitHub Pages workflow.

### Who do I ask when I'm stuck?

The project has one effective maintainer, the person behind the Developer A and B roles. The Lead
Architect role (7 commits) is an automated coding-agent identity, not a separate person.

### What areas of the code change most often?

These still exist: `web/shared/schema.ts`, `web/client/src/App.tsx`, and
`web/client/src/components/` (`post-card.tsx`, `navigation-header.tsx`). The `api/` hotspots
are gone.

### Are there coding standards I must follow?

There is no lint or format configuration in CI. Conventional-commit prefixes are used in 56% of
commits, and following them is recommended. BSW.DevSpark rules apply through
`.knowledge/governance/constitution.md` and `CLAUDE.md`.

### What version is currently released?

There are no git tags, so no version is formally released. `VERSION.md` holds the version history.
The GitHub Pages deployment last succeeded on 2026-03-10, at commit `f864402`.

---

Generated by /devspark-repo-story | BSW.DevSpark v1.6.0 — Adaptive System Life Cycle Development
