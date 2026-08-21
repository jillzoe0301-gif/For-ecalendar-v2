#!/usr/bin/env bash
set +u
set +e
(
  set -Ee -o pipefail
  trap 'echo; echo "❌ 部署失敗"; echo "錯誤行數：${LINENO}"; echo "錯誤指令：${BASH_COMMAND}"' ERR
  PROJECT="/workspaces/For-ecalendar-v2"
  PACKAGE="for-e-v002-1h-stable-1-3eg-mobile-bottom-nav-viewport-lock-phase4-official-stable"
  TAG="official-v002-1h-stable-1-3eg"
  STAMP="$(date +%Y%m%d-%H%M%S)"
  BRANCH="update/v002-1h-stable-1-3eg-mobile-bottom-nav-${STAMP}"
  BACKUP="/workspaces/For-ecalendar-v2-backup-before-1-3eg-${STAMP}.tar.gz"
  TEMP_ZIP="/workspaces/.for-e-1-3eg-package-${STAMP}.zip"
  cd "$PROJECT"
  ZIP_PATH="$PROJECT/${PACKAGE}.zip"
  if [ ! -f "$ZIP_PATH" ]; then
    ZIP_PATH="$(find "$PROJECT" -maxdepth 1 -type f -name "${PACKAGE}*.zip" -printf '%T@ %p\n' 2>/dev/null | sort -nr | head -1 | cut -d' ' -f2-)"
  fi
  [ -n "$ZIP_PATH" ] && [ -f "$ZIP_PATH" ] || { echo "找不到 1-3eg ZIP"; false; }
  unzip -tq "$ZIP_PATH"
  unzip -p "$ZIP_PATH" src/main.js | grep -F "const APP_VERSION = 'V002-1H-stable-1-3eg'"
  unzip -p "$ZIP_PATH" src/main.js | grep -F "const MOBILE_BOTTOM_NAV_VIEWPORT_LOGIC_VERSION = '1-3eg'"
  cp "$ZIP_PATH" "$TEMP_ZIP"
  DIRTY_FILES="$({ git -c core.quotepath=false diff --name-only; git -c core.quotepath=false diff --cached --name-only; } | sort -u)"
  CODE_DIRTY=""
  if [ -n "$DIRTY_FILES" ]; then
    while IFS= read -r f; do
      [ -n "$f" ] || continue
      case "$f" in
        for-e-v002-1h-stable-*|FOR-e正式上線版_*.tar.gz|for-e-*.tar.gz) git restore --staged -- "$f" 2>/dev/null || true; git restore -- "$f" 2>/dev/null || true ;;
        *) CODE_DIRTY="${CODE_DIRTY}${f}\n" ;;
      esac
    done <<< "$DIRTY_FILES"
  fi
  if [ -n "$CODE_DIRTY" ]; then echo "有尚未提交的程式修改："; printf '%b' "$CODE_DIRTY"; false; fi
  tar --exclude='./node_modules' --exclude='./dist' --exclude='./.git' --exclude='./*.zip' --exclude='./*.tar.gz' --exclude='./*.tgz' -czf "$BACKUP" .
  git fetch origin main
  REMOTE_VERSION="$(git show origin/main:src/main.js 2>/dev/null | grep "const APP_VERSION" | head -1 || true)"
  echo "遠端版本：$REMOTE_VERSION"
  if ! printf '%s' "$REMOTE_VERSION" | grep -Eq "1-3ef|1-3eg"; then echo "遠端 main 不是預期的 1-3ef / 1-3eg，停止部署"; false; fi
  git switch -c "$BRANCH" origin/main
  find "$PROJECT" -maxdepth 1 -type f \( -name 'for-e-v002-1h-stable-*' -o -name 'FOR-e正式上線版_*.tar.gz' -o -name 'for-e-*.tar.gz' \) -print -delete
  unzip -o "$TEMP_ZIP" -d "$PROJECT"
  grep -nF "const APP_VERSION = 'V002-1H-stable-1-3eg'" src/main.js
  grep -nF "const MOBILE_BOTTOM_NAV_VIEWPORT_LOGIC_VERSION = '1-3eg'" src/main.js
  grep -nF "function syncMobileBottomNavToVisualViewport" src/main.js
  grep -nF -- "--for-e-mobile-nav-visual-bottom" src/style.css
  node --check src/main.js
  git diff --check
  if [ ! -x node_modules/.bin/vite ]; then npm ci --no-audit --no-fund; fi
  npm run build
  git add -u -- .
  git add index.html package.json package-lock.json vite.config.js public src docs supabase
  if git diff --cached --quiet; then echo "目前已是相同的 1-3eg"; else git commit -m "fix: lock mobile bottom navigation to visual viewport (1-3eg)"; fi
  git fetch origin main
  if ! git merge-base --is-ancestor origin/main HEAD; then git rebase origin/main; fi
  git push origin HEAD:main
  git tag -f "$TAG" HEAD
  git push origin -f "$TAG"
  rm -f "$TEMP_ZIP"
  echo "✅ FOR-e 1-3eg 部署完成"
  grep -n "const APP_VERSION" src/main.js | head -1
  echo "分支：$(git branch --show-current)"
  echo "HEAD：$(git rev-parse --short HEAD)"
  echo "備份：$BACKUP"
)
RESULT=$?
set +u
set +e
if [ "$RESULT" -eq 0 ]; then echo "✅ Terminal 部署程序完成，請到 Vercel 確認 Production Ready"; else echo "❌ 部署未完成，錯誤代碼：$RESULT"; fi
