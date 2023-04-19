<script lang="ts">
	import AnimatedHamburger from '@src/components/AnimatedHamburger.svelte';
	import { toggleLeftSidebar } from '@src/stores/store';

	export let switchSideBar = false;

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';
	import Avatar from '@src/components/system/avatar/Avatar.svelte';
	import Badges from '@src/components/system/badges/Badges.svelte';
</script>

<div class="flex mr-1 align-centre mb-2 dark:text-white">
	{#if !switchSideBar && $toggleLeftSidebar}
		<AnimatedHamburger />
	{/if}

	<h1 class={!$toggleLeftSidebar ? 'ml-2' : ''}>{$LL.USER_Profile()}</h1>
</div>

<div class="grid overflow-hidden grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-1">
	<!-- Avatar with user settings -->

	<Avatar width="w-20" src="/Default_User.svg" />

	<Badges>EDIT</Badges>
</div>
