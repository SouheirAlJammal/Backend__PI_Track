import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSW,
    },
});

const sendingMail = async (form) => {
    try {
    
        const mailOptions = {
            from: {
                name: 'PI-Track',
                address: process.env.EMAIL,
            },
            subject: 'New Inquiry from Your Website',
            text: `
              Hello,\n\n
              You have a new inquiry from your website.\n\n
              Name: ${formData.name}\n
              Email: ${formData.email}\n
              Message: ${formData.message}\n
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        });
    } catch (error) {
        console.error('Error fetching order information:', error);
    }
};


export { sendingMail };