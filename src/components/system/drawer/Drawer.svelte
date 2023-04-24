<script lang="ts">
	import SimpleCmsLogo from '@src/components/SimpleCMS_Logo.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import Collections from './Collections.svelte';
	import AnimatedHamburger from '@src/components/AnimatedHamburger.svelte';
	import Avatar from '../avatar/Avatar.svelte';
	import Badges from '../badges/Badges.svelte';
	import ThemeSwitcher from '@src/components/ThemeSwitcher.svelte';
	import Button from '../buttons/Button.svelte';

	export let switchSideBar = true;
	const pkg = __VERSION__;

	// search filter
	let filterCollections = '';
	// TODO: collection parent names should hide on search
	function updateFilter(e: KeyboardEvent) {
		filterCollections = (e.target as HTMLInputElement).value.toLowerCase();
	}
</script>

<section class="relative bg-gray-800 pt-2 px-1 flex flex-col h-screen {switchSideBar ? 'w-[215px]' : 'w-fit'}">
	<header class="flex flex-col text-center dark:text-white">
		<!-- Hamburger -->
		{#if !switchSideBar}
			<AnimatedHamburger />
		{/if}

		<!-- Corporate Identity -->
		{#if switchSideBar}
			<a href="/" class="py-2 flex !no-underline">
				<SimpleCmsLogo fill="red" className="h-8" />

				<span class="pl-1 text-2xl font-bold text-black dark:text-white">{PUBLIC_SITENAME}</span>
			</a>
		{/if}

		<!-- Sidebar collapse button -->
		<button
			class="z-10 absolute top-2 flex justify-center items-center -right-2 !rounded-full border-2 border-gray-300"
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
				<a href="/" class="py-2 flex !no-underline">
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
			<iconify-icon icon="bi:images" width="30" class=" text-white bg-gray-500" />
		{/if}
	</main>

	<footer class="mt-auto text-white px-1 pb-2 text-center">
		<div class="border-t mx-1 mb-1" />

		<div class="{switchSideBar ? 'grid-rows-3 grid-cols-3 ' : 'grid-rows-2 grid-cols-2 '} grid overflow-hidden justify-center items-center">
			<!-- Avatar with user settings -->
			<div class="{switchSideBar ? 'order-1 row-span-2' : 'order-1 '} mx-auto">
				<a href="/user"><Avatar width="w-10" src="/Default_User.svg" /></a>
			</div>

			<!-- System Language i18n Handeling -->
			<div class="{switchSideBar ? 'order-3 row-span-2' : 'order-2'} ">EN</div>

			<!-- light/dark mode switch -->
			<div class="{switchSideBar ? 'order-2 pt-4' : 'order-3'} ">
				<ThemeSwitcher />
			</div>

			<!-- Lucia Sign Out -->
			<div class="{switchSideBar ? 'order-4' : 'order-4 '} mt-2">
				<iconify-icon icon="uil:signout" width="24" />
			</div>

			<div
				class="{switchSideBar
					? 'order-5 col-span-3'
					: 'order-5  col-span-2'}  mt-1 mx-auto w-full flex justifiy-center items-center bg-gray-600/30 rounded"
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
						<Badges text={`${switchSideBar ? 'Version: ' : ''}${pkg}`} color="primary" />
					</a>
				</div>
			</div>
		</div>
	</footer>
</section>
