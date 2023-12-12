import nodemailer from "nodemailer";

function sendEmail(to, subject, text) {
  return new Promise(async (resolve, reject) => {
    try {
      var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'ruka0430petri@gmail.com',
					pass: 'nnkkclzckscepylm',
				},
			});
			var mailOptions = {
				from: 'ruka0430petri@gmail.com',
				to: to,
				subject: 'Verify Code',
				html: '<html><p>Verification code is ' + text + ' </p></html>',
			};
			let info = await transporter.sendMail(mailOptions);
      resolve(info);
			

     
      // let transporter = nodemailer.createTransport({
      //   host: "smtp.gmail.com",
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     type: "OAuth2",
      //     user: process.env.GMAIL_ADDRESS,
      //     clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
      //     clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
      //     refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
      //     accessToken: process.env.GMAIL_OAUTH_ACCESS_TOKEN,
      //     expires: Number.parseInt(process.env.GMAIL_OAUTH_TOKEN_EXPIRE!, 10),
      //   },
      // });

      // let mailOptions = {
      //   from: process.env.EMAIL,
      //   to: to,
      //   subject: subject,
      //   text: text,
      // };

      // let info = await transporter.sendMail(mailOptions);
      // resolve(info);
    } catch (error) {
      reject(error);
    }
  });
}

export default sendEmail;
