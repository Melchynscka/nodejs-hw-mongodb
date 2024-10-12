import * as fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
    try {
        await fs.access(url);
    }
    catch (e) {
        const error = e;
        if (error.code === 'ENOENT') {
            await fs.mkdir(url);
        }
    }
};

