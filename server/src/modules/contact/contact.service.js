import { createTransporter } from '../../config/nodemailer.js';
import { ContactMessage } from './contact.model.js';
import { Settings } from '../settings/settings.model.js';
import { env } from '../../config/env.js';

const esc = (str) =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const inquiryEmailHtml = (data) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body{font-family:Arial,sans-serif;background:#0A0A0A;color:#F0EDE6;margin:0;padding:20px}
  .container{max-width:600px;margin:0 auto;background:#111;border:1px solid #222;border-radius:8px;padding:30px}
  h2{color:#FF6B1A;margin-top:0}
  .field{margin:12px 0;padding:10px;background:#1a1a1a;border-radius:4px;border-left:3px solid #FF6B1A}
  .label{color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px}
  .value{color:#F0EDE6;margin-top:4px;font-size:15px}
</style></head>
<body>
  <div class="container">
    <h2>New ${data.type === 'project' ? 'Project Inquiry' : 'Message'}</h2>
    <div class="field"><div class="label">From</div><div class="value">${esc(data.name)} &lt;${esc(data.email)}&gt;</div></div>
    ${data.subject ? `<div class="field"><div class="label">Subject</div><div class="value">${esc(data.subject)}</div></div>` : ''}
    <div class="field"><div class="label">Message</div><div class="value">${esc(data.message).replace(/\n/g, '<br>')}</div></div>
    ${data.type === 'project' ? `
    <div class="field"><div class="label">Project Type</div><div class="value">${esc(data.projectType) || '—'}</div></div>
    <div class="field"><div class="label">Budget</div><div class="value">${esc(data.budget) || '—'}</div></div>
    <div class="field"><div class="label">Deadline</div><div class="value">${esc(data.deadline) || '—'}</div></div>
    ${data.referenceLinks ? `<div class="field"><div class="label">References</div><div class="value">${esc(data.referenceLinks)}</div></div>` : ''}
    ` : ''}
  </div>
</body>
</html>`;

const autoReplyHtml = (name, autoReplyBody, artistName) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body{font-family:Arial,sans-serif;background:#0A0A0A;color:#F0EDE6;margin:0;padding:20px}
  .container{max-width:600px;margin:0 auto;background:#111;border:1px solid #222;border-radius:8px;padding:30px}
  h1{color:#FF6B1A;font-size:24px;margin-top:0}
  p{line-height:1.7;color:#ccc}
  .sig{margin-top:30px;padding-top:20px;border-top:1px solid #333;color:#888}
</style></head>
<body>
  <div class="container">
    <h1>${esc(artistName)}</h1>
    <p>Hi ${esc(name)},</p>
    <p>${esc(autoReplyBody)}</p>
    <div class="sig">— ${esc(artistName)}</div>
  </div>
</body>
</html>`;

export const submitContact = async (data) => {
  const msg = await ContactMessage.create(data);

  const settings = await Settings.findOne();
  const recipientEmail = settings?.contactEmail || env.SMTP_USER;
  const autoReplyBody = settings?.autoReplyBody || 'Thank you for reaching out! I will be in touch soon.';
  const artistName = settings?.seoTitle?.split('—')[0]?.trim() || 'The Artist';

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Portfolio Site" <${env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `[New ${data.type === 'project' ? 'Project Inquiry' : 'Message'}] ${data.subject || data.name}`,
      html: inquiryEmailHtml(data),
    });

    await transporter.sendMail({
      from: `"${artistName}" <${env.SMTP_USER}>`,
      to: data.email,
      subject: `Got your message — ${artistName} will be in touch`,
      html: autoReplyHtml(data.name, autoReplyBody, artistName),
    });
  } catch {
    // Email failure shouldn't break the submission
  }

  return msg;
};

export const getMessages = async ({ read, type } = {}) => {
  const filter = {};
  if (read === 'true') filter.isRead = true;
  if (read === 'false') filter.isRead = false;
  if (type) filter.type = type;
  return ContactMessage.find(filter).sort({ createdAt: -1 });
};

export const markRead = (id) =>
  ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });

export const deleteMessage = (id) => ContactMessage.findByIdAndDelete(id);
