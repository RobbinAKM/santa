import axios from "axios";
import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import async from "async";

dotenv.config();

// Define interfaces for user data
interface UserEntry {
  message: string;
}

interface User {
  id: string;
  name: string;
  address: string;
  entries: UserEntry[];
}

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as string, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Create async queues
const emailQueue = async.queue(
  async (mailOptions: nodemailer.SendMailOptions, callback) => {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Message sent: %s`, info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      callback();
    } catch (error) {
      console.error("Error sending email:", error);
      callback();
    }
  },
  1
); // Limit concurrency to 1 for sequential processing

const updateQueue = async.queue(async (userId: string, callback) => {
  try {
    await axios.post("http://localhost:8080/api/markMessagesAsSent", {
      id: userId,
    });
    console.log(`Messages marked as sent for user ${userId}.`);
    callback();
  } catch (error) {
    console.error("Error updating user data:", error);
    callback();
  }
}, 1); // Limit concurrency to 1 for sequential processing

// Cron job schedule (default to every 15 seconds)
const cronSchedule: string = process.env.CRON_SCHEDULE || "*/15 * * * * *";

// Function to fetch user data and add jobs to queues
const fetchDataAndSendEmail = async (): Promise<void> => {
  try {
    const { data: userDataStore }: { data: User[] } = await axios.get(
      "http://localhost:8080/api/getAllMessages"
    );

    if (userDataStore.length > 0) {
      userDataStore.forEach((user) => {
        const mailOptions: nodemailer.SendMailOptions = {
          from: '"North Pole" <do_not_reply@northpole.com>',
          to: "santa@northpole.com",
          subject: `Pending Requests for ${user.name}`,
          text: `
          Child username: ${user.name}
          Child's address: ${user.address}
          Messages:
          ${user.entries.map((entry) => entry.message).join("\n")}
        `,
        };

        emailQueue.push(mailOptions);
        updateQueue.push(user.id);
      });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Schedule the cron job
cron.schedule(cronSchedule, fetchDataAndSendEmail);

export default transporter;
