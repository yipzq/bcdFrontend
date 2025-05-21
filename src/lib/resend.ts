// resend.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWithdrawalRejectedEmail(email: string, amount: any) {
  if (!email) return;

  const numericAmount = parseFloat(amount);
  const displayAmount = isNaN(numericAmount) ? 'unknown' : numericAmount.toFixed(2);

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Withdrawal Rejected',
      html: `
        <p>Hello,</p>
        <p>Your withdrawal request of <strong>$${displayAmount}</strong> has been <strong>rejected</strong> by the admin.</p>
        <p>If you have questions, please contact support.</p>
      `,
    });
  } catch (err) {
    console.error('Failed to send rejection email:', err);
  }
}


export async function sendWithdrawalApprovedEmail(
  email: string,
  amount: number
) {
  if (!email) return;

  const num = parseFloat(String(amount));
  const display = isNaN(num) ? 'unknown' : num.toFixed(2);

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',           
      to: email,
      subject: 'Withdrawal Approved ✔️',
      html: `
        <p>Hello,</p>
        <p>Your withdrawal request of <strong>$${display}</strong> has been 
        <span style="color:green"><b>approved</b></span> and is now being processed.</p>
        <p>Thank you for using our platform!</p>
      `,
    });
  } catch (e) {
    console.error('Resend approval-email error:', e);
  }
}