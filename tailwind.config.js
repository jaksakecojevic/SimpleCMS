/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				// Start with default and use xs/sm/md/lg/xl/2xl
				xs: '360px',
				// => @media (min-width: 360px) { ... }

				sm: '567px',
				// => @media (min-width: 576px) { ... }

				md: '768px',
				// => @media (min-width: 768px) { ... }

				lg: '992px',
				// => @media (min-width: 992px) { ... }

				xl: '1200px',
				// => @media (min-width: 1200px) { ... }

				'2xl': '1536px',
				// => @media (min-width: 1536px) { ... }

				//----------------- max-width------------------------------------------------

				'max-xs': { max: '360px' },
				// => @media (min-width: 360px) { ... }

				'max-sm': { max: '567px' },
				// => @media (min-width: 576px) { ... }

				'max-md': { max: '768px' },
				// => @media (min-width: 768px) { ... }

				'max-lg': { max: '992px' },
				// => @media (min-width: 992px) { ... }

				'max-xl': { max: '1200px' },
				// => @media (min-width: 1200px) { ... }

				'max-2xl': { max: '1536px' }
				// => @media (min-width: 1536px) { ... }
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('prettier-plugin-tailwindcss')
		// ...
	]
};
