import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || "Bacversité <onboarding@resend.dev>";

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Réinitialise ton mot de passe Bacversité",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #059669;">Réinitialisation de mot de passe</h2>
        <p>Tu as demandé à réinitialiser ton mot de passe Bacversité. Clique sur le lien ci-dessous pour en choisir un nouveau :</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #059669; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p style="color: #6b7280; font-size: 13px;">Ce lien expire dans 1 heure. Si tu n'es pas à l'origine de cette demande, ignore simplement cet email.</p>
      </div>
    `,
  });
}
