import type { RequestHandler } from '../$types';
import fs from 'fs';
import sharp from 'sharp';
import mongoose from 'mongoose';

export const GET: RequestHandler = async ({ params }) => {
	const data = await fs.promises.readFile(`./media/${params.url}`);
	const webpData = await sharp(data).toFormat('webp').toBuffer();
	const metadata = await sharp(data).metadata();

	// Save the webp image to the media folder
	await fs.promises.writeFile(`./media/${params.url}.webp`, webpData);

	// Save the EXIF information and webp image to MongoDB
	const collection = mongoose.connection.db.collection('<collection>');
	await collection.insertOne({
		...metadata,
		image: {
			data: webpData,
			name: `${params.url}.webp`,
			size: webpData.length,
			type: 'image/webp'
		}
	});

	return new Response(webpData);
};
