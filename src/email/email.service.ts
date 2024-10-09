import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Injectable()
export class EmailService {
  private readonly transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false, // true for port 465, false for other ports
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }
  async sendEmail(email: string, captcha) {
    const info = await this.transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: '会议室预订系统验证码',
      text: '',
      html: `
            <b>${captcha}</b>
        `,
    });
  }
}
