<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let type: 'text' | 'password' | 'file' = 'text';
	export let value = '';
	export let label = '';
	export let labelClass = '';
	export let inputClass = '';
	export let placeholder = '';
	export let file: File | undefined = undefined;
	export let name = '';

	let _data: FileList;

	const dispatch = createEventDispatcher();
	const handleInput = (e: Event) => {
		value = (e.target as HTMLInputElement).value;
	};
	function setFile(node: HTMLInputElement) {
		node.onchange = (e) => {
			_data = (e.target as HTMLInputElement).files as FileList;
			dispatch('select', { files: _data });
		};

		if (file instanceof File) {
			let fileList = new DataTransfer();
			fileList.items.add(file);
			_data = node.files = fileList.files;
			dispatch('select', { files: _data });
		}
	}
</script>

<div>
	{#if label}
		<label for="input" class="{labelClass} capitalize">{label}</label>
	{/if}
	<input use:setFile {type} on:input={handleInput} id="input" class={inputClass} {value} {placeholder} />
</div>

<style lang="postcss">
	div {
		min-width: 280px;
		margin: 5px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	label {
		margin-right: 10px;
	}
	input {
		border: 1px solid #242728;
		border-radius: 6px;
		padding: 5px;
		color: black;
		padding-right: 18px;
		outline-color: #65caec;
	}
</style>
