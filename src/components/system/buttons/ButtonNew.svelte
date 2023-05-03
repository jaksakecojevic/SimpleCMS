<script lang="ts">
  export let btnClass = '';
  export let size: keyof typeof sizeClasses = 'base';
  export let backgroundColor = 'gray';
  export let ariaLabel = '';

  let sizeClasses: { [key: string]: string } = {
    xs: 'px-1 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
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
  aria-label={ariaLabel}
  class={`btn ${sizeClasses[size]} ${btnClass}`}
  style={`--backgroundColor: ${backgroundColor}; --textColor: ${textColor}; --hoverBackgroundColor: ${hoverBackgroundColor}`}
>
  <div class="slot-wrapper">
    <div class="icon-slot icon-top">
      <slot name="icon-top" />
    </div>
    <div class="text-slot">
      <slot />
    </div>
    <div class="icon-slot icon-bottom">
      <slot name="icon-bottom" />
    </div>
  </div>
</button>

<style lang="postcss" scoped>
  button {
    background-color: var(--backgroundColor);
    color: var(--textColor);
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

  .slot-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .icon-slot {
    display: flex;
    justify-content: center;
  }

  .icon-top {
    order: -1;
  }
</style>
