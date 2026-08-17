#!/usr/bin/env bash
set +u
set +e

(
  set -Ee -o pipefail

  trap '
    echo
    echo "❌ 部署失敗"
    echo "錯誤行數：${LINENO}"
    echo "錯誤指令：${BASH_COMMAND}"
  ' ERR

  PROJECT="/workspaces/For-ecalendar-v2"
  PACKAGE="for-e-v002-1h-stable-1-3ef-calendar-interaction-performance-phase4-official-stable"
  TAG="official-v002-1h-stable-1-3ef"
  STAMP="$(date +%Y%m%d-%H%M%S)"
  BRANCH="update/v002-1h-stable-1-3ef-calendar-performance-${STAMP}"
  BACKUP="/workspaces/For-ecalendar-v2-backup-before-1-3ef-${STAMP}.tar.gz"
  TEMP_ZIP="/workspaces/.for-e-1-3ef-package-${STAMP}.zip"

  cd "$PROJECT"

  echo "===== 1. 尋找並驗證 1-3ef ZIP ====="
  ZIP_PATH="$PROJECT/${PACKAGE}.zip"

  if [ ! -f "$ZIP_PATH" ]; then
    ZIP_PATH="$(
      find "$PROJECT" -maxdepth 1 -type f -name "${PACKAGE}*.zip" \
        -printf '%T@ %p\n' 2>/dev/null | sort -nr | head -1 | cut -d' ' -f2-
    )"
  fi

  if [ -z "$ZIP_PATH" ] || [ ! -f "$ZIP_PATH" ]; then
    echo "找不到更新檔：${PACKAGE}.zip"
    false
  fi

  echo "使用更新檔：$ZIP_PATH"
  ls -lh "$ZIP_PATH"
  unzip -tq "$ZIP_PATH"

  unzip -p "$ZIP_PATH" src/main.js | grep -F "const APP_VERSION = 'V002-1H-stable-1-3ef'"
  unzip -p "$ZIP_PATH" src/main.js | grep -F "const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3ef'"
  unzip -p "$ZIP_PATH" src/main.js | grep -F "const CALENDAR_INTERACTION_PERFORMANCE_LOGIC_VERSION = '1-3ef'"

  cp "$ZIP_PATH" "$TEMP_ZIP"

  echo "===== 2. 確認沒有未保存的程式修改 ====="
  DIRTY_FILES="$(
    {
      git -c core.quotepath=false diff --name-only
      git -c core.quotepath=false diff --cached --name-only
    } | sort -u
  )"
  CODE_DIRTY=""

  if [ -n "$DIRTY_FILES" ]; then
    while IFS= read -r dirty_file; do
      [ -n "$dirty_file" ] || continue
      case "$dirty_file" in
        for-e-v002-1h-stable-*|FOR-e正式上線版_*.tar.gz|for-e-*.tar.gz)
          git restore --staged -- "$dirty_file" 2>/dev/null || true
          git restore -- "$dirty_file" 2>/dev/null || true
          ;;
        *)
          CODE_DIRTY="${CODE_DIRTY}${dirty_file}\n"
          ;;
      esac
    done <<< "$DIRTY_FILES"
  fi

  if [ -n "$CODE_DIRTY" ]; then
    echo "目前有尚未提交的程式修改："
    printf '%b' "$CODE_DIRTY"
    echo "為避免覆蓋未保存程式，停止部署。"
    false
  fi

  echo "===== 3. 備份目前專案 ====="
  tar \
    --exclude='./node_modules' \
    --exclude='./dist' \
    --exclude='./.git' \
    --exclude='./*.zip' \
    --exclude='./*.tar.gz' \
    --exclude='./*.tgz' \
    -czf "$BACKUP" .
  echo "備份：$BACKUP"

  echo "===== 4. 取得 GitHub main ====="
  git fetch origin main
  REMOTE_VERSION="$(git show origin/main:src/main.js 2>/dev/null | grep "const APP_VERSION" | head -1 || true)"
  echo "遠端版本：$REMOTE_VERSION"

  if ! printf '%s' "$REMOTE_VERSION" | grep -Eq "1-3eb|1-3ec|1-3ed|1-3ee|1-3ef"; then
    echo "遠端 main 不是可安全累積升級的 1-3eb ～ 1-3ef，停止部署。"
    false
  fi

  echo "===== 5. 建立 1-3ef 分支 ====="
  git switch -c "$BRANCH" origin/main

  echo "===== 6. 清理專案根目錄舊交付檔 ====="
  find "$PROJECT" -maxdepth 1 -type f \( \
    -name 'for-e-v002-1h-stable-*' -o \
    -name 'FOR-e正式上線版_*.tar.gz' -o \
    -name 'for-e-*.tar.gz' \
  \) -print -delete

  echo "===== 7. 解壓 1-3ef ====="
  unzip -o "$TEMP_ZIP" -d "$PROJECT"

  echo "===== 8. 確認效能修正 ====="
  grep -nF "const APP_VERSION = 'V002-1H-stable-1-3ef'" src/main.js
  grep -nF "const CALENDAR_INTERACTION_PERFORMANCE_LOGIC_VERSION = '1-3ef'" src/main.js
  grep -nF "let schedulesDataRevision = 0" src/main.js
  grep -nF "function getOrBuildOverviewPerformanceCache" src/main.js
  grep -nF "function shouldPrefetchCommonPersonalScheduleRange" src/main.js
  grep -nF "function scheduleOverviewPerformanceWarmup" src/main.js
  grep -nF "overviewPerformanceCache = getOrBuildOverviewPerformanceCache" src/main.js
  grep -nF "if (cachedRows) return cachedRows" src/main.js | tail -1

  echo "===== 9. JavaScript / Git 檢查 ====="
  node --check src/main.js
  git diff --check

  echo "===== 10. 正式 Build ====="
  if [ ! -x node_modules/.bin/vite ]; then
    npm ci --no-audit --no-fund
  fi
  npm run build

  echo "===== 11. Commit ====="
  git add -u -- .
  git add index.html package.json package-lock.json vite.config.js public src docs supabase
  git status --short

  if git diff --cached --quiet; then
    echo "目前已是相同的 1-3ef。"
  else
    git commit -m "perf: smooth calendar navigation and reuse overview indexes (1-3ef)"
  fi

  echo "===== 12. Push main ====="
  git fetch origin main
  if ! git merge-base --is-ancestor origin/main HEAD; then
    git rebase origin/main
  fi
  git push origin HEAD:main

  echo "===== 13. 正式 Tag ====="
  git tag -f "$TAG" HEAD
  git push origin -f "$TAG"
  rm -f "$TEMP_ZIP"

  echo
  echo "✅ FOR-e 1-3ef 部署完成"
  grep -n "const APP_VERSION" src/main.js | head -1
  echo "分支：$(git branch --show-current)"
  echo "HEAD：$(git rev-parse --short HEAD)"
  echo "備份：$BACKUP"
)

RESULT=$?
set +u
set +e

echo
if [ "$RESULT" -eq 0 ]; then
  echo "✅ Terminal 部署程序完成"
  echo "請到 Vercel → Deployments 確認 main Production 顯示 Ready"
else
  echo "❌ 部署未完成，錯誤代碼：$RESULT"
fi
