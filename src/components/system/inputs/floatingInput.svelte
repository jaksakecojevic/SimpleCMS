<script lang="ts">
	export let type: 'text' | 'password' = 'text';
	export let value = '';
	export let label = '';
	export let icon = '';
	export let labelClass = '';
	export let inputClass = '';
	export let error = '';
	export let name = '';
	export let required = false;
	export let placeholder = '';
	export let disabled = false;
	export let minlength: number | undefined;
	export let maxlength: number | undefined;
	export let onInput: (value: string) => void;

	export let showPassword = false;
	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};

	const handleInput = (e: Event) => {
		value = (e.target as HTMLInputElement).value;
		if (onInput) onInput(value);
	};
</script>

<div>
	<div class="group relative z-0 mb-6 w-full">
		<input
			type={showPassword ? 'text' : type}
			on:input={handleInput}
			id="input"
			class="{inputClass} peer block w-full appearance-none !rounded-none !border-0 !border-b-2 !border-gray-300 !bg-transparent py-2.5 px-6 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
			{value}
			{name}
			{required}
			{placeholder}
			{disabled}
			{minlength}
			{maxlength}
		/>

		{#if icon}
			<iconify-icon {icon} width="18" class="absolute top-2 left-0 text-gray-400" />
		{/if}

		{#if label}
			<label
				for="input"
				class="{labelClass} absolute left-5 -top-6.5 text-gray-600 text-sm pointer-events-none transform transition-all duration-200 ease-in-out peer-focus:-top-6 peer-focus:text-blue-600 peer-placeholder-shown:text-sm peer-placeholder-shown:-top-3.5"
			>
				{label}
			</label>
		{/if}

		<!-- {#if type === 'password'}
			<div class="absolute top-0 -right-2" on:click|preventDefault={togglePasswordVisibility}>
				<iconify-icon icon={showPassword ? 'bi:eye-fill' : 'bi:eye-slash-fill'} class="text-gray-500" width="24" />
			</div>
		{/if} -->

		{#if error}
			<div class="absolute top-8 left-0 text-xs text-red-500">{error}</div>
		{/if}
	</div>
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
