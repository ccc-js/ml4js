#!/usr/bin/env bash
set -euo pipefail
set -x

npm run clean
npm run format:check
npm run lint
npm run test
npm run build
