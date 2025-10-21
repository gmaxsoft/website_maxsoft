// src/pages/api/contact.ts

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: import.meta.env.SMTP_HOST,
    port: parseInt(import.meta.env.SMTP_PORT),
    secure: import.meta.env.SMTP_SECURE === 'false',
    auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
    },
});

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();

    const name = data.get('name');
    const email = data.get('email');
    const subject = data.get('subject');
    const message = data.get('message');
    if (!name || !email || !message) {
        return new Response(JSON.stringify({ message: "Brak wymaganych danych." }), {
            status: 400,
        });
    }
    try {
        await transporter.sendMail({
            from: `"Formularz Kontaktowy" <${email}>`, // Użyj e-maila klienta jako nadawcy w treści
            to: 'biuro@maxsoft.pl', // Twój adres firmowy
            subject: `[Maxsoft Formularz] ${subject || 'Brak tematu'}`,
            text: `Imię i Nazwisko: ${name}\nE-mail: ${email}\n\nTreść wiadomości:\n${message}`,
            html: `<p>Imię i Nazwisko: <strong>${name}</strong></p><p>E-mail: <strong>${email}</strong></p><p>Temat: <strong>${subject || 'Brak tematu'}</strong></p><p>Treść wiadomości:</p><p>${message}</p>`,
        });

        return new Response(JSON.stringify({ message: "Wiadomość została wysłana!" }), {
            status: 200,
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Wystąpił błąd podczas wysyłania e-maila." }), {
            status: 500,
        });
    }
};