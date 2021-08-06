export declare type WalkDirectoryFile = {
    filePath: string;
    isSubDir: boolean;
};
/**
 * @param {string} directory
 * @param {boolean} isSubDir
 */
export declare const walkDirectory: (directory: string, isSubDir?: boolean) => WalkDirectoryFile[];
/**
 * Ensure that all of our directories exist...
 * if they don't, we'll create them
 *
 * @param {string} pathToPrepare
 */
export declare const ensureDirectoryExists: (pathToPrepare: string) => void;
export declare const camelize: (str: any) => any;
export declare const getTemplate: (name: string, vueVersion: number) => string;
