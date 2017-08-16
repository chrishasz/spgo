
//format the remote folder to /<folder structure>/ 
export function formatFolder(path) : string{
    if(!path.startsWith('/')){
        path = '/' + path;
    }
    if(!path.endsWith('/')){
        path = path + '/';
    }

    return path;
}