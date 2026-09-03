//by Bonzino

let handler = async (m) => {
  m.reply(
`*📂 𝐏𝐀𝐓𝐇*

\`\`\`
${process.cwd()}
\`\`\`

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
  )
}
handler.help = ['path']
handler.tags = ['owner']
handler.command = ['path']
handler.owner = true
export default handler