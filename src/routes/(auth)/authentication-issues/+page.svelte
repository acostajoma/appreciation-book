<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Faq from '$lib/components/FAQ.svelte';
	import { forgotPasswordUrl, loginUrl } from '$lib/constants/urls';
</script>

{#snippet answer1()}
	If you forgot your password, you can click on the link
	<Button href={forgotPasswordUrl} useButtonStyle={false} additionalClasses="text-indigo-700"
		>Forgot your password?</Button
	>
	on the login screen. We will send you an email with instructions to reset it.
{/snippet}
{#snippet answer2()}
	Make sure the provided email address is correct and check your spam or junk mail folder. If you
	still haven't received it, try
	<Button href={loginUrl} useButtonStyle={false} additionalClasses="text-indigo-700"
		>logging in</Button
	>
	with this email and the set password to receive another confirmation email.
{/snippet}

<Faq
	title="Frequently Asked Questions"
	questionsAndAnswers={[
		{
			question: 'What should I do if I forgot my password?',
			snippet: answer1,
		},
		{
			question: "Why didn't I receive the confirmation email?",
			snippet: answer2,
		},
		{
			question: "Why can't I log in with my username and password?",
			text: 'Make sure the entered information is correct. If you continue to have issues, try resetting your password.',
		},
		{
			question: 'What is "rate limiting" and how does it affect me?',
			text: 'To protect the security of your account, our application limits users to a maximum of 5 authentication attempts every 30 minutes, based on your IP address or user ID. If you have reached this limit, you will need to wait before trying again.',
		},
		{
			question: 'Why do I receive an email with a token every time I log in?',
			text: 'For security, we have configured two-factor authentication for all users by default. Every time you log in, you will receive an email with a token that you must enter to complete the authentication process.',
		},
		{
			question: 'Can I use a password manager to log in?',
			text: 'Yes, you can use a password manager to store and automatically fill in your login information. Make sure the password manager is secure and reliable, and that it is set up to autofill on our website.',
		},
	]}
/>

<Button additionalClasses="max-w-40 text-center mx-auto" href="/" useButtonStyle={true}
	>Return to Home</Button
>
