# Agents

## Overview

Agents in this repository are coding assistants that implement scoped changes, verify behavior, and keep docs aligned with the live codebase. They are expected to be conservative, deterministic, and task-driven.

## Agent Responsibilities

- Verify review findings against current code before changing anything.
- Apply minimal, targeted fixes without unrelated refactors.
- Preserve security boundaries (server-only secrets, role-gated routes, and validated input paths).
- Run local verification commands after changes (lint/build and security scans when relevant).
- Keep delivery docs and operational notes consistent with implementation behavior.

## Input/Output Formats

### Input schema

- `task`: short natural-language objective.
- `constraints`: required behavioral or architectural constraints.
- `targets`: explicit files, symbols, or line ranges to inspect.
- `acceptance`: testable completion criteria.

### Output structure

- `verification`: per-finding status (`fixed`, `already-correct`, or `not-applicable`) with evidence.
- `changes`: concise list of modified files and behavior deltas.
- `validation`: executed checks and outcomes.
- `follow-ups`: any blocked items with concrete next action.

## Usage Examples

### Example request

"Verify signup flow findings and only fix what is still broken."

### Expected response shape

- Verification result for each finding.
- Minimal patch summary for changed files only.
- Lint/build/security check outcomes.

### Example request

"Harden admin route access and ensure moderation UI text matches behavior."

### Expected response shape

- Auth/role gating confirmation.
- UI copy change summary.
- Validation output summary.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
