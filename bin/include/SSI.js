const CONSTANTS = require("./constants.js");
const childProcess = require("node:child_process");
const FileSystem = require("./FileSystem.js");

class SSI {
	static async #process(file) {
		const variables = new globalThis.Map();
		let fileContents = await FileSystem.readFile(FileSystem.resolvePath(CONSTANTS.DIR, file), { encoding: "utf8" });

		for (const match of fileContents.matchAll(CONSTANTS.REGEX.SET.COLLECTION)) {
			const variable = match.groups.setArguments.match(CONSTANTS.REGEX.SET.VARIABLE).groups.variable;
			const value = CONSTANTS.SSI.IGNORED_VARS.includes(variable) ? "" : match.groups.setArguments.match(CONSTANTS.REGEX.SET.VALUE).groups.value;
			variables.set(variable, value);
		}
		
		for (const [variable, value] of variables)
			fileContents = fileContents.replace(new globalThis.RegExp(`<!--#\\s+echo\\s+var=['"]${variable}['"]\\s+-->`, "g"), value);
		fileContents = fileContents.replace(CONSTANTS.REGEX.SET.GENERAL, "").replace(CONSTANTS.REGEX.EMPTY_LINES, "");
		await FileSystem.writeFile(FileSystem.resolvePath(CONSTANTS.DIR.IPFS, file), fileContents);
	}

	static async process() {
		await globalThis.Promise.all(CONSTANTS.FILES.SSI.reduce((processPromises, file) => {
			processPromises.push(this.#process(file));
			return processPromises;
		}, []));
	}
}

module.exports = SSI;