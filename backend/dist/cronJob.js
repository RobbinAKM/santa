"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const async_1 = __importDefault(require("async"));
dotenv_1.default.config();
// Configure nodemailer transporter
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// Create async queues
const emailQueue = async_1.default.queue((mailOptions, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log(`Message sent: %s`, info.messageId);
        console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        callback();
    }
    catch (error) {
        console.error("Error sending email:", error);
        callback();
    }
}), 1); // Limit concurrency to 1 for sequential processing
const updateQueue = async_1.default.queue((userId, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield axios_1.default.post("http://localhost:8080/api/markMessagesAsSent", {
            id: userId,
        });
        console.log(`Messages marked as sent for user ${userId}.`);
        callback();
    }
    catch (error) {
        console.error("Error updating user data:", error);
        callback();
    }
}), 1); // Limit concurrency to 1 for sequential processing
// Cron job schedule (default to every 15 seconds)
const cronSchedule = process.env.CRON_SCHEDULE || "*/15 * * * * *";
// Function to fetch user data and add jobs to queues
const fetchDataAndSendEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data: userDataStore } = yield axios_1.default.get("http://localhost:8080/api/getAllMessages");
        if (userDataStore.length > 0) {
            userDataStore.forEach((user) => {
                const mailOptions = {
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
    }
    catch (error) {
        console.error("Error fetching user data:", error);
    }
});
// Schedule the cron job
node_cron_1.default.schedule(cronSchedule, fetchDataAndSendEmail);
exports.default = transporter;
