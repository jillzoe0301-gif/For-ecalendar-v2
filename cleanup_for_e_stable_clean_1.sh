#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/workspaces/For-ecalendar-v2"
DATE="$(date +%Y%m%d)"
TIME="$(date +%H%M%S)"
BACKUP_ROOT="$PROJECT_DIR/../FOR-e-backups-$DATE"
QUARANTINE="$PROJECT_DIR/../FOR-e-cleanup-quarantine-$DATE-$TIME"

BEFORE_ZIP="$BACKUP_ROOT/FOR-e-before-cleanup-$DATE-$TIME.zip"
STABLE_ZIP="$BACKUP_ROOT/FOR-e-stable-clean-backup-$DATE-V002-1H-stable-clean-1.zip"

cd "$PROJECT_DIR"

echo "======================================"
echo "FOR-e 清理前檢查"
echo "======================================"
echo "目前位置：$(pwd)"
echo "目前 Git 版本："
git log -1 --oneline || true
echo ""

echo "目前 Git 狀態："
git status --short
echo ""

read -r -p "請確認目前已是最新 V002-1H-stable-1-3r，輸入 YES 才繼續清理：" OK
if [ "$OK" != "YES" ]; then
  echo "已取消清理。"
  exit 1
fi

mkdir -p "$BACKUP_ROOT"
mkdir -p "$QUARANTINE"

echo ""
echo "======================================"
echo "建立清理前備份"
echo "======================================"

backup_items=()

for f in index.html package.json package-lock.json vite.config.js .env.example .env.local .gitignore README.md vercel.json; do
  [ -e "$f" ] && backup_items+=("$f")
done

for d in src public supabase docs; do
  [ -d "$d" ] && backup_items+=("$d")
done

if [ "${#backup_items[@]}" -eq 0 ]; then
  echo "找不到可備份的核心檔案，停止。"
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

echo "清理前備份完成：$BEFORE_ZIP"

echo ""
echo "======================================"
echo "補上 .gitignore 清理規則"
echo "======================================"

touch .gitignore

if ! grep -q "# FOR-e cleanup ignores" .gitignore; then
cat >> .gitignore <<'GITIGNORE'

# FOR-e cleanup ignores
backup-before-*/
FOR-e-before-cleanup-*.zip
FOR-e-stable-clean-backup-*.zip
for-e-v002-*.zip
.tmp-for-e-update/
.tmp-v002-*/
cleanup-candidates.txt
*.patch
*.diff
*.rej
*.orig
*.bak
*.tmp
dist/
node_modules/
GITIGNORE
fi

echo ".gitignore 已確認。"

echo ""
echo "======================================"
echo "清理 Git 追蹤中的無效檔案"
echo "======================================"

git rm -r --cached node_modules 2>/dev/null || true
git rm -r --cached dist 2>/dev/null || true
git rm -r --cached backup-before-* 2>/dev/null || true
git rm --cached for-e-v002-*.zip 2>/dev/null || true

git rm -r backup-before-* 2>/dev/null || true
git rm for-e-v002-*.zip 2>/dev/null || true

echo ""
echo "======================================"
echo "移動本機舊補丁 / 暫存 / 無效備份到隔離區"
echo "======================================"

shopt -s nullglob dotglob

move_if_exists() {
  local item="$1"
  if [ -e "$item" ]; then
    case "$item" in
      src|public|supabase|docs|node_modules|dist|.git|.vercel)
        echo "保留核心或環境資料夾：$item"
        ;;
      index.html|package.json|package-lock.json|vite.config.js|.env.example|.env.local|.gitignore|vercel.json)
        echo "保留部署必要檔：$item"
        ;;
      *)
        echo "移到隔離區：$item"
        mv "$item" "$QUARANTINE/"
        ;;
    esac
  fi
}

for item in backup-before-*; do move_if_exists "$item"; done
for item in for-e-v002-*.zip; do move_if_exists "$item"; done
for item in FOR-e-before-cleanup-*.zip; do move_if_exists "$item"; done
for item in FOR-e-stable-clean-backup-*.zip; do move_if_exists "$item"; done
for item in .tmp-for-e-update .tmp-v002-* cleanup-candidates.txt; do move_if_exists "$item"; done
for item in *.patch *.diff *.rej *.orig *.bak *.tmp; do move_if_exists "$item"; done

shopt -u dotglob

echo ""
echo "隔離區位置：$QUARANTINE"

echo ""
echo "======================================"
echo "檢查空檔案"
echo "======================================"

EMPTY_REPORT="$BACKUP_ROOT/empty-files-report-$DATE-$TIME.txt"
find . \
  -path "./.git" -prune -o \
  -path "./node_modules" -prune -o \
  -path "./dist" -prune -o \
  -type f -empty -print > "$EMPTY_REPORT"

if [ -s "$EMPTY_REPORT" ]; then
  echo "發現空檔案，已列入報告，不自動刪除核心資料夾內空檔："
  cat "$EMPTY_REPORT"
else
  echo "未發現空檔案。"
fi

echo ""
echo "======================================"
echo "確認 npm registry 與安裝依賴"
echo "======================================"

npm config set registry https://registry.npmjs.org/
npm install --no-audit --no-fund --registry=https://registry.npmjs.org/

echo ""
echo "======================================"
echo "語法與 build 測試"
echo "======================================"

node --check src/main.js
npm run build

echo ""
echo "======================================"
echo "建立清理後穩定備份"
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

echo "清理後穩定備份完成：$STABLE_ZIP"

echo ""
echo "======================================"
echo "建立穩固版 Git 標記"
echo "======================================"

git add -A

if git diff --cached --quiet; then
  echo "沒有需要 commit 的清理變更。"
else
  git commit -m "V002-1H stable clean 1 cleanup unused patches and backups"
fi

if git rev-parse "V002-1H-stable-clean-1" >/dev/null 2>&1; then
  echo "Git tag V002-1H-stable-clean-1 已存在，略過建立。"
else
  git tag -a "V002-1H-stable-clean-1" -m "FOR-e 第一次清理穩固版"
fi

echo ""
echo "======================================"
echo "清理完成"
echo "======================================"
echo "清理前備份：$BEFORE_ZIP"
echo "清理後穩定備份：$STABLE_ZIP"
echo "隔離區：$QUARANTINE"
echo ""
echo "請確認系統沒問題後再推送："
echo "git push"
echo "git push origin V002-1H-stable-clean-1"
