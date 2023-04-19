<script lang="ts">
	export let btnClass = '';
	export let size: keyof typeof sizeClasses = 'base';
	export let icon = false;
	export let backgroundColor = 'gray';

	let sizeClasses: { [key: string]: string } = {
		sm: 'px-2 py-1 text-sm',
		base: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg',
		xl: 'px-8 py-4 text-xl'
	};

	let textColor = backgroundColor === 'white' ? 'black' : 'white';
	let hoverBackgroundColor =
		backgroundColor === 'white'
			? '#d9d9d9'
			: backgroundColor === 'gray'
			? '#4fdc4f'
			: backgroundColor === 'black'
			? '#333333'
			: backgroundColor === 'green'
			? '#00cc00'
			: backgroundColor;
</script>

<button
	class={`btn ${icon ? 'btn-icon' : ''} ${sizeClasses[size]} ${btnClass}`}
	style={`--backgroundColor: ${backgroundColor}; --textColor: ${textColor}; --hoverBackgroundColor: ${hoverBackgroundColor}`}
	on:click
>
	<slot />
</button>

<style lang="postcss">
	button {
		background-color: var(--backgroundColor);
		color: var(--textColor);
		border: none;
		text-align: center;
		border-radius: 6px;
		transition: background-color 0.2s ease-in-out;
		user-select: none;
	}
	button:hover {
		background-color: var(--hoverBackgroundColor);
	}
	button:active {
		transform: scale(0.9);
	}
</style>
