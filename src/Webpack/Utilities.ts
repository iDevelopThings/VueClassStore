import fs from "fs";
import path from "path";

export type WalkDirectoryFile = {
	filePath: string,
	isSubDir: boolean,
}

/**
 * @param {string} directory
 * @param {boolean} isSubDir
 */
export const walkDirectory = (directory: string, isSubDir = false): WalkDirectoryFile[] => {
	const files = [];

	fs.readdirSync(directory).forEach((name) => {
		const filePath = path.join(directory, name);
		const stat     = fs.statSync(filePath);

		if (stat.isFile()) {
			if (!(/Store\.(ts|js)$/.test(name))) {
				return;
			}

			files.push({filePath, stat, isSubDir});
		} else if (stat.isDirectory()) {
			files.push(...walkDirectory(filePath, true));
		}
	});

	return files;
};

/**
 * Ensure that all of our directories exist...
 * if they don't, we'll create them
 *
 * @param {string} pathToPrepare
 */
export const ensureDirectoryExists = (pathToPrepare: string) => {
	const pathParts = pathToPrepare.split('/');
	let pathBuilt   = pathParts[0];

	for (let pathPart of pathParts) {

		if (pathBuilt.includes(pathPart)) {
			continue;
		}

		const pathCheck = path.join(pathBuilt, pathPart);

		//			console.log('PathCheck: ', pathCheck);

		if (!fs.existsSync(pathCheck)) {
			fs.mkdirSync(pathCheck);
		}

		pathBuilt = path.join(pathBuilt, pathPart);
	}
};

export const camelize = (str) => {
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
		return index === 0 ? word.toLowerCase() : word.toUpperCase();
	}).replace(/\s+/g, '');
};

export const getTemplate = (name: string, vueVersion: number) => {
	let rootPackageDir = process.cwd();

	//Hacky fix to properly reference the packages directory
	if (!process.cwd().includes('/Packages/VueClassStore')) {
		rootPackageDir = path.join(process.cwd(), 'node_modules', 'vue-class-stores');
	}

	return fs.readFileSync(
		path.resolve(rootPackageDir, 'template', `vue${vueVersion}`, `${name}.template.txt`),
		{encoding : 'utf-8'},
	);
};