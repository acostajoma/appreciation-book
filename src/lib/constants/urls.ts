export const passwordChangedUrl = '/password-changed';
export const validateUserUrl = '/confirm-user';
export const passwordResetEmailConfirmation = '/reset-password-email-sent';
export const loginUrl = '/login';
export const forgotPasswordUrl = '/forgot-password';
export const authFAQ = '/authentication-issues';
export const signupUrl = '/sign-up';
export const resetPasswordUrl = '/reset-password';
export const books = '/books'
export const googleSignInUrl = '/login/google'
export const googleCallbackUrl = '/login/google/callback';

/** Unprotected Routes that logged users should not see for a better experience */
export const unprotectedUrls = new Set([
	loginUrl,
	signupUrl,
	validateUserUrl,
	forgotPasswordUrl,
	passwordResetEmailConfirmation,
	resetPasswordUrl,
	googleCallbackUrl,
	googleSignInUrl,
]);
export const onlyWithActiveSessionUrls = new Set([validateUserUrl, passwordChangedUrl]);

export const onlyLoggedUrls = new Set([books])
/**
 * isForm is pretended to be used for forms that need to call to a server action. Like Logout.
 */
type Url = {
	href: string;
	text: string;
	useLogo?: boolean;
	isForm?: boolean;
};
/**
 * We only want to highlight two actions, one for logged users and one for not logged users
 * NOTE: That's why Only 2 keys are allowed and coded in the object, to prevent duplication of Keys
 * and avoid having lots of highlighted links on the frontend
 */
type HighlightedUrls = { logged: Url; notLogged: Url };

export const highlightedUrls: HighlightedUrls = {
	logged: { href: books, text: 'Nueva Propiedad', useLogo: true },
	notLogged: { href: loginUrl, text: 'Inicia Sesión' },
};

/**
 * Will only show up for logged Users
 * If isForm is true, it will call a server action instead of redirecting the user
 * Be sure to include the action in the correct format
 * @see https://kit.svelte.dev/docs/form-actions
 */
export const hamburgerMenuUrls: Url[] = [
	{ href: '/favoritos', text: 'Favoritos' },
	{ href: '/', text: 'Cerrar Sesión', isForm: true },
];
