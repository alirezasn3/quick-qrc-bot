import qr from 'qr-image'

export default {
  async fetch(request, env, ctx) {
    try {
      const { message } = await request.json()

      // handle invalid message
      if (!message || message.text === undefined) return new Response(null)

      // send is typing status
      fetch(`https://api.telegram.org/bot${env.TOKEN}/sendChatAction?action=upload_photo&chat_id=${message.from.id}`)

      // handle command
      if (message.text === '/start') {
        return new Response(
          JSON.stringify({
            method: 'sendMessage',
            chat_id: message.from.id,
            text: 'send me some text'
          }),
          { headers: { 'content-type': 'application/json' } }
        )
      }

      // handle message
      const image = qr.imageSync(message.text)
      const formData = new FormData()
      formData.append('method', 'sendPhoto')
      formData.append('chat_id', message.from.id)
      formData.append('photo', new Blob([image]))
      formData.append('reply_to_message_id', message.message_id)
      return new Response(formData)
    } catch (error) {
      console.log(error.message)
      return new Response(null)
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
