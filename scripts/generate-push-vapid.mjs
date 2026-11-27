import { webcrypto } from 'node:crypto'
import { existsSync, writeFileSync, chmodSync } from 'node:fs'

const outputPath = '.env.push'
if (existsSync(outputPath) && !process.argv.includes('--force')) {
  console.error('.env.push 已存在。為避免覆蓋目前正式 VAPID 金鑰，已停止。若確定要輪替，先備份舊金鑰再加 --force。')
  process.exit(1)
}

const keyPair = await webcrypto.subtle.generateKey(
  { name: 'ECDSA', namedCurve: 'P-256' },
  true,
  ['sign', 'verify']
)

const exportedKeys = {
  publicKey: await webcrypto.subtle.exportKey('jwk', keyPair.publicKey),
  privateKey: await webcrypto.subtle.exportKey('jwk', keyPair.privateKey)
}

const contact = 'https://github.com/jillzoe0301-gif/For-ecalendar-v2'
const envText = [
  'VAPID_KEYS_JSON=' + JSON.stringify(JSON.stringify(exportedKeys)),
  'VAPID_CONTACT=' + contact,
  ''
].join('\n')

writeFileSync(outputPath, envText, { encoding: 'utf8', mode: 0o600 })
chmodSync(outputPath, 0o600)

console.log('已產生 .env.push（權限 600）。')
console.log('請勿上傳、貼到聊天或提交 Git。')
console.log('下一步：supabase secrets set --project-ref mpieaxgmbihmvgofluwz --env-file .env.push')
