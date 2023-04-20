import mongoose from 'mongoose';

import { DB_TYPE, DB_HOST_MONGO, DB_HOST_ATLAS, DB_NAME, DB_PASSWORD, DB_USER } from '$env/static/private';

import schemas from '@src/collections';
import lucia, { type Session, type User } from 'lucia-auth';
import adapter from '@lucia-auth/adapter-mongoose';
import { session, key, UserSchema } from '@src/collections/Auth';
import { sveltekit } from 'lucia-auth/middleware';
import { fieldsToSchema } from '@src/utils/utils';
import { error } from '@sveltejs/kit';

// Turn off strict mode for query filters. Default in Mongodb 7
mongoose.set('strictQuery', false);

// Turn off strict mode for query filters. Default in Mongodb 7
mongoose.set('strictQuery', false);

function connectToDatabase(dbHost) {
	mongoose
		.connect(dbHost, {
			authSource: 'admin',
			user: DB_USER,
			pass: DB_PASSWORD,
			dbName: DB_NAME
		})
		.then(() => console.log('----------------DB--connected-----------------------'))
		.catch((err) => console.error(err));
}
// use for local mongodb connection
if (DB_TYPE === 'mongodb') {
	connectToDatabase(DB_HOST_MONGO);
}
// use for local mongodb atlas connection
else if (DB_TYPE === 'atlas') {
	connectToDatabase(DB_HOST_ATLAS);
}

let collections: { [Key: string]: mongoose.Model<any> } = {};

for (let schema of schemas) {
	const schema_object = new mongoose.Schema(
		{ ...fieldsToSchema(schema.fields), createdAt: Number, updatedAt: Number },
		{
			typeKey: '$type',
			strict: false,
			timestamps: { currentTime: () => Date.now() }
		}
	);
	collections[schema.name] = mongoose.models[schema.name] ? mongoose.model(schema.name) : mongoose.model(schema.name, schema_object);
}

!mongoose.models['auth_session'] && mongoose.model('auth_session', new mongoose.Schema({ ...session }, { _id: false }));
!mongoose.models['auth_key'] && mongoose.model('auth_key', new mongoose.Schema({ ...key }, { _id: false }));
!mongoose.models['auth_user'] && mongoose.model('auth_user', new mongoose.Schema({ ...UserSchema }, { _id: false, timestamps: true }));
const auth = lucia({
	adapter: adapter(mongoose),
	// for production & cloned dev environment
	// env: dev ? "DEV" : "PROD",
	env: 'DEV',

	autoDatabaseCleanup: true,
	transformDatabaseUser: (userData) => {
		return {
			userId: userData.id,
			email: userData.email,
			role: userData.role,
			username: userData.username,

			firstname: userData.firstname,
			lastname: userData.lastname,
			avatar: userData.avatar,

			resetRequestedAt: userData.resetRequestedAt,
			resetToken: userData.resetToken,
			lastActiveAt: userData.lastActiveAt
		};
	},
	middleware: sveltekit()
});

export { collections, auth };
