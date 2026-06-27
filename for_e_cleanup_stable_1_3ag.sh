#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/workspaces/For-ecalendar-v2"
DATE="$(date +%Y%m%d)"
TIME="$(date +%H%M%S)"

LATEST_ZIP="for-e-v002-1h-stable-1-3ag-maintenance-notify-real-label-structure.zip"
STABLE_NAME="V002-1H-stable-clean-1-3ag"

BACKUP_ROOT="$PROJECT_DIR/../FOR-e-backups-$DATE"
QUARANTINE="$PROJECT_DIR/../FOR-e-cleanup-quarantine-$DATE-$TIME"

BEFORE_ZIP="$BACKUP_ROOT/FOR-e-before-cleanup-$DATE-$TIME.zip"
STABLE_ZIP="$BACKUP_ROOT/FOR-e-stable-clean-backup-$DATE-$STABLE_NAME.zip"

cd "$PROJECT_DIR"

echo "======================================"
echo "FOR-e 清理前檢查"
echo "======================================"
echo "專案位置：$(pwd)"
echo ""
echo "目前 Git commit："
git log -1 --oneline || true
echo ""
echo "目前 Git 狀態："
git status --short
echo ""

echo "最新保留更新檔：$LATEST_ZIP"
if [ -f "$LATEST_ZIP" ]; then
  echo "✅ 找到最新更新檔，會保留。"
else
  echo "⚠️ 找不到最新更新檔：$LATEST_ZIP"
  echo "   仍會繼續清理，因為目前最新功能應已整合在 src/main.js 與 src/style.css。"
fi

echo ""
read -r -p "確認目前已套用最新 V002-1H-stable-1-3ag，輸入 YES 才繼續：" OK
if [ "$OK" != "YES" ]; then
  echo "已取消。"
  exit 1
fi

mkdir -p "$BACKUP_ROOT"
mkdir -p "$QUARANTINE"

echo ""
echo "======================================"
echo "建立清理前完整備份"
echo "======================================"

backup_items=()

for f in index.html package.json package-lock.json vite.config.js .env.example .env.local .gitignore README.md vercel.json; do
  [ -e "$f" ] && backup_items+=("$f")
done

for d in src public supabase docs; do
  [ -d "$d" ] && backup_items+=("$d")
done

if [ "${#backup_items[@]}" -eq 0 ]; then
  echo "❌ 找不到核心檔案，停止清理。"
  exit 1
fi

zip -qr "$BEFORE_ZIP" "${backup_items[@]}" \
  -x "node_modules/*" \
  -x "dist/*" \
  -x ".git/*" \
  -x "backup-before-*/*" \
  -x "for-e-v002-*.zip" \
  -x ".tmp-*/*" \
  -x "*.log"

echo "✅ 清理前備份完成：$BEFORE_ZIP"

echo ""
echo "======================================"
echo "補強 .gitignore"
echo "======================================"

touch .gitignore

if ! grep -q "# FOR-e cleanup ignores" .gitignore; then
cat >> .gitignore <<'GITIGNORE'

# FOR-e cleanup ignores
backup-before-*/
backup-download/
FOR-e-before-cleanup-*.zip
FOR-e-stable-clean-backup-*.zip
for-e-v002-*.zip
.tmp-for-e-update/
.tmp-v002-*/
cleanup-candidates.txt
for_e_cleanup_stable_*.sh
cleanup_for_e_stable_clean_*.sh
*.patch
*.diff
*.rej
*.orig
*.bak
*.tmp
*.log
dist/
node_modules/
GITIGNORE
fi

echo "✅ .gitignore 已確認。"

echo ""
echo "======================================"
echo "產生疑似舊檔清單"
echo "======================================"

REPORT="$BACKUP_ROOT/cleanup-candidates-$DATE-$TIME.txt"

{
  echo "FOR-e cleanup candidates $DATE $TIME"
  echo ""
  echo "Root patch / backup / temp files:"
  find . -maxdepth 1 \( \
    -name "for-e-v002-*.zip" -o \
    -name "backup-before-*" -o \
    -name ".tmp-for-e-update" -o \
    -name ".tmp-v002-*" -o \
    -name "cleanup-candidates.txt" -o \
    -name "cleanup_for_e_stable_clean_*.sh" -o \
    -name "for_e_cleanup_stable_*.sh" -o \
    -name "*.patch" -o \
    -name "*.diff" -o \
    -name "*.rej" -o \
    -name "*.orig" -o \
    -name "*.bak" -o \
    -name "*.tmp" \
  \) -print | sort

  echo ""
  echo "Empty files outside core build folders:"
  find . \
    -path "./.git" -prune -o \
    -path "./node_modules" -prune -o \
    -path "./dist" -prune -o \
    -type f -empty -print | sort
} > "$REPORT"

echo "✅ 疑似舊檔清單：$REPORT"

echo ""
echo "======================================"
echo "開始安全清理：只移除根目錄舊補丁 / 暫存 / 無效備份"
echo "======================================"

move_to_quarantine() {
  local item="$1"

  [ -e "$item" ] || return 0

  case "$item" in
    ./src|./public|./supabase|./docs|./node_modules|./dist|./.git|./.vercel)
      echo "保留核心 / 環境資料夾：$item"
      ;;
    ./index.html|./package.json|./package-lock.json|./vite.config.js|./.env.example|./.env.local|./.gitignore|./README.md|./vercel.json)
      echo "保留部署必要檔：$item"
      ;;
    ./"$LATEST_ZIP")
      echo "保留最新更新檔：$item"
      ;;
    *)
      echo "移到隔離區：$item"
      mv "$item" "$QUARANTINE/"
      ;;
  esac
}

shopt -s nullglob dotglob

for item in ./for-e-v002-*.zip; do move_to_quarantine "$item"; done
for item in ./backup-before-*; do move_to_quarantine "$item"; done
for item in ./.tmp-for-e-update ./cleanup-candidates.txt; do move_to_quarantine "$item"; done
for item in ./.tmp-v002-*; do move_to_quarantine "$item"; done
for item in ./cleanup_for_e_stable_clean_*.sh; do move_to_quarantine "$item"; done
for item in ./for_e_cleanup_stable_*.sh; do
  if [ "$item" != "./for_e_cleanup_stable_1_3ag.sh" ]; then
    move_to_quarantine "$item"
  fi
done
for item in ./*.patch ./*.diff ./*.rej ./*.orig ./*.bak ./*.tmp; do move_to_quarantine "$item"; done

shopt -u dotglob

echo ""
echo "✅ 隔離區：$QUARANTINE"

echo ""
echo "======================================"
echo "移除 Git 追蹤中的 build / 依賴 / 舊補丁"
echo "======================================"

git rm -r --cached node_modules 2>/dev/null || true
git rm -r --cached dist 2>/dev/null || true
git rm -r --cached backup-before-* 2>/dev/null || true

# 只從 Git 追蹤移除舊 zip；最新 zip 若存在也不建議進 Git，所以也會被 .gitignore 保護
git rm --cached for-e-v002-*.zip 2>/dev/null || true

echo ""
echo "======================================"
echo "npm 與 build 測試"
echo "======================================"

npm config set registry https://registry.npmjs.org/
npm install --no-audit --no-fund --registry=https://registry.npmjs.org/

node --check src/main.js
npm run build

echo ""
echo "======================================"
echo "建立清理後乾淨穩固備份"
echo "======================================"

stable_items=()

for f in index.html package.json package-lock.json vite.config.js .env.example .env.local .gitignore README.md vercel.json; do
  [ -e "$f" ] && stable_items+=("$f")
done

for d in src public supabase docs; do
  [ -d "$d" ] && stable_items+=("$d")
done

zip -qr "$STABLE_ZIP" "${stable_items[@]}" \
  -x "node_modules/*" \
  -x "dist/*" \
  -x ".git/*" \
  -x "backup-before-*/*" \
  -x "for-e-v002-*.zip" \
  -x ".tmp-*/*" \
  -x "*.log"

echo "✅ 清理後穩固備份完成：$STABLE_ZIP"

echo ""
echo "======================================"
echo "建立 Git commit 與 tag"
echo "======================================"

git add -A

if git diff --cached --quiet; then
  echo "沒有需要 commit 的清理變更。"
else
  git commit -m "FOR-e stable cleanup and backup"
fi

if git rev-parse "$STABLE_NAME" >/dev/null 2>&1; then
  echo "Git tag $STABLE_NAME 已存在，略過建立。"
else
  git tag -a "$STABLE_NAME" -m "FOR-e stable cleanup based on V002-1H-stable-1-3ag"
fi

echo ""
echo "======================================"
echo "清理完成"
echo "======================================"
echo "清理前備份：$BEFORE_ZIP"
echo "清理後穩固備份：$STABLE_ZIP"
echo "隔離區：$QUARANTINE"
echo "疑似舊檔清單：$REPORT"
echo ""
echo "請確認沒問題後執行："
echo "git push"
echo "git push origin $STABLE_NAME"
