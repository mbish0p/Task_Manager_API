const sgMails = require('@sendgrid/mail')

const sgApiKey = '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'
sgMails.setApiKey(sgApiKey)

const msg = {
    to: 'biskup.mateusz1997@gmail.com',
    from: 'biskup.mateusz1997@wp.pl',
    subject: 'Sending mails from SendGrig',
    text: 'I hope you get this mail'
}

sgMails.send({
    to: 'biskup.mateusz1997@gmail.com',
    from: 'biskup.mateusz1997@wp.pl',
    subject: 'Sending mails from SendGrig',
    text: 'I hope you get this mail'
})


console.log(msg)