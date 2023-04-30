<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let listboxValue = 'create';
	let dropdownOpen = false;
	let { actionname, buttonClass, iconValue } = getButtonAndIconValues(listboxValue);

	function handleButtonClick() {
		dispatch(listboxValue);
		dropdownOpen = false;
	}

	function handleOptionClick(value: string) {
		listboxValue = value;
		({ actionname, buttonClass, iconValue } = getButtonAndIconValues(listboxValue));
		dropdownOpen = false;
	}

	function getButtonAndIconValues(listboxValue: string) {
		let actionname = '';
		let buttonClass = '';
		let iconValue = '';

		switch (listboxValue) {
			case 'create':
				actionname = 'Create';
				// buttonClass = 'gradient-primary';
				buttonClass = 'green';
				iconValue = 'ic:round-plus';
				break;
			case 'publish':
				actionname = 'Publish';
				buttonClass = 'gradient-tertiary';
				iconValue = 'bi:hand-thumbs-up-fill';
				break;
			case 'unpublish':
				actionname = 'Unpublish';
				buttonClass = 'gradient-yellow';
				iconValue = 'bi:pause-circle';
				break;
			case 'schedule':
				actionname = 'Schedule';
				buttonClass = 'gradient-pink';
				iconValue = 'bi:clock';
				break;
			case 'clone':
				actionname = 'Clone';
				buttonClass = 'gradient-secondary';
				iconValue = 'bi:clipboard-data-fill';
				break;
			case 'delete':
				actionname = 'Delete';
				// buttonClass = 'gradient-error';
				buttonClass = 'red-500';
				iconValue = 'bi:trash3-fill';
				break;
			default:
				actionname = '';
				buttonClass = '';
				iconValue = '';
				break;
		}

		return {
			actionname,
			buttonClass: `btn ${buttonClass} rounded-none w-32 justify-between`,
			iconValue
		};
	}
</script>

<div class="relative inline-flex rounded-md shadow">
	<button
		class={`inline-block rounded-l-full px-1 pl-4 font-medium uppercase leading-normal text-white transition duration-150 ease-in-out ${buttonClass}`}
		on:click|preventDefault={handleButtonClick}
	>
		<span class="flex items-center">
			<iconify-icon icon={iconValue} width="24" />
			<span class="ml-2">{actionname}</span>
		</span>
	</button>

	<button
		class="bg-primary hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 inline-block rounded-r px-6 py-2 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out focus:outline-none focus:ring-0"
		on:click|preventDefault={() => (dropdownOpen = !dropdownOpen)}
	>
		<iconify-icon icon="mdi:chevron-down" width="24" />
	</button>
</div>

{#if dropdownOpen}
	<ul class="absolute right-0 z-10 mt-2 divide-y-2 rounded-md py-1 text-white shadow-lg ring-1 ring-black ring-opacity-5">
		{#if listboxValue !== 'create'}
			<li>
				<button
					class="w-full px-4 py-2 text-left hover:bg-green-100 focus:bg-green-100 focus:outline-none"
					on:click|preventDefault={() => handleOptionClick('create')}
				>
					<span class="flex items-center">
						<iconify-icon icon="ic:round-plus" width="24" />
						<span class="ml-2">Create</span>
					</span>
				</button>
			</li>
		{/if}

		{#if listboxValue !== 'publish'}
			<li>
				<button
					class="w-full px-4 py-2 text-left hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
					on:click|preventDefault={() => handleOptionClick('publish')}
				>
					<span class="flex items-center">
						<iconify-icon icon="bi:hand-thumbs-up-fill" width="24" />
						<span class="ml-2">Publish</span>
					</span>
				</button>
			</li>
		{/if}

		{#if listboxValue !== 'unpublish'}
			<li>
				<button
					class="w-full px-4 py-2 text-left hover:bg-orange-100 focus:bg-orange-100 focus:outline-none"
					on:click|preventDefault={() => handleOptionClick('unpublish')}
				>
					<span class="flex items-center">
						<iconify-icon icon="bi:pause-circle" width="24" />
						<span class="ml-2">Unpublish</span>
					</span>
				</button>
			</li>
		{/if}

		{#if listboxValue !== 'schedule'}
			<li>
				<button
					class="w-full px-4 py-2 text-left hover:bg-pink-100 focus:bg-pink-100 focus:outline-none"
					on:click|preventDefault={() => handleOptionClick('schedule')}
				>
					<span class="flex items-center">
						<iconify-icon icon="bi:clock" width="24" />
						<span class="ml-2">Schedule</span>
					</span>
				</button>
			</li>
		{/if}

		{#if listboxValue !== 'clone'}
			<li>
				<button
					class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
					on:click|preventDefault={() => handleOptionClick('clone')}
				>
					<span class="flex items-center">
						<iconify-icon icon="bi:clipboard-data-fill" width="24" />
						<span class="ml-2">Clone</span>
					</span>
				</button>
			</li>
		{/if}

		{#if listboxValue !== 'delete'}
			<li>
				<button
					class="w-full px-4 py-2 text-left hover:bg-red-100 focus:bg-red-100 focus:outline-none"
					on:click|preventDefault={() => handleOptionClick('delete')}
				>
					<span class="flex items-center">
						<iconify-icon icon="bi:trash3-fill" width="24" />
						<span class="ml-2">Delete</span>
					</span>
				</button>
			</li>
		{/if}
	</ul>
{/if}
