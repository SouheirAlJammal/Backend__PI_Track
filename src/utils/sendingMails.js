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

const sendingContactMail = async (formData) => {
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

const sendInvitationEmail = async (recipientEmail, invitationLink) => {
    try {
        const mailOptions = {
            from: {
                name: 'PI-Track',
                address: process.env.EMAIL,
            },
            to: recipientEmail,
            subject: 'You have received an invitation',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 800px;
                        margin: 30px;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: rgb(7,28,53);
                    }
                    p {
                        font-size: 16px;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    a {
                        text-decoration: none;
                        color: #fff;
                    }
                    button {
                        background-color: rgb(7,28,53);
                        color: #fff;
                        padding: 12px 24px;
                        border: none;
                        border-radius: 5px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                        cursor:pointer
                    }
                    button:hover {
                        background-color: rgb(7,28,53);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Invitation to PI-Track</h1>
                    <p>You've received an invitation to join a plan on PI-Track.</p>
                    <a href="${invitationLink}" target="_blank">
                        <button>Accept Invitation</button>
                    </a>
                    <p>If you have trouble with the button, copy and paste the following link into your browser:</p>
                    <p>${invitationLink}</p>
                </div>
            </body>
            </html>
            
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending Invitation:', error);
            } else {
                console.log('Invitation sent successfully:', info.response);
            }
        });
    } catch (error) {
        console.error('Error sending invitation email:', error);
    }
};

export { sendingContactMail,sendInvitationEmail };