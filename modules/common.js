exports.getMime = function (extname) {
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.javascript':
            return 'text/javascript';
        default:
            return 'text/html';
    }
}