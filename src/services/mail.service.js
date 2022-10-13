/* This project uses the nodemailer library to send email
   However, it is recommended to switch over to dedicated email services
   like Mailgun, AWS SES, etc.
   This file is taken from:
        + https://github.com/hoangvvo/nextjs-mongodb-app/blob/v2/api-lib/mail.js
        + https://viblo.asia/p/xay-dung-server-voi-chuc-nang-gui-mail-tao-html-email-responsive-thong-qua-mot-vai-framework-ho-tro-bWrZnrerZxw
*/

import nodemailer from 'nodemailer';
import { nodemailerConfig } from '../configs/index.js';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import juice from 'juice';
import { fileURLToPath } from 'url';

// config gmail service from 5/2022: https://stackoverflow.com/questions/72530276/nodemailergoogle-disabled-the-less-secure-app-option-on-google-accounts-i-woul

const transporter = nodemailer.createTransport(nodemailerConfig);

// fix "__dirname is not defined in ES module scope" ref: https://flaviocopes.com/fix-dirname-not-defined-es-module-scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendMail({ to, subject, templateVars }) {
    // template was created by: https://dashboard.unlayer.com/create/free-food
    const templatePath = path.join(__dirname, '..', 'views', 'index.html');

    const options = {
        from: nodemailerConfig.auth.email,
        to,
        subject,
    };

    if (fs.existsSync(templatePath)) {
        const template = fs.readFileSync(templatePath, 'utf-8');
        const html = ejs.render(template, templateVars);
        const htmlWithStylesInlined = juice(html);

        options.html = htmlWithStylesInlined;
    }

    try {
        await transporter.sendMail(options);
    } catch (e) {
        console.error(`Could not send email: ${e.message}`);
    }
}
