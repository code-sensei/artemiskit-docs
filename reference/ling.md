---
title: "Ant Ling adapter reference"
description: "Ant Ling adapter reference \u2014 source-backed ArtemisKit guide, synced from the core repository."
editUrl: "https://github.com/code-sensei/artemiskit/blob/main/packages/adapters/ling/README.md"
---

> Source: [core repository guide](https://github.com/code-sensei/artemiskit/blob/e58778bef40bf77b4294805e47f2d16c89cece0a/packages/adapters/ling/README.md), snapshot `e58778bef40b`. Synced 2026-10-24. Package versions are independent of milestone labels.


Native ArtemisKit adapter for Ant Ling's OpenAI-compatible Studio API.

Set `LING_API_KEY` and use `provider: ling` with `Ling-3.0-flash` or `Ling-3.0-tiny`. The default endpoint is `https://api.ant-ling.com/v1`.

Flash supports the Ling `thinking`, search, JSON, streaming, and tool-call request fields. ArtemisKit CLI tool loops execute only declared static fixtures; use the SDK's explicit `toolExecutor` for real tools.

Run the public examples with `examples/11-ling-api/`. Live calls require explicit opt-in through `LING_LIVE_TESTS=1`.
