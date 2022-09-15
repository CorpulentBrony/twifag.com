const fse = require("fs-extra");
const fsPromises = require("node:fs/promises");
const path = require("node:path");

class FileSystem {
	static copy(source, destination, options = undefined) { return fse.copy(globalThis.String(source), globalThis.String(destination), options); }
	static mkdir(path, options = undefined) { return fsPromises.mkdir(globalThis.String(path), options); }
	static readdir(path, options = undefined) { return fsPromises.readdir(globalThis.String(path), options); }
	static readFile(path, options = undefined) { return fsPromises.readFile(globalThis.String(path), options); }
	static resolvePath(...paths) { return path.resolve(...paths.map(part => globalThis.String(part))); }
	static rm(path, options = undefined) { return fsPromises.rm(globalThis.String(path), options); }
	static writeFile(file, data, options = undefined) { return fsPromises.writeFile(globalThis.String(file), data, options); }
}

module.exports = FileSystem;