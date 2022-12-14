const CONSTANTS = require("./constants.js");
const childProcess = require("node:child_process");

function escapeRegExpString(regExpString) { return regExpString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

class IPFS {
	static KEY = class KEY {
		static async fromName(name) {
			const keyList = await this.list();
			const regExp = new globalThis.RegExp(`^(?<keyValue>\\S+) ${escapeRegExpString(name)}\\s*$`, "gm");
			const match = regExp.exec(keyList);

			if ("groups" in match && "keyValue" in match.groups && globalThis.String(match.groups.keyValue).length > 0)
				return `/ipns/${match.groups.keyValue}`;
			return false;
		}
		static list() {
			return new globalThis.Promise((resolve, reject) => {
				let keyList = "";
				const command = childProcess.exec(`${CONSTANTS.IPFS.COMMAND.KEY.LIST}`);
				command.stderr.on("data", reject);
				command.stdout.on("data", data => keyList += data);
				command.on("close", code => {
					if (keyList.length > 0)
						resolve(keyList);
					else
						reject("ipfs key list command returned no key list");
				});
				command.on("error", reject);
			});
		}
	};
	static NAME = class NAME {
		static publish(cid) {
			return new globalThis.Promise((resolve, reject) => {
				const command = childProcess.exec(`${CONSTANTS.IPFS.COMMAND.NAME.PUBLISH} ${cid}`);
				command.stderr.on("data", reject);
				command.on("close", code => {
					if (code === 0)
						resolve();
					else
						reject(`IPFS name publish terminated with exit code ${code}`);
				});
				command.on("error", reject);
			});
		}
		static async resolve(keyPromise) {
			const key = await globalThis.Promise.resolve(keyPromise);
			return new globalThis.Promise((resolve, reject) => {
				let cid = "";
				const command = childProcess.exec(`${CONSTANTS.IPFS.COMMAND.NAME.RESOLVE} ${key}`);
				command.stderr.on("data", reject);
				command.stdout.on("data", data => cid += data);
				command.on("close", code => {
					cid = cid.trim();

					if (cid.length > 0)
						resolve(cid);
					else
						reject("ipfs name resolve command returned no CID");
				});
				command.on("error", reject);
			});
		}
	};
	static PIN = class PIN {
		static REMOTE = class REMOTE {
			static add(cid) {
				function addSingleService(service) {
					return new globalThis.Promise((resolve, reject) => {
						const command = childProcess.exec(`${CONSTANTS.IPFS.COMMAND.PIN.REMOTE.ADD} --service=${service} ${cid}`);
						command.stderr.on("data", reject);
						command.on("close", code => {
							if (code === 0)
								resolve();
							else
								reject(`IPFS pin remote add for service ${service} terminated with exit code ${code}`);
						});
						command.on("error", reject);
					});
				}

				return globalThis.Promise.all(CONSTANTS.IPFS.PINNING_SERVICES.reduce((results, service) => {
					results.push(addSingleService(service));
					return results;
				}, []));
			}
			static rm(cid) {
				function rmSingleService(service, cid) {
					return new globalThis.Promise((resolve, reject) => {
						const command = childProcess.exec(`${CONSTANTS.IPFS.COMMAND.PIN.REMOTE.RM}=${cid} --service=${service}`);
						command.stderr.on("data", reject);
						command.on("close", code => {
							if (code === 0)
								resolve();
							else
								reject(`IPFS pin remote rm for service ${service} terminated with exit code ${code}`);
						});
						command.on("error", reject);
					});
				}
				
				const match = cid.match(CONSTANTS.REGEX.EXTRACT_CID);

				if ("groups" in match && "cid" in match.groups && globalThis.String(match.groups.cid).length > 0)
					cid = match.groups.cid;
				return globalThis.Promise.all(CONSTANTS.IPFS.PINNING_SERVICES.reduce((results, service) => {
					results.push(rmSingleService(service, cid));
					return results;
				}, []));
			}
		};

		static add(cid) {
			return new globalThis.Promise((resolve, reject) => {
				const command = childProcess.exec(`${CONSTANTS.IPFS.COMMAND.PIN.ADD} ${cid}`);
				command.stderr.on("data", reject);
				command.on("close", code => {
					if (code === 0)
						resolve();
					else
						reject(`IPFS pin add terminated with exit code ${code}`);
				});
				command.on("error", reject);
			});
		}
		static async isPinned(cid) {
			try {
				const lsResult = await this.ls(cid);

				if (typeof lsResult === "string" && lsResult.length > 0)
					return true;
			} catch { return false; }
			return false;
		}
		static ls(cid = undefined) {
			if (cid === undefined)
				cid = "";
			return new globalThis.Promise((resolve, reject) => {
				let result = "";
				const command = childProcess.exec(`${CONSTANTS.IPFS.COMMAND.PIN.LS} ${cid}`);
				command.stderr.on("data", reject);
				command.stdout.on("data", data => result += data);
				command.on("close", code => {
					if (result.length > 0)
						resolve(result);
					else
						reject("ipfs add command returned no CID");
				});
				command.on("error", reject);
			});
		}
		static async rm(cidPromise) {
			const cid = await globalThis.Promise.resolve(cidPromise);
			return new globalThis.Promise((resolve, reject) => {
				const command = childProcess.exec(`${CONSTANTS.IPFS.COMMAND.NAME.RM} ${cid}`);
				command.stderr.on("data", reject);
				command.on("close", code => {
					if (code === 0)
						resolve();
					else
						reject(`IPFS pin rm terminated with exit code ${code}`);
				});
				command.on("error", reject);
			});
		}
		static update(oldCid, newCid) {
			return new globalThis.Promise((resolve, reject) => {
				const command = childProcess.exec(`${CONSTANTS.IPFS.COMMAND.PIN.UPDATE} ${oldCid} ${newCid}`);
				command.stderr.on("data", reject);
				command.on("close", code => {
					if (code === 0)
						resolve();
					else
						reject(`IPFS pin update terminated with exit code ${code}`);
				});
				command.on("error", reject);
			});
		}
	};

	static add(fileOrDirectory) {
		return new globalThis.Promise((resolve, reject) => {
			let cid = "";
			const command = childProcess.exec(`${CONSTANTS.IPFS.COMMAND.ADD} ${fileOrDirectory}`);
			command.stderr.on("data", reject);
			command.stdout.on("data", data => cid += data);
			command.on("close", code => {
				cid = `/ipfs/${cid.trim()}`;

				if (cid.length > 6)
					resolve(cid);
				else
					reject("ipfs add command returned no CID");
			});
			command.on("error", reject);
		});
	}
}

module.exports = IPFS;