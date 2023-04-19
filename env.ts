import pkg from './package.json' assert { type: 'json' };

let env: {
	SITENAME: string;
	LANGUAGE: string;
	TRANSLATIONS: { [key: string]: string };
	SYSTEMLANGUAGE: string;
	HOST: string;
	PORT: number;
	DB_URL: string;
	DB_NAME: string;
	DB_USER: string;
	DB_PASSWORD: string;
	DB_HOST: string;
	API: string;
	PKG: {
		VERSION: string;
	};
	MAPBOX_API_TOKEN: string;
	GOOGLE_API_TOKEN: string;
	YOUTUBE_API_KEY: string;
	VIMEO_API_KEY: string;
	TWITCH_API_KEY: string;
	TIKTOK_API_KEY: string;
} = {
	SITENAME: 'SimpleCMS',

	LANGUAGE: 'en', // defines default language
	TRANSLATIONS: { en: 'English', de: 'German' },

	SYSTEMLANGUAGE: 'en', // defines default System language

	//for express
	HOST: 'http://localhost',
	PORT: 5173,

	// YOUR API_KEYs
	MAPBOX_API_TOKEN: 'pk.eyJ1Ijoicmtyb2VsbHMiLCJhIjoiY2xiaDAxdXJjMDl3MTNvbm14ZGhibjhvbiJ9.nx2Xokl7u_4lwf_VhEiNUQ',
	GOOGLE_API_TOKEN: 'AIzaSyA0_ru-cUxE6dBKJrANnSwWeCTbLU2DDhY',
	YOUTUBE_API_KEY: '',
	VIMEO_API_KEY: '',
	TWITCH_API_KEY: '',
	TIKTOK_API_KEY: '',

	// for mongodb......for Atlas use DB_HOST:"mongodb+srv://XXXX",
	DB_URL: '172.17.0.1:27017',
	DB_NAME: 'NewSimpleCMS',
	DB_USER: 'admin',
	DB_PASSWORD: 'Getin1972!',
	DB_HOST: 'mongodb://172.17.0.1:27017',

	API: '',
	PKG: {
		VERSION: pkg.version
	}
};

env.API = `${env.HOST}:${env.PORT}/api`;

export default env;
