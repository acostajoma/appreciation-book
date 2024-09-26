/**
 * Constants that are only accessed on the server should be placed here
 */
import { dev } from '$app/environment';

export const verificationCodeEmailTemplate = (email: string, verificationCode: string) => ({
	from: {
		email: 'jose@macosta.dev',
		name: 'Buscamos Casa',
	},
	subject: 'Verificación de correo electrónico',
	personalizations: [
		{
			to: [{ email: email.toLowerCase() }],
			dynamic_template_data: {
				code: verificationCode,
			},
		},
	],
	template_id: 'd-25ab28faf5e341b7b4ceffd8801638f6',
	mail_settings: {
		/**
		 * SandBox mode enabled to dev will make that the emails are not sent and not hit the api limit
		 * If emails need to be sent from dev, set enable to false
		 */
		sandbox_mode: {
			enable: dev,
		},
	},
});

export const resetPasswordEmailTemplate = (email: string, temporalPassword: string) => ({
	from: {
		email: 'jose@macosta.dev',
		name: 'Buscamos Casa',
	},
	subject: 'Tu contraseña temporal',
	personalizations: [
		{
			to: [{ email: email.toLowerCase() }],
			dynamic_template_data: {
				temporalPassword,
			},
		},
	],
	template_id: 'd-c50a59481f1446d58a6ef98438d278af ',
	mail_settings: {
		/**
		 * SandBox mode enabled to dev will make that the emails are not sent and not hit the api limit
		 * If emails need to be sent from dev, set enable to false
		 */
		sandbox_mode: {
			enable: dev,
		},
	},
});

export const emailResetCookieName = 'passwordResetFlowEmail';
