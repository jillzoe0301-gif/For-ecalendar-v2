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
  PACKAGE="for-e-v002-1h-stable-1-3ec-statistics-exclusions-translator-only-phase4-official-stable"
  VERSION="V002-1H-stable-1-3ec"
  TAG="official-v002-1h-stable-1-3ec"
  STAMP="$(date +%Y%m%d-%H%M%S)"
  BRANCH="update/v002-1h-stable-1-3ec-statistics-translators-${STAMP}"
  BACKUP="/workspaces/For-ecalendar-v2-backup-before-1-3ec-${STAMP}.tar.gz"
  TEMP_ZIP="/workspaces/.for-e-1-3ec-package-${STAMP}.zip"

  cd "$PROJECT"

  echo "======================================"
  echo "1. 尋找並驗證 1-3ec 完整專案 ZIP"
  echo "======================================"

  ZIP_PATH="$PROJECT/${PACKAGE}.zip"

  if [ ! -f "$ZIP_PATH" ]; then
    ZIP_PATH="$(
      find "$PROJECT" \
        -maxdepth 1 \
        -type f \
        -name "${PACKAGE}*.zip" \
        ! -name '*complete-delivery*' \
        -printf '%T@ %p\n' 2>/dev/null \
        | sort -nr \
        | head -1 \
        | cut -d' ' -f2-
    )"
  fi

  if [ -z "$ZIP_PATH" ] || [ ! -f "$ZIP_PATH" ]; then
    echo "找不到更新檔：${PACKAGE}.zip"
    echo "請先將完整專案 ZIP 上傳到：$PROJECT"
    false
  fi

  echo "使用更新檔：$ZIP_PATH"
  ls -lh "$ZIP_PATH"
  unzip -tq "$ZIP_PATH"

  unzip -p "$ZIP_PATH" src/main.js \
    | grep -F "const APP_VERSION = 'V002-1H-stable-1-3ec'"

  unzip -p "$ZIP_PATH" src/main.js \
    | grep -F "const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3ec'"

  unzip -p "$ZIP_PATH" src/main.js \
    | grep -F "const STATS_TRANSLATOR_ONLY_LOGIC_VERSION = '1-3ec'"

  cp "$ZIP_PATH" "$TEMP_ZIP"
  echo "ZIP 完整性與版本檢查通過。"

  echo
  echo "======================================"
  echo "2. 確認沒有未保存的程式修改"
  echo "======================================"

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
          echo "允許清理的舊交付檔：$dirty_file"
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
    echo "為避免覆蓋尚未保存的程式，本次部署停止。"
    false
  fi

  echo "程式檔案狀態可安全更新。"

  echo
  echo "======================================"
  echo "3. 備份目前專案"
  echo "======================================"

  tar \
    --exclude='./node_modules' \
    --exclude='./dist' \
    --exclude='./.git' \
    --exclude='./*.zip' \
    --exclude='./*.tar.gz' \
    --exclude='./*.tgz' \
    -czf "$BACKUP" .

  echo "備份完成：$BACKUP"
  ls -lh "$BACKUP"

  echo
  echo "======================================"
  echo "4. 取得 GitHub main 最新版本"
  echo "======================================"

  git fetch origin main

  REMOTE_VERSION="$(
    git show origin/main:src/main.js 2>/dev/null \
      | grep "const APP_VERSION" \
      | head -1 || true
  )"

  echo "遠端 main 目前版本：$REMOTE_VERSION"

  if ! printf '%s' "$REMOTE_VERSION" | grep -Eq "1-3eb|1-3ec"; then
    echo "遠端 main 不是預期的 1-3eb / 1-3ec，為避免覆蓋其他更新，本次部署停止。"
    false
  fi

  echo
  echo "======================================"
  echo "5. 從最新 main 建立 1-3ec 更新分支"
  echo "======================================"

  git switch -c "$BRANCH" origin/main
  echo "目前分支：$(git branch --show-current)"

  echo
  echo "======================================"
  echo "6. 清理專案根目錄舊交付檔"
  echo "======================================"

  find "$PROJECT" -maxdepth 1 -type f \( \
    -name 'for-e-v002-1h-stable-*' -o \
    -name 'FOR-e正式上線版_*.tar.gz' -o \
    -name 'for-e-*.tar.gz' \
  \) -print -delete

  echo "專案根目錄舊交付檔已清理。"

  echo
  echo "======================================"
  echo "7. 解壓 1-3ec 完整專案"
  echo "======================================"

  unzip -o "$TEMP_ZIP" -d "$PROJECT"

  echo
  echo "======================================"
  echo "8. 確認統計排除與翻譯人員統計"
  echo "======================================"

  grep -nF "const APP_VERSION = 'V002-1H-stable-1-3ec'" src/main.js
  grep -nF "const OFFICIAL_VERSION = 'official-v002-1h-stable-1-3ec'" src/main.js
  grep -nF "const STATS_TRANSLATOR_ONLY_LOGIC_VERSION = '1-3ec'" src/main.js
  grep -nF "const STATS_EXCLUDED_SCHEDULE_TYPE_NAMES" src/main.js
  grep -nF "'電表提醒'" src/main.js | head -1
  grep -nF "'辦件提醒'" src/main.js | head -1
  grep -nF "'驗證提醒'" src/main.js | head -1
  grep -nF "'轉出到期最後一天'" src/main.js | head -1
  grep -nF "'加班單繳交'" src/main.js | head -1
  grep -nF "function getActiveStatsTranslatorStaffRows" src/main.js
  grep -nF "function getStatsTranslatorAssignees" src/main.js
  grep -nF "全部翻譯" src/main.js
  grep -nF "只統計所有啟用翻譯；其他角色不列入" src/main.js

  echo
  echo "======================================"
  echo "9. JavaScript 與 Git 差異檢查"
  echo "======================================"

  node --check src/main.js
  git diff --check
  echo "JavaScript 與差異檢查通過。"

  echo
  echo "======================================"
  echo "10. 執行正式 Build"
  echo "======================================"

  if [ ! -x node_modules/.bin/vite ]; then
    echo "找不到現有 Vite，依 package-lock.json 安裝依賴。"
    npm ci --no-audit --no-fund
  fi

  npm run build

  echo
  echo "======================================"
  echo "11. 提交 1-3ec"
  echo "======================================"

  git add -u -- .
  git add \
    index.html \
    package.json \
    package-lock.json \
    vite.config.js \
    public \
    src \
    docs \
    supabase

  git status --short

  if git diff --cached --quiet; then
    echo "目前 main 已包含相同的 1-3ec 程式，沒有新差異需要提交。"
  else
    git commit -m "fix: exclude reminder stats and show translator personnel stats only (1-3ec)"
  fi

  echo
  echo "======================================"
  echo "12. 再次對齊遠端 main 並推送"
  echo "======================================"

  git fetch origin main

  if ! git merge-base --is-ancestor origin/main HEAD; then
    echo "遠端 main 有較新的提交，先執行安全 rebase。"
    git rebase origin/main
  fi

  git push origin HEAD:main

  echo
  echo "======================================"
  echo "13. 更新正式 Tag"
  echo "======================================"

  git tag -f "$TAG" HEAD
  git push origin -f "$TAG"

  rm -f "$TEMP_ZIP"

  echo
  echo "======================================"
  echo "✅ FOR-e 1-3ec 部署完成"
  echo "======================================"
  grep -n "const APP_VERSION" src/main.js | head -1
  echo "目前分支：$(git branch --show-current)"
  echo "目前 HEAD：$(git rev-parse --short HEAD)"
  echo "備份位置：$BACKUP"
)

RESULT=$?
set +u
set +e

echo
if [ "$RESULT" -eq 0 ]; then
  echo "✅ Terminal 部署程序完成。"
  echo "請到 Vercel → Deployments，確認 main 的 Production deployment 顯示 Ready。"
else
  echo "❌ 部署尚未完成，錯誤代碼：$RESULT"
  echo "Terminal 會保持開啟，請保留『❌ 部署失敗』及其上方錯誤內容。"
fi
