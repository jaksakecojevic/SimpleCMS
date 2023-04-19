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

	// zod validation Forgotton Password
	import z from 'zod';
	const forgotPasswordSchema = z.object({
		forgottonemail: z.string({ required_error: 'Email is required' }).email({ message: 'Email must be a valid email' })
	});

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
	const handlePasswordInput = (value: string) => {
		console.log('Password:', value);
	};

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
</script>

<section
	on:click
	on:pointerenter
	class="relative flex items-center hover"
	class:active={active == 0}
	class:inactive={active !== undefined && active !== 0}
	class:hover={active == undefined || active == 1}
>
	<div bind:this={form} class="flex flex-col items-center w-full" class:hide={active != 0}>
		<div class="mb-8 flex flex-row gap-2">
			<CMSLogo className="w-14" fill="red" />
			<h1 class="text-2xl font-bold text-black lg:text-3xl">
				<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
				<div class="-mt-1">{$LL.LOGIN_SignIn()}</div>
			</h1>
		</div>
		<div class="-mt-2 mb-2 text-xs text-right text-red-500">{$LL.LOGIN_Required()}</div>

		{#if !forgot && !resetPW}
			<!-- Email field -->
			<FloatingInput type="text" bind:value={email} label={$LL.LOGIN_EmailAddress()} icon="mdi:email" />

			<!-- Password field -->
			<FloatingInput
				type="password"
				bind:value={password}
				label={$LL.LOGIN_Password()}
				icon="mdi:lock"
				bind:showPassword
				onInput={handlePasswordInput}
			/>

			<div class="mt-10">
				<Button backgroundColor="black" btnClass="mr-10" on:click={signup}>{$LL.LOGIN_SignIn()}</Button>
				<Button
					backgroundColor="black"
					on:click={() => {
						forgot = true;
						resetPW = false;
					}}>{$LL.LOGIN_ForgottenPassword()}</Button
				>
			</div>
		{:else if resetPW && !forgot}{/if}
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
