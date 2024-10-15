import type { PrismaClient } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import type { Lucia, Session, User } from 'lucia';

declare global {
	namespace App {
		interface Error {
			message: string;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface PageState {}
		interface Locals {
			session: Session | null;
			user: User | null;
			authenticatedUser: boolean;
			lucia: Lucia;
			db: D1Database;
			prismaClient: PrismaClient<
				{
					adapter: PrismaD1;
				},
				never,
				DefaultArgs
			>;
		}
		interface Platform {
			env: {
				DB: D1Database;
				// USERDATA_KV: KVNamespace;
				BOOKS_KV_DEV: KVNamespace;
			};
			cf: CfProperties;
			ctx: ExecutionContext;
			caches: (CacheStorage & { default: Cache }) | CacheStorage_2;
		}

		namespace Superforms {
			type Message = { message: string; success: boolean };
		}
	}
	namespace Database {
		interface User {
			id: string;
			email: string;
			passwordHash: string;
			emailVerified: boolean;
		}
		interface VerificationCode {
			id: number;
			userId: string;
			email: string;
			code: string;
			expiresAt: number; // ISO DATE
		}

		interface VerificationAttempt {
			id?: number;
			userId: string;
			attemptTime: Date;
			type: 'verification_code' | 'password_reset';
			ipAddress: string;
		}
		interface PasswordResetToken {
			tokenHash: string;
			userId: string;
			expiresAt: Date;
		}
	}

	namespace KeyValueData {
		interface UserPersonalData {
			id: string;
			name: string;
			lastName: string;
			phone: string;
			countryCode: number;
		}
	}

	namespace SendGrid {
		interface EmailAddress {
			email: string;
			name?: string;
		}
		interface EmailHeaders {
			Authorization: string;
			ContentEncoding?: 'gzip';
		}

		interface EmailSubstitutions {
			[key: string]: string;
		}

		interface EmailCustomArgs {
			[key: string]: string;
		}
		interface Attachment {
			content: string;
			type?: string;
			filename: string;
			disposition?: 'inline' | 'attachment';
			content_id?: string;
		}
		interface DynamicTemplateData {
			[key: string]: string | Array | object;
		}
		interface EmailContent {
			type: 'text/plain' | 'text/html';
			value: string;
		}

		interface EmailPersonalization {
			to: EmailAddress[];
			cc?: EmailAddress[];
			bcc?: EmailAddress[];
			send_at?: number;
			from?: EmailAddress;
			subject?: string;
			headers?: EmailHeaders;
			substitutions?: EmailSubstitutions;
			custom_args?: EmailCustomArgs;
			send_at?: number;
			dynamic_template_data?: DynamicTemplateData;
		}

		interface BypassListManagement {
			enable?: boolean;
		}

		interface BypassSpamManagement {
			enable?: boolean;
		}

		interface BypassBounceManagement {
			enable?: boolean;
		}

		interface BypassUnsubscribeManagement {
			enable?: boolean;
		}

		interface Footer {
			enable?: boolean;
			text?: string;
			html?: string;
		}

		interface SandboxMode {
			enable?: boolean;
		}

		interface ClickTracking {
			enable?: boolean;
			enable_text?: boolean;
		}

		interface OpenTracking {
			enable?: boolean;
			substitution_tag?: string;
		}

		interface SubscriptionTracking {
			enable?: boolean;
			text?: string;
			html?: string;
			substitution_tag?: string;
		}

		interface GAnalytics {
			enable?: boolean;
			utm_source?: string;
			utm_medium?: string;
			utm_term?: string;
			utm_content?: string;
			utm_campaign?: string;
		}

		interface TrackingSettings {
			click_tracking?: ClickTracking;
			open_tracking?: OpenTracking;
			subscription_tracking?: SubscriptionTracking;
			ganalytics?: GAnalytics;
		}

		interface MailSettings {
			bypass_list_management?: BypassListManagement;
			bypass_spam_management?: BypassSpamManagement;
			bypass_bounce_management?: BypassBounceManagement;
			bypass_unsubscribe_management?: BypassUnsubscribeManagement;
			footer?: Footer;
			sandbox_mode?: SandboxMode;
		}

		interface EmailData {
			personalizations: EmailPersonalization[];
			from: EmailAddress;
			subject: string;
			headers?: EmailHeaders;
			substitutions?: EmailSubstitutions;
			custom_args?: EmailCustomArgs;
			send_at?: number; // Date in unix timestamp
			reply_to?: EmailAddress;
			reply_to_list?: EmailAddress[];
			dynamic_template_data?: DynamicTemplateData;
			subject?: string;
			attachments?: Attachment[];
			template_id?: string;
			categories?: string[];
			batch_id?: string;
			ip_pool_name?: string;
			mail_settings?: MailSettings;
			tracking_settings?: TrackingSettings;
		}
	}
	namespace Utils {
		type Fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;
	}
}

export {};
