const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transport = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "alexandergubapost@gmail.com",
    pass: "nbyg csyh qzeo bodj",
  },
});

const sendEmail = (name, link) => {
  const templatePath = path.resolve(__dirname, "../views/email.ejs");

  ejs.renderFile(templatePath, { name, link }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      var mailOptions = {
        from: "alexandergubapost@gmail.com",
        to: "olexandr.huba@gmail.com",
        subject: "Password recover",
        html: data,
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log("Message sent: %s", info.messageId);
      });
    }
  });
};

module.exports = {
  sendEmail,
};
