import {exec} from 'child_process';

export default (query: string, cb: (status: boolean) => void) => {
    const platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32':
            cmd = `tasklist`;
            break;
        case 'darwin':
            cmd = `ps -ax | grep ${query}`;
            break;
        case 'linux':
            cmd = `ps -A`;
            break;
        default:
            break;
    }
    exec(cmd, (err, stdout) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}