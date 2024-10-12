import path from 'node:path';


export const SORT_ORDER = ["asc", "desc"];
export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;

export var SMTP;
(function (SMTP) {
    SMTP["HOST"] = "SMTP_HOST";
    SMTP["PORT"] = "SMTP_PORT";
    SMTP["USER"] = "SMTP_USER";
    SMTP["PASSWORD"] = "SMTP_PASSWORD";
    SMTP["FROM"] = "SMTP_FROM";
})(SMTP || (SMTP = {}));
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
export var CLOUDINARY;
(function (CLOUDINARY) {
    CLOUDINARY["CLOUD_NAME"] = "CLOUD_NAME";
    CLOUDINARY["API_KEY"] = "API_KEY";
    CLOUDINARY["API_SECRET"] = "API_SECRET";
})(CLOUDINARY || (CLOUDINARY = {}));