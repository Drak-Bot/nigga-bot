export async function before(m, { isAdmin, groupMetadata, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1

  let delet = m.key.participant || m.sender
  let bang = m.key.id

  const isPaymentRequest = Boolean(
    m.message?.requestPaymentMessage || 
    m.msg?.requestPaymentMessage ||
    m.mtype === 'requestPaymentMessage' ||
    m.mtype?.toLowerCase().includes('payment')
  )

  if (isPaymentRequest) {
    if (!isBotAdmin) return !0 
    if (isAdmin) return !0

    try {
      await Promise.all([
        this.sendMessage(m.chat, { 
          delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } 
        }),
        this.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      ])
    } catch (e) {
      console.error(e)
    }
  }

  return !0
}
