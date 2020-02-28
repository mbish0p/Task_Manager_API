const sgMails = require('@sendgrid/mail')

sgMails.setApiKey(process.env.SENDGRID_API_KEY)

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