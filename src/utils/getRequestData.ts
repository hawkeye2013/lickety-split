const getRequestData = (req: any) => { 
    /*  
    Usage;
    getRequestBody(request).then(
        body => {
            parse(body)....
        }
    )
    */ 
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk: any) => {
            body += chunk;
        }).on('end', () => {
            resolve(body);
        })
    });
}
export {getRequestData};