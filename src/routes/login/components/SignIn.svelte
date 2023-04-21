<script lang="ts">
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { credentials } from '@src/stores/load';
	import SigninIcon from './icons/SigninIcon.svelte';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import CMSLogo from './icons/Logo.svelte';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	export let active: undefined | 0 | 1 = undefined;
	export let show = false;
	export let forgot = false;
	export let resetPW = false;

	// Superforms integration with zod validation on client
	import type { PageData } from '../$types';
	import { superForm } from 'sveltekit-superforms/client';

	// for debugging only
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data: PageData;

	// Client AP
	//const { form, errors, enhance } = superForm(data.form);

	let isLoading = false;
	let form: HTMLDivElement;

	let email = '';
	let password = '';
	let forgottonemail = '';
	let confirmPassword = '';

	// Remove leading and trailing spaces
	$: {
		email = email.trim();
		password = password.trim();
	}

	let showPassword = false;

	async function signup() {
		let resp = (
			await axios.post(
				`/api/auth`,
				{ email, password, authType: 'signIn' },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
		).data;

		if (resp.status == 200) {
			$credentials = resp;
			goto('/');
		} else {
			form.classList.add('wiggle');
			setTimeout(() => form.classList.remove('wiggle'), 300);
		}
	}

	async function forgotten() {
		let resetPW = true;
		let resp = (
			await axios.post(
				`/api/auth`,
				{ email, password, authType: 'forgotten' },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
		).data;

		if (resp.status == 200) {
			$credentials = resp;
			goto('/reset');
		} else {
			form.classList.add('wiggle');
			setTimeout(() => form.classList.remove('wiggle'), 300);
		}
	}
</script>

<!-- <SuperDebug data={$form} /> -->

<section
	on:click
	on:pointerenter
	class="relative flex items-center hover"
	class:active={active == 0}
	class:inactive={active !== undefined && active !== 0}
	class:hover={active == undefined || active == 1}
>
	<div bind:this={form} class="mx-auto mt-[15%] mb-[5%] w-full p-4 lg:w-1/2" class:hide={active != 0}>
		<div class="mb-1 flex flex-row gap-2">
			<CMSLogo className="w-12" fill="red" />

			<h1 class="text-3xl font-bold text-black lg:text-4xl">
				<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
				{#if !forgot}
					<div class="lg:-mt-1">{$LL.LOGIN_SignIn()}</div>
				{:else if forgot}
					<div class="lg:-mt-1 text-2xl lg:text-4xl">{$LL.LOGIN_ForgottenPassword()}</div>
				{:else}
					<div class="lg:-mt-1">{$LL.LOGIN_ResetPassword()}</div>
				{/if}
			</h1>
		</div>
		<div class="-mt-2 text-xs text-right text-red-500">{$LL.LOGIN_Required()}</div>

		<!-- <form method="POST" use:enhance> -->
		<form action="">
			{#if !forgot && !resetPW}
				<!-- Email field -->
				<FloatingInput type="text" bind:value={email} required label={$LL.LOGIN_EmailAddress()} icon="mdi:email" iconColor="black" />
				<!-- <FloatingInput type="text" bind:value={$form.email} required label={$LL.LOGIN_EmailAddress()} icon="mdi:email" iconColor="black" />
				{#if $errors.email}
					<small>{$errors.email}</small>
				{/if} -->

				<!-- Password field -->
				<FloatingInput
					type="password"
					required
					bind:value={password}
					bind:showPassword
					label={$LL.LOGIN_Password()}
					icon="mdi:lock"
					iconColor="black"
				/>
				<!-- <FloatingInput
					type="password"
					required
					bind:value={$form.password}
					bind:showPassword
					label={$LL.LOGIN_Password()}
					icon="mdi:lock"
					iconColor="black"
					
				/>
				{#if $errors.password}
					<small>{$errors.password}</small>
				{/if} -->

				<div>
					<Button backgroundColor="black" btnClass="mt-6 ml-2" on:click={signup}>{$LL.LOGIN_SignIn()}</Button>

					<Button
						backgroundColor="white"
						size="sm"
						btnClass="ml-5 border border-black !rounded-lg"
						on:click={() => {
							forgot = true;
							resetPW = false;
						}}>{$LL.LOGIN_ForgottenPassword()}</Button
					>
				</div>
			{:else if resetPW && forgot}
				<!-- Reset Password -->

				<!-- Password field -->
				<FloatingInput
					type="password"
					required
					bind:value={password}
					bind:showPassword
					label={$LL.LOGIN_Password()}
					icon="mdi:lock"
					iconColor="black"
				/>
				<!-- Password field -->
				<FloatingInput
					type="password"
					required
					bind:value={password}
					bind:showPassword
					label={$LL.LOGIN_ConfirmPassword()}
					icon="mdi:lock"
					iconColor="black"
				/>

				<!-- Password field -->
				<FloatingInput type="password" required bind:value={password} bind:showPassword label={$LL.LOGIN_Token()} icon="mdi:lock" iconColor="black" />
				<Button backgroundColor="black" btnClass="mt-6 ml-2" on:click={signup}>{$LL.LOGIN_ResetPasswordSave()}</Button>
			{:else}
				<!-- Forgotten Password -->

				<!-- Email field -->
				<FloatingInput type="text" bind:value={email} required label={$LL.LOGIN_EmailAddress()} icon="mdi:email" iconColor="black" />
				<Button backgroundColor="black" btnClass="mt-6 ml-2" on:click={forgotten}>{$LL.LOGIN_SendResetMail()}</Button>
				<Button
					backgroundColor="black"
					btnClass="circular-btn mt-6 ml-2"
					iconLeft="mdi:arrow-left-circle"
					on:click={() => {
						forgot = false;
						resetPW = false;
					}}
				/>{/if}
		</form>
	</div>
	<SigninIcon show={active == 1 || active == undefined} />
</section>

<style lang="postcss">
	.hide {
		transition: 0s;
		opacity: 0;
	}
	section {
		--width: 0%;
		background: white;
		flex-grow: 1;
		width: var(--width);
		transition: 0.4s;
	}
	.active {
		--width: 90%;
	}
	.inactive {
		--width: 10%;
	}
	.hover:hover {
		border-top-right-radius: 5% 50%;
		border-bottom-right-radius: 5% 50%;
		width: calc(var(--width) + 10%);
	}
</style>
