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
                <p>Hello!</p>
                <p>You have received an invitation to join a plan on PI-Track.</p>
                <p>Click the button below to accept the invitation:</p>
                <a href="${invitationLink}" target="_blank">
                    <button style="background-color: rgb(7,28,53); color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                        Accept Invitation
                    </button>
                </a>
                <p>If you are having trouble clicking the button, you can copy and paste the following link into your browser:</p>
                <p>${invitationLink}</p>
                <p>Thank you!</p>
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