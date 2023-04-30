<script lang="ts">
	import { credentials } from '@src/stores/load';
	import axios from 'axios';
	import Collections from './Collections.svelte';
	import { goto } from '$app/navigation';
	import Button from '../buttons/Button.svelte';
	import SimpleCmsLogo from '@src/components/SimpleCMS_Logo.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import AnimatedHamburger from '@src/components/AnimatedHamburger.svelte';
	import Avatar from '../avatar/Avatar.svelte';
	import Badges from '../badges/Badges.svelte';
	import ThemeSwitcher from '@src/components/ThemeSwitcher.svelte';
	import { onMount } from 'svelte';
	import LocaleSwitcher from '@src/components/LocaleSwitcher.svelte';

	export let switchSideBar = true;

	async function signOut() {
		let resp = (
			await axios.post(
				`/api/auth`,
				{ authType: 'signOut' },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
		).data;
		if (resp.status == 200) {
			$credentials = resp;
			goto('/login');
		}
	}

	let badgeColor = 'primary'; // default badge color

	// fetch latest release information from GitHub
	// TODO: Check Version controls
	const currentVersion = __VERSION__;
	async function getLatestVersion() {
		const response = await fetch('https://api.github.com/repos/Rar9/SimpleCMS/releases/latest');
		const data = await response.json();
		return data.tag_name;
	}

	onMount(async () => {
		const latestVersion = await getLatestVersion();

		// compare versions
		if (currentVersion !== latestVersion) {
			const [currentMajor, currentMinor] = currentVersion.split('.');
			const [latestMajor, latestMinor] = latestVersion.split('.');

			if (currentMajor !== latestMajor) {
				badgeColor = 'danger'; // major update available
			} else if (currentMinor !== latestMinor) {
				badgeColor = 'warning'; // minor update available
			}
		}
	});

	// search filter
	let filterCollections = '';
	// TODO: collection parent names should hide on search
	function updateFilter(e: KeyboardEvent) {
		filterCollections = (e.target as HTMLInputElement).value.toLowerCase();
	}
</script>

<section class="relative flex h-screen flex-col bg-gray-400 px-1 pt-2 dark:bg-gray-800 {switchSideBar ? 'w-[225px]' : 'w-fit'}">
	<header class="flex flex-col text-center dark:text-white">
		<!-- Hamburger -->
		{#if !switchSideBar}
			<AnimatedHamburger />
		{/if}

		<!-- Corporate Identity -->
		{#if switchSideBar}
			<a href="/" class="flex py-2 !no-underline">
				<SimpleCmsLogo fill="red" className="h-8" />

				<span class="pl-1 text-2xl font-bold text-black dark:text-white">{PUBLIC_SITENAME}</span>
			</a>
		{/if}

		<!-- Sidebar collapse button -->
		<button
			class="absolute -right-5 top-3 z-10 flex items-center justify-center !rounded-full border-2 border-gray-300"
			on:click={() => (switchSideBar = !switchSideBar)}
		>
			{#if !switchSideBar}
				<!-- Icon Collpased -->
				<iconify-icon
					icon="bi:arrow-left-circle-fill"
					width="30"
					class="rotate-180 rounded-full bg-white text-white hover:cursor-pointer hover:bg-red-600 dark:text-gray-600 dark:hover:bg-red-600"
				/>
			{:else}
				<!-- Icon expanded -->
				<iconify-icon
					icon="bi:arrow-left-circle-fill"
					width="30"
					class="rounded-full bg-white text-white hover:cursor-pointer hover:bg-red-600 dark:text-gray-600 dark:hover:bg-red-600"
				/>
			{/if}
		</button>

		<div class="flex justify-between">
			<!-- Corporate Identity -->
			{#if !switchSideBar}
				<a href="/" class="flex py-2 !no-underline">
					<SimpleCmsLogo fill="red" className="h-8" />
				</a>
			{/if}

			<!-- Search -->
			<!-- TODO: Needs more work -->
			<div class="relative mx-auto my-2">
				{#if !switchSideBar}
					<input
						on:keyup={updateFilter}
						on:focus={() => (switchSideBar = !switchSideBar)}
						placeholder="Search"
						class="relative z-10 h-10 w-10 cursor-pointer !rounded-full border border-gray-700 bg-gray-300/50 pl-12 text-black shadow-xl outline-none focus:w-full focus:cursor-text focus:rounded-sm dark:bg-gray-600/50 dark:text-white md:mt-0 md:h-12"
					/>
				{:else}
					<input
						on:keyup={updateFilter}
						placeholder="Search"
						class="relative z-10 h-10 w-full cursor-pointer rounded-md border border-gray-700 bg-gray-300/50 pl-12 text-black shadow-xl outline-none focus:cursor-text dark:bg-gray-600/50 dark:text-white"
					/>
				{/if}
				<!-- search icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="absolute inset-y-0 my-auto h-8 w-12 border-transparent stroke-black px-3 dark:stroke-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
		</div>
	</header>

	<main class="flex-auto items-center justify-start">
		<Collections />
		{#if switchSideBar}
			<a href="/gallery"><Button iconLeft="bi:images" btnClass="uppercase w-full">Gallery</Button></a>
		{:else}
			<iconify-icon icon="bi:images" width="30" class=" bg-gray-500 text-white" />
		{/if}
	</main>

	<footer class="mt-auto px-1 pb-2 text-center dark:text-white">
		<div class="mx-1 mb-1 border-t" />

		<div class="{switchSideBar ? 'grid-cols-3 grid-rows-3 ' : 'grid-cols-2 grid-rows-2 '} grid items-center justify-center overflow-hidden">
			<!-- Avatar with user settings -->
			<div class="{switchSideBar ? 'order-1 row-span-2' : 'order-1 '} mx-auto">
				<a href="/user"><Avatar width="w-10" src="/Default_User.svg" /></a>
			</div>

			<!-- System Language i18n Handeling -->
			<div class="{switchSideBar ? 'order-3 row-span-2' : 'order-2'} "><LocaleSwitcher /></div>

			<!-- light/dark mode switch -->
			<div class="{switchSideBar ? 'order-2 pt-4' : 'order-3'} ">
				<ThemeSwitcher />
			</div>

			<!-- Lucia Sign Out -->
			<div class="{switchSideBar ? 'order-4' : 'order-4 '} mt-2">
				<iconify-icon icon="uil:signout" width="24" on:click={signOut} />
			</div>

			<div
				class="{switchSideBar
					? 'order-5 col-span-3'
					: 'order-5  col-span-2'}  justifiy-center mx-auto mt-1 flex w-full items-center rounded bg-gray-600/30"
			>
				<!-- Github discussions -->
				<div class="{switchSideBar ? 'ml-2 mt-2' : 'hidden'} ">
					<a href="https://github.com/Rar9/SimpleCMS/discussions" target="blank">
						<iconify-icon icon="mdi:comment-help" width="26" />
					</a>
				</div>

				<!-- CMS Version -->
				<div class="col-span-2 mx-auto">
					<a href="https://github.com/Rar9/SimpleCMS/" target="blank">
						<Badges text={`${switchSideBar ? 'Version: ' : ''}${currentVersion}`} color={badgeColor} />
					</a>
				</div>
			</div>
		</div>
	</footer>
</section>
