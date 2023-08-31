import { Telegraf } from 'telegraf'
import {GoogleSpreadsheet} from 'google-spreadsheet'

const bot = new Telegraf("Telegram key")

const doc = new GoogleSpreadsheet("Your google spreadsheet id")
const Email = "Your business email address"
const privateKey = "Your private key";

start()

async function start(){
   await doc.useServiceAccountAuth({ client_email: Email, private_key: privateKey })
   await doc.loadInfo()
   const sheet = doc.sheetsByIndex[0]

   bot.start((ctx) => ctx.reply('Greetings'))
   bot.on('text', async (ctx) => {
      
      console.info(ctx.message.text)
      const r = /(?<name>\w+)\s+(?<surname>\w+)\s+(?<doc>.*)\s+(?<birthday>\d*\.\d*\.\d*)\s+(?<country>\w+)\s+(?<date>\d*\.\d*\.\d*\s+\d*\:\d*)?/.exec(ctx.message.text)

      if (r == null) {
         ctx.reply("Validation error")
      } else {
         await sheet.addRow({
            name: r?.groups?.name,
            surname: r?.groups?.surname,
            doc: r?.groups?.doc.toUpperCase(),
            birthday: r?.groups?.birthday,
            country: r?.groups?.country.toUpperCase(),
            date: r?.groups?.date + ' GMT +3',
         })
         ctx.reply("New item added successfully")
      }
     
   })
   bot.launch()
   console.log('launched')
   process.once('SIGINT', () => bot.stop('SIGINT'))
   process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
