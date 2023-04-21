<script lang="ts">
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { credentials } from '@src/stores/load';
	import SignupIcon from './icons/SignupIcon.svelte';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import CMSLogo from './icons/Logo.svelte';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	export let active: undefined | 0 | 1 = undefined;
	export let firstUserExists = false;

	// Superforms integration with zod validation on client
	import type { PageData } from '../$types';
	import { superForm } from 'sveltekit-superforms/client';

	// for debugging only
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	//export let data: PageData;

	// Client API:
	//const { form, errors, enhance } = superForm(data.form);

	let isLoading = false;
	let form: HTMLDivElement;

	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let token = ''; // token send by admin
	let terms = ''; // terms and conditions

	// Remove leading and trailing spaces
	$: {
		username = username.trim();
		email = email.trim();
		password = password.trim();
		confirmPassword = confirmPassword.trim();
		token = token.trim();
	}

	async function signup() {
		let resp = (
			await axios.post(
				`/api/auth`,
				{ email, password, authType: 'signUp' },
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
</script>

<section
	on:click
	on:pointerenter
	class="relative flex items-center hover"
	class:active={active == 1}
	class:inactive={active !== undefined && active !== 1}
	class:hover={active == undefined || active == 0}
>
	<div bind:this={form} class="mx-auto mt-[15%] mb-[5%] w-full p-4 lg:w-1/2" class:hide={active != 1}>
		<div class="mb-1 flex flex-row gap-2">
			<CMSLogo className="w-12" fill="red" />

			<h1 class="text-3xl font-bold text-white lg:text-4xl">
				<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
				<div class="lg:-mt-1">{$LL.LOGIN_SignUp()}</div>
			</h1>
		</div>
		<div class="-mt-2 text-xs text-right text-red-500">{$LL.LOGIN_Required()}</div>

		<form action="">
			<!-- Username field -->
			<FloatingInput
				type="text"
				required
				bind:value={username}
				label={$LL.LOGIN_Username()}
				icon="mdi:user-circle"
				iconColor="white"
				textColor="white"
			/>

			<FloatingInput type="text" required bind:value={email} label={$LL.LOGIN_EmailAddress()} icon="mdi:email" iconColor="white" textColor="white" />
			<!-- TODO Check PW & Check to show hide PW together and have matiching PW -->
			<!-- Password field -->
			<FloatingInput
				type="password"
				required
				bind:value={password}
				label={$LL.LOGIN_Password()}
				icon="mdi:password"
				iconColor="white"
				textColor="white"
				showPasswordBackgroundColor="dark"
			/>

			<!-- Password Confirm -->
			<FloatingInput
				type="password"
				required
				bind:value={password}
				label={$LL.LOGIN_ConfirmPassword()}
				icon="mdi:password"
				iconColor="white"
				textColor="white"
				showPasswordBackgroundColor="dark"
			/>
			<!-- Registration Token -->
			{#if firstUserExists}
				<FloatingInput required type="text" bind:value={token} label={$LL.LOGIN_Token()} icon="mdi:key-chain" iconColor="white" textColor="white" />
			{/if}

			<Button backgroundColor="white" btnClass="mt-6 ml-2" on:click={signup}>{$LL.LOGIN_SignUp()}</Button>
		</form>
	</div>

	<SignupIcon show={active == 0 || active == undefined} />
</section>

<style>
	.hide {
		transition: 0s;
		opacity: 0;
	}
	section {
		--width: 0%;
		background: #242728;
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
		border-top-left-radius: 5% 50%;
		border-bottom-left-radius: 5% 50%;
		width: calc(var(--width) + 10%);
	}
</style>
