const getFileIcon = (mimetype) => {
    if (mimetype.includes('image')) {
        return '🖼️';
    } else if (mimetype.includes('pdf')) {
        return '📄';
    } else if (mimetype.includes('word') || mimetype.includes('document')) {
        return '📝';
    } else if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) {
        return '📊';
    } else if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) {
        return '📈';
    } else if (mimetype.includes('text')) {
        return '📃';
    } else {
        return '📎';
    }
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

module.exports = {
    getFileIcon,
    formatFileSize,
    getFileExtension
};