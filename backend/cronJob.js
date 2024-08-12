const axios = require("axios");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Cron job schedule (default to every 15 seconds)
const cronSchedule = process.env.CRON_SCHEDULE || "*/15 * * * * *";

// Function to fetch user data and send email
const fetchDataAndSendEmail = async () => {
  try {
    const { data: userDataStore } = await axios.get(
      "http://localhost:8080/api/getAllMessages"
    );

    if (userDataStore.length > 0) {
      const mailOptions = {
        from: '"North Pole" <do_not_reply@northpole.com>',
        to: "santa@northpole.com",
        subject: "Pending Requests",
        text: userDataStore
          .map(
            (user) => `
            Child username: ${user.name}
            Child's address: ${user.address}
            Messages:
            ${user.entries.map((entry) => entry.message).join("\n")}
          `
          )
          .join("\n\n"),
      };

      // Send email
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return;
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        // Mark messages as sent
        try {
          await Promise.all(
            userDataStore.map((user) =>
              axios.post("http://localhost:8080/api/markMessagesAsSent", {
                id: user.id,
              })
            )
          );
          console.log("Messages marked as sent.");
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Schedule the cron job
cron.schedule(cronSchedule, fetchDataAndSendEmail);

module.exports = transporter;
