# Repository Story: ShareSmallBizWeb

> Generated 2026-10-19 | Window: 12 months (2025-10-19 → 2026-10-19) | Scope: full

## Executive Summary

ShareSmallBizWeb is the web front end for ShareSmallBiz, a social network for small businesses. It
is a React and TypeScript single-page application (84 `.tsx` and 41 `.ts` files touched in the
window). All of its data comes from the hosted ShareSmallBiz API; the repository has no backend of
its own. The repository is 438 days old: the first commit was on 2025-08-06 and the latest on
2026-10-18. It has 82 commits across all branches, and 17 of them fall inside this 12-month window.

Delivery has come in bursts. Of the 17 commits in the window, 11 landed in November 2025. In that
month three pull requests reorganized the repository, added a full API specification with a static
mock API, and added profile, settings and analytics pages. Four quiet months followed. In March 2026,
2 commits removed the mock layer and connected the app to the real API. After seven more quiet
months, 2 commits in October 2026 added the BSW.DevSpark spec-driven process tooling. Neither
October commit changed product code.

The process is still informal: 3 merged pull requests, no release tags, and 10 of 17 commits (59%)
follow the conventional-commit format. There are no automated tests. The single CI workflow builds
the app and deploys it to GitHub Pages, and its last two runs on `main` failed.

The most important fact for planning is that this repository is **deliberately on hold**. The
ShareSmallBiz API is being rebuilt as a standalone service in another repository. This client will
come back later as a thin client whose types are generated from that API's OpenAPI contract. Until
then, progress here depends on the API work rather than on activity in this repository.

## Technical Analysis

### Development Velocity

| Month | Commits |
|---|---|
| 2025-10 | 2 |
| 2025-11 | 11 |
| 2026-03 | 2 |
| 2026-10 | 2 |

- **Lines:** +62,465 / −18,317 across the window. The two October 2026 DevSpark commits account for
  43,225 of the added lines: 41,544 in `0d7e322` (the vendored framework) and 1,681 in `dbd5da9`
  (entry points, constitution, repo story). Product code alone moved **+19,240 / −18,317**.
- **Churn ratio** (deletions divided by additions, product code only) is about **0.95**. That points
  to rewrites rather than growth. The clearest case is `77e5d3e` (2026-03-10), which deleted about
  14,850 lines of mock API and server code and added about 2,180 lines of real API wiring.
- **Baseline:** the script recorded `2025-10` (2 commits) as the comparison baseline. Activity peaked
  in November 2025 and has averaged under 1 commit a month since.

### Contributor Dynamics

| Role | Commits in window | Share |
|---|---|---|
| Lead Architect | 7 | 41% |
| Developer A | 6 | 35% |
| Developer B | 3 | 18% |
| Developer C | 1 | 6% |

- **Bus factor:** the top role accounts for 41% of commits, but the four git identities represent
  fewer people than that suggests. Lead Architect is an automated coding-agent identity, and it
  produced the November 2025 feature burst. Developer B's commits are all pull-request merges made
  through the GitHub web UI. One maintainer directs all of the work, so the effective bus factor is
  **1**.
- **Team shape:** no month has had more than 3 active roles (November 2025). Every other month has
  had one or two.

### Quality Signals

- **Tests:** there are none. The context script reports `test_file_count: 433`, but no file
  tracked in git matches a test pattern (`*.test.*`, `*.spec.*`, `test/`, `tests/`). The script's
  count is not a reliable number. `test_related_commit_count: 5` only counts commit messages that
  mention testing.
- **Commit messages:** 10 of 17 (59%) use conventional prefixes. By type there are 8 `feat`, 1 each
  of `fix`, `docs`, `refactor` and `chore`, and 5 with no prefix. The script reports
  `informal_commit_count: 0`, which contradicts the 5 unprefixed subjects, so that field is not
  reliable either.
- **Misleading commit title:** `0d7e322` is titled *"Add initial HTML files and asset testing for
  GitHub Pages deployment"*, but it actually adds 186 files: the vendored BSW.DevSpark framework and
  the `_tmp_ssb_build/` build output. The follow-up commit `dbd5da9` corrects the record in its
  message body. That helps, but the misleading title remains in the history.

### Governance & Process Maturity

- **Pull requests:** 3 merged (#1–#3, all on 2025-11-12). Including one branch-sync merge, merge
  commits make up 4 of 17 (24%) of the window. Everything else was committed directly to `main`,
  except `dbd5da9`, which sits on the local branch `devspark-setup`.
- **Tags:** none. Version history is kept in `VERSION.md`.
- **Branch strategy:** trunk-based, with occasional feature branches. A long-lived `replit` branch
  from the original prototype still exists.
- **Constitution:** `.knowledge/governance/constitution.md` exists, but it is still the stock
  BSW.DevSpark framework constitution, seeded as a placeholder. It has not been tailored to
  ShareSmallBiz.

### Architecture & Technology

- **Languages present:** TypeScript, JavaScript, Python, PowerShell, Shell and Markdown. The Python,
  PowerShell and Shell files come almost entirely from the DevSpark and Speckit tooling; the product
  itself is TypeScript and React.
- **Stack (from the README):** React 18, Vite 5, Radix UI/Shadcn, Tailwind CSS, TanStack Query, and
  JWT authentication against `https://api.sharesmallbiz.com`.
- **Configuration:** a `package.json` and one GitHub Actions workflow (`deploy-pages.yml`: Node 18,
  build, deploy to Pages). There is no Dockerfile and no lint or format step in CI.
- **Architectural reversals:** the architecture has changed direction several times:
  1. A Replit prototype with a mock Express server (Aug 2025).
  2. An embedded .NET API plus a static mock (Nov 2025).
  3. Both removed, with the app calling the hosted API directly (Mar 2026).
  4. Next, a thin client generated from the new API's OpenAPI contract (pending).

## Change Patterns

Top hotspots in the window:

| File | Changes | What it suggests |
|---|---|---|
| `web/client/src/lib/staticApi.ts` | 5 | The most-edited file was the mock API, which has since been deleted. Effort went into an intermediate layer. |
| `README.md` | 4 | The README was rewritten with each change of direction. The latest edit links this story. |
| `api/API-SPEC.md` | 4 | A hand-written API contract that was revised repeatedly. It is a source of drift. |
| `api/ShareSmallBiz.Api.csproj` | 4 | Part of the embedded API, now removed. |
| `api/sharesmallbiz.db-shm` | 3 | **SQLite runtime files were committed.** They should have been in `.gitignore`. |

- **Directories:** among product files that still exist, 86 of 96 tracked files are under `web/`.
  None of the `api/` hotspot files exist anymore, so most of the window's churn went into code that
  has since been deleted.
- **Complexity hotspot:** `web/shared/schema.ts` (3 changes) is the hand-written copy of the API
  types. It is the file most likely to drift again; the plan is to replace it with types generated
  from the API.

## Milestone Timeline

There are no release tags. These commits serve as milestones:

| Date | Commit | Milestone |
|---|---|---|
| 2025-08-06 | `072c2e2` | First commit: Replit prototype, deployed to GitHub Pages the same day |
| 2025-10-26 | `d921187` | Speckit spec-driven workflow scaffolding |
| 2025-11-12 | PR #1 | Repository reorganized around a .NET API with a unified build |
| 2025-11-13 | PR #2, #3 | API spec, static mock, profile/settings/analytics pages, SQLite spec |
| 2026-03-10 | `f864402`, `77e5d3e` | Embedded API removed; real hosted API and JWT login |
| 2026-10-18 | `0d7e322`, `dbd5da9` | BSW.DevSpark 9.3.0 vendored and wired into Claude Code |

Each burst of work was followed by a long gap, and none of them ended in a tagged release.

## Constitution Alignment

The constitution in place is the generic BSW.DevSpark one, so measuring against it says little about
ShareSmallBiz's own values. Where its principles do apply:

- **Explicit over implied:** `0d7e322` does not meet this principle; its title misdescribes its
  contents. `dbd5da9` meets it, with a body that lists each change.
- **Verification discipline:** not met. There are no tests, and the latest CI runs failed.
- **Simplicity:** met by the March 2026 commits, which removed about 18k lines of scaffolding.

Next step: run `/devspark-discover-constitution` to replace the stock constitution with
ShareSmallBiz's own principles, then regenerate this story.

## Developer FAQ

### What does this project do?

It is the browser front end for ShareSmallBiz, a social network where small businesses connect,
post discussions and share insights. It is a React single-page app. All data comes from the hosted
API at `https://api.sharesmallbiz.com`, and the repository contains no backend.

### What tech stack does it use?

React 18 with TypeScript, built with Vite 5. The UI uses Radix UI/Shadcn components with Tailwind
CSS. Data fetching uses TanStack Query and routing uses wouter. Authentication uses JWT bearer tokens
stored in `localStorage` under `ssb_token`.

### Where do I start?

Start with `web/client/src/lib/api.ts` (the central API client), `web/shared/schema.ts` (the API
types), and `web/client/src/main.tsx` and `App.tsx`, which are among the most-changed files. Skip
`staticApi.ts`; it is a historical hotspot that has been deleted.

### How do I run it locally?

Install Node.js 18 or later, then run `cd web && npm install && npm run dev`. The app is served at
`http://localhost:5173`. To point it at another API, set `VITE_API_BASE_URL` in `web/.env`.

### How do I run the tests?

You can't yet. The repository has no tracked test files and no test step in CI. The only check is
`cd web && npm run build`, as described in the README's Contributing section.

### What is the branching/PR workflow?

Most commits go straight to `main`. Only 3 pull requests have been merged, all on 2025-11-12, and
merge commits are 24% of the window. The README asks contributors to use a feature branch and open
a pull request. Every push to `main` triggers the GitHub Pages workflow.

### Who do I ask when I'm stuck?

The project's single maintainer, who appears as the Developer A and Developer B roles. The Lead
Architect role (7 commits) is an automated coding-agent identity, not a separate person.

### What areas of the code change most often?

Among files that still exist, the most-changed are `README.md`, `web/client/src/main.tsx`,
`web/shared/schema.ts`, `App.tsx`, and the components `post-card.tsx` and
`navigation-header.tsx`. The `api/` hotspots no longer exist.

### Are there coding standards I must follow?

There is no lint or format configuration in CI. Conventional-commit prefixes appear on 59% of
commits and are recommended. BSW.DevSpark rules apply through `.knowledge/governance/constitution.md`
and `CLAUDE.md`.

### What version is currently released?

There are no git tags, so nothing is formally released. Version history is kept in `VERSION.md`. The
last successful GitHub Pages deployment was on 2026-03-10, at `f864402`.

---

Generated by /devspark-repo-story | BSW.DevSpark v1.6.0 — Adaptive System Life Cycle Development
