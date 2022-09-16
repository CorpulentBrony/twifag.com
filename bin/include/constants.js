const path = require("node:path");

// user-defined constants
const FILES_EXCLUDED = [".cid", ".git", ".gitignore", "bin", "node_modules", "package.json", "package-lock.json"]; // files that will not be copied
const FILES_SSI = ["index.html"]; // files that contain SSI declare/set properties (all sets must be declared within the same file)
const IPFS_COMMAND = "~/.local/bin/ipfs";
const IPFS_COMMAND_ADD = "add --cid-version=1 --recursive --hidden --pin=false --quieter";
const IPFS_COMMAND_KEY_LIST = "key list --ipns-base base32 -l";
const IPFS_COMMAND_NAME_RESOLVE = "name resolve";
const IPFS_COMMAND_PIN_ADD = "pin add";
const IPFS_COMMAND_PIN_LS = "pin ls --quiet";
const IPFS_COMMAND_PIN_REMOTE_RM = "pin remote rm --force --service=pinata --status=queued,pinning,pinned,failed --cid";
const IPFS_COMMAND_PIN_RM = "pin rm";
const IPFS_COMMAND_PIN_UPDATE = "pin update";
const IPFS_DIR_NAME = "twifag-ipfs";
const IPFS_TARGET_KEY = "twifag.eth";
const REGEX_EMPTY_LINES = /\n^\s+$\n/gm;
const REGEX_EXTRACT_CID = /\/ipfs\/(?<cid>\S+)/;
const REGEX_SET_COLLECTION = /^\s*<!--#\s+set\s+(?<setArguments>.*)\s+-->\s*$/gm;
const REGEX_SET_GENERAL = /<!--#\s+set\s+.+\s+-->/g;
const REGEX_SET_VALUE = /value="(?<value>[^"]*)"/;
const REGEX_SET_VARIABLE = /var="(?<variable>[^"]*)"/;
const SSI_IGNORED_VARS = ["pageUrl"]; // SSI vars to be ignored during processing; will be replaced with an empty string
const WALLET_DIR_NAME = ".well-known/wallets/";
const WALLET_DIR_SOURCE = "/var/www/html/HIP-0002/twifag/";

// calculated constants
const DIR_WORKING = path.resolve(__dirname, "../..");
const IPFS_COMMAND_NAME_PUBLISH = `name publish --ipns-base base32 --key=${IPFS_TARGET_KEY} --quieter`;
const IPFS_COMMAND_PIN_REMOTE_ADD = `pin remote add --background --name="${IPFS_TARGET_KEY}-${(new globalThis.Date()).toISOString()}" --service=pinata`;

// const OUTPUT_CAR_FILE = path.resolve(WORKING_DIR, OUTPUT_CAR_FILE_NAME);
const DIR_IPFS = path.resolve(DIR_WORKING, IPFS_DIR_NAME);

const DIR_WALLET = path.resolve(DIR_IPFS, WALLET_DIR_NAME);

// overloading primitives as objects
const DIR_WALLET_OBJECT = new globalThis.String(DIR_WALLET);
DIR_WALLET_OBJECT.SOURCE = WALLET_DIR_SOURCE;

const DIR_OBJECT = new globalThis.String(DIR_WORKING);
DIR_OBJECT.IPFS = DIR_IPFS;
DIR_OBJECT.WALLET = globalThis.Object.freeze(DIR_WALLET_OBJECT);

// building output constant children
const DIR = globalThis.Object.freeze(DIR_OBJECT);
const FILES = globalThis.Object.freeze({
	EXCLUDED: globalThis.Object.freeze(FILES_EXCLUDED), 
	SSI: globalThis.Object.freeze(FILES_SSI)
});
const IPFS = globalThis.Object.freeze({
	COMMAND: globalThis.Object.freeze({
		ADD: `${IPFS_COMMAND} ${IPFS_COMMAND_ADD}`, 
		KEY: globalThis.Object.freeze({
			LIST: `${IPFS_COMMAND} ${IPFS_COMMAND_KEY_LIST}`
		}), 
		NAME: globalThis.Object.freeze({
			PUBLISH: `${IPFS_COMMAND} ${IPFS_COMMAND_NAME_PUBLISH}`, 
			RESOLVE: `${IPFS_COMMAND} ${IPFS_COMMAND_NAME_RESOLVE}`
		}), 
		PIN: globalThis.Object.freeze({
			ADD: `${IPFS_COMMAND} ${IPFS_COMMAND_PIN_ADD}`, 
			LS: `${IPFS_COMMAND} ${IPFS_COMMAND_PIN_LS}`, 
			REMOTE: globalThis.Object.freeze({
				ADD: `${IPFS_COMMAND} ${IPFS_COMMAND_PIN_REMOTE_ADD}`, 
				RM: `${IPFS_COMMAND} ${IPFS_COMMAND_PIN_REMOTE_RM}`
			}), 
			RM: `${IPFS_COMMAND} ${IPFS_COMMAND_PIN_RM}`, 
			UPDATE: `${IPFS_COMMAND} ${IPFS_COMMAND_PIN_UPDATE}`
		})
	}), 
	TARGET_KEY: IPFS_TARGET_KEY
});
const REGEX = globalThis.Object.freeze({
	EMPTY_LINES: REGEX_EMPTY_LINES, 
	EXTRACT_CID: REGEX_EXTRACT_CID, 
	SET: globalThis.Object.freeze({
		COLLECTION: REGEX_SET_COLLECTION, 
		GENERAL: REGEX_SET_GENERAL, 
		VALUE: REGEX_SET_VALUE, 
		VARIABLE: REGEX_SET_VARIABLE
	})
});
const SSI = globalThis.Object.freeze({
	IGNORED_VARS: globalThis.Object.freeze(SSI_IGNORED_VARS)
});

// export constants
module.exports = globalThis.Object.freeze({ DIR, FILES, IPFS, REGEX, SSI });