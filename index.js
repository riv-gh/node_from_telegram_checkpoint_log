const fs = require('fs')
const json_text = fs.readFileSync('it_chat.json', {encoding: 'utf-8'})
const json = JSON.parse(json_text)

const cp = json.messages.filter(message => message.text.indexOf(' on HYPER-V')!=-1)

const text = cp.map(i => {
    const server = i.text.split(' on ')[1]
    const type = i.text.indexOf('"Dialy"')!=-1 ? 'щотиждневу' : 'щоденну '
    return `
        <tr>
            <td>${i.date.replace('T', '&nbsp;&nbsp;')}</td>
            <td>${i.text}</td>
            <td>Створено ${type} резервну копію віртуальних машин на сервері ${server}</td>
        </tr>
`
}).join('')

const log_tpl = fs.readFileSync('log_tpl.html', {encoding: 'utf-8'})
const log_file = log_tpl.replace('{{replace}}',text)

fs.writeFileSync('html_log.html',log_file)
