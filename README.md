# QR Code generator Telegram bot
[@quickQrcBot](https://t.me/quickQrcBot)
This is a Telegram bot that Generates a QR Code image based on the text you send it.

## Note on decoding QR Codes
Decoding images takes too long for the cloudflare worker and is not supported. But the code exists and is commented out.

## About
This bot runs on a [Cloudflare Worker](https://workers.cloudflare.com/).

## wrangler.toml sample 
You can use this config file to host this bot yourself.
```toml
name = ""                 # project name
main = "src/index.js"     # project entry point
compatibility_date = ""   # ex: 2022-11-11
node_compat = true        # needed for qr-image npm package

[vars]
TOKEN = ""  # telegram bot token
```
