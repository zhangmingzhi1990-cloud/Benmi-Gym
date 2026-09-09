import { useState } from 'react'

interface Props {
  getSyncCode: () => string
  applySyncCode: (code: string) => { ok: boolean; message: string }
  getExportJson: () => string
  importJson: (text: string) => { ok: boolean; message: string }
  selfName: string
  partnerName: string
  onSwap: () => void
  onUpdateNames: (self: string, partner: string) => void
}

export function SyncPanel({
  getSyncCode,
  applySyncCode,
  getExportJson,
  importJson,
  selfName,
  partnerName,
  onSwap,
  onUpdateNames,
}: Props) {
  const [code, setCode] = useState('')
  const [applyInput, setApplyInput] = useState('')
  const [msg, setMsg] = useState('')
  const [jsonBox, setJsonBox] = useState('')
  const [selfEdit, setSelfEdit] = useState(selfName)
  const [partnerEdit, setPartnerEdit] = useState(partnerName)

  const gen = async () => {
    const c = getSyncCode()
    setCode(c)
    try {
      await navigator.clipboard.writeText(c)
      setMsg('同步码已生成并复制到剪贴板')
    } catch {
      setMsg('同步码已生成，请手动复制')
    }
  }

  const apply = () => {
    const r = applySyncCode(applyInput)
    setMsg(r.message)
    if (r.ok) setApplyInput('')
  }

  const doExport = async () => {
    const j = getExportJson()
    setJsonBox(j)
    try {
      await navigator.clipboard.writeText(j)
      setMsg('JSON 已复制')
    } catch {
      setMsg('JSON 已显示，请手动复制')
    }
  }

  const doImport = () => {
    const r = importJson(jsonBox)
    setMsg(r.message)
  }

  return (
    <div className="space-y-4 px-3 pb-8">
      <section className="rounded-3xl bg-white/90 p-4 shadow-md shadow-violet-100">
        <h2 className="text-sm font-semibold text-violet-800">个人资料</h2>
        <div className="mt-3 space-y-2">
          <input
            className="w-full rounded-xl border border-violet-200 bg-lavender-50 px-3 py-2 text-sm"
            value={selfEdit}
            onChange={(e) => setSelfEdit(e.target.value)}
            placeholder="我的名字"
          />
          <input
            className="w-full rounded-xl border border-violet-200 bg-lavender-50 px-3 py-2 text-sm"
            value={partnerEdit}
            onChange={(e) => setPartnerEdit(e.target.value)}
            placeholder="搭档名字"
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-xl bg-violet-100 py-2 text-xs font-medium text-violet-700"
              onClick={() => onUpdateNames(selfEdit.trim() || selfName, partnerEdit.trim() || partnerName)}
            >
              保存昵称
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl bg-pink-100 py-2 text-xs font-medium text-pink-700"
              onClick={onSwap}
            >
              切换我/搭档身份
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white/90 p-4 shadow-md shadow-violet-100">
        <h2 className="text-sm font-semibold text-violet-800">情侣同步码</h2>
        <p className="mt-1 text-xs leading-relaxed text-violet-500">
          无后端时：一方生成同步码发给对方，对方粘贴「应用同步码」。勾选会按并集合并。
          也可用 URL 哈希（地址栏 #sync=…）分享。完整云同步需后续接入 Supabase。
        </p>
        <button
          type="button"
          onClick={gen}
          className="mt-3 w-full rounded-2xl bg-gradient-to-r from-violet-400 to-pink-300 py-3 text-sm font-semibold text-white"
        >
          生成并复制同步码
        </button>
        {code && (
          <textarea
            readOnly
            className="mt-2 h-24 w-full rounded-xl border border-violet-100 bg-lavender-50 p-2 font-mono text-[10px] text-violet-700"
            value={code}
          />
        )}
        <label className="mt-3 mb-1 block text-xs text-violet-500">应用同步码</label>
        <textarea
          className="h-20 w-full rounded-xl border border-violet-200 bg-white p-2 font-mono text-[10px]"
          placeholder="粘贴对方的 BENMI1:… 同步码"
          value={applyInput}
          onChange={(e) => setApplyInput(e.target.value)}
        />
        <button
          type="button"
          onClick={apply}
          className="mt-2 w-full rounded-2xl border border-violet-300 py-2.5 text-sm font-medium text-violet-700"
        >
          应用同步码
        </button>
      </section>

      <section className="rounded-3xl bg-white/90 p-4 shadow-md shadow-violet-100">
        <h2 className="text-sm font-semibold text-violet-800">JSON 导出 / 导入</h2>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={doExport}
            className="flex-1 rounded-xl bg-teal-soft-bg py-2 text-xs font-medium text-teal-800"
          >
            导出 JSON
          </button>
          <button
            type="button"
            onClick={doImport}
            className="flex-1 rounded-xl bg-lavender-100 py-2 text-xs font-medium text-violet-700"
          >
            导入合并
          </button>
        </div>
        <textarea
          className="mt-2 h-28 w-full rounded-xl border border-violet-100 bg-lavender-50 p-2 font-mono text-[10px]"
          value={jsonBox}
          onChange={(e) => setJsonBox(e.target.value)}
          placeholder="导出内容会显示在这里，也可粘贴 JSON 后导入"
        />
      </section>

      {msg && (
        <p className="rounded-xl bg-violet-100 px-3 py-2 text-center text-xs text-violet-700">{msg}</p>
      )}

      <p className="px-1 text-[11px] leading-relaxed text-violet-400">
        说明：当前使用同一浏览器的 localStorage 键 <code>benmi-couple-state</code>。
        两部手机请用同步码或 JSON 互相同步。云端实时同步需要之后接入 Supabase。
      </p>
    </div>
  )
}
