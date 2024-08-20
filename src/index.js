import qr from 'qr-image'

export default {
  async fetch(request, env) {
    let responded = false
    try {
      const { message } = await request.json()

      // handle invalid message
      if (!message) {
        responded = true
        return new Response(null)
      }

      if (message.document) {
        const res = await fetch(`https://api.telegram.org/bot${env.TOKEN}/getFile?file_id=${message.document.file_id}`)
        const { ok, result } = await res.json()
        const fileRes = await fetch(`https://api.telegram.org/file/bot${env.TOKEN}/${result.file_path}`)
        var text = await fileRes.text()
      } else if (message?.text?.length) {
        if (message.text === '/start') {
          responded = true
          return new Response(
            JSON.stringify({
              method: 'sendMessage',
              chat_id: message.from.id,
              text: 'Please send me some text or a text file to generate a QR code image.'
            }),
            { headers: { 'content-type': 'application/json' } }
          )
        }

        var text = message.text
      } else {
        responded = true
        return new Response(
          JSON.stringify({
            method: 'sendMessage',
            chat_id: message.from.id,
            text: 'Please send me some text or a text file to generate a QR code image.'
          }),
          { headers: { 'content-type': 'application/json' } }
        )
      }

      // send is typing status
      fetch(`https://api.telegram.org/bot${env.TOKEN}/sendChatAction?action=upload_photo&chat_id=${message.from.id}`)

      // handle message (generate qrcode image)
      const image = qr.imageSync(text)
      const formData = new FormData()
      formData.append('method', 'sendPhoto')
      formData.append('chat_id', message.from.id)
      formData.append('photo', new Blob([image]))
      formData.append('reply_to_message_id', message.message_id)
      responded = true
      return new Response(formData)
    } catch (error) {
      console.log(error.message)
      responded = true
      return new Response(null)
    } finally {
      if (!responded) return new Response(null)
    }
  }
}

// import jsqr from 'jsqr'
// import jpegJs from 'jpeg-js'
//   if (m.message?.photo) {
//     const photo = m.message.photo[m.message.photo.length - 1]
//     const res = await fetch(
//       `https://api.telegram.org/bot${env.TOKEN}/getFile?file_id=${photo.file_id}`
//     )
//     const { result } = await res.json()
//     const imgRes = await fetch(
//       `https://api.telegram.org/file/bot${env.TOKEN}/${result.file_path}`
//     )
//     const arrayBuffer = await imgRes.arrayBuffer()
//     const imgData = jpegJs.decode(arrayBuffer)
//     const { data } = jsqr(imgData.data, imgData.width, imgData.height)
//     return new Response(
//       JSON.stringify({
//         method: 'sendMessage',
//         chat_id: m.message.from.id,
//         reply_to_message_id: m.message.message_id,
//         text: data
//       }),
//       { headers: { 'content-type': 'application/json' } }
//     )
//   }
