<script lang="ts">
	import '@src/stores/store';
	import { PUBLIC_SITENAME } from '$env/static/public';

	import SignIn from './components/SignIn.svelte';
	import SignUp from './components/SignUp.svelte';
	import Logo from './components/icons/Logo.svelte';

	export let data: any;
	//console.log(data);

	let active: undefined | 0 | 1 = undefined;
	let background: 'white' | '#242728' = 'white';

	// export let data: PageData;
	// import type { PageData } from './$types';
	// const { firstUserExists } = data;

	let firstUserExists = true;
</script>

<div class="body" style="background:{background} ">
	<!-- TODO: Really hide icon if not displayed and adjust z-index so it doesnt enter form -->
	<SignIn {active} on:click={() => (active = 0)} on:pointerenter={() => (background = '#242728')} />
	<SignUp {active} on:click={() => (active = 1)} on:pointerenter={() => (background = 'white')} {firstUserExists} />
	{#if active == undefined}
		<!-- CSS Logo -->
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform flex items-center justify-center">
			<div class="bg-white relative top-[-150px] h-[170px] w-[170px] justify-center rounded-full">
				<svg width="160" height="160" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
					<circle
						cx="80"
						cy="80"
						r="75"
						stroke-width="2"
						stroke-dasharray="191 191"
						stroke-dashoffset="191"
						transform="rotate(51.5, 80, 80)"
						class="fill-none stroke-red-500"
					/>

					<circle
						cx="80"
						cy="80"
						r="75"
						stroke-width="2"
						stroke-dasharray="191 191"
						stroke-dashoffset="191"
						transform="rotate(231.5, 80, 80)"
						class="fill-none stroke-red-500"
					/>
				</svg>

				<svg width="170" height="170" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
					<circle
						cx="85"
						cy="85"
						r="80"
						stroke-width="2"
						stroke-dasharray="205 205"
						stroke-dashoffset="205"
						transform="rotate(50, 85, 85)"
						class="fill-none stroke-black"
					/>
					<circle
						cx="85"
						cy="85"
						r="80"
						stroke-width="2"
						stroke-dasharray="205 205"
						stroke-dashoffset="205"
						transform="rotate(230, 85, 85)"
						class="fill-none stroke-black"
					/>
				</svg>

				<div class="absolute top-[77px] left-1/2 -translate-x-1/2 -translate-y-1/2 transform flex flex-col items-center justify-center text-center">
					<Logo fill="black" className="w-8 h-8" />
					<div class="text-3xl font-bold text-red-500">{PUBLIC_SITENAME}</div>
					<div class="-mt-[1px] text-[11px] font-bold text-black">with Sveltekit Power</div>
				</div>
			</div>
		</div>
		<!-- TODO:fix Language switcher -->
		<div class="absolute bottom-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 transform flex items-center justify-center cursor-pointer">
			<div class="bg-[#242728] text-white border-2 rounded-full p-2">
				DE
				<!-- <LocaleSwitcher /> -->
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.body {
		width: 100vw;
		height: 100vh;
		display: flex;
		overflow: hidden;
		background: linear-gradient(90deg, #242728 50%, white 50%);
	}
</style>
