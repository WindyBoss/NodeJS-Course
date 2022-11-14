const http = require('http');

/*
* http - node internal lib, which helps to create server and serve the client requests 

& createServer - function that creates a server and 2 arguments (request and response)
^ request - request object:
1. Http Method
2. path params & query string
3. body (some data or file)
4. header (request additional information)
*/

const server = http.createServer((req, res) => {
    // console.log(req);

    const method = req.method;
    const pathParamsAndQuery = req.url;
    const headers = req.headers;
    console.log(method);
    console.log(pathParamsAndQuery);
    console.log(headers);
  

    let body = '';

    /*
    * Body can be very huge, so it is necessary to collect all body parts using event listener req.on() and later finish it by another req.on with res.end()
    */
    req.on('data', (chunk) => {
        body += chunk.toString(); // -> is necessary to make a string from it
    });

    req.on('end', () => {
        console.log("request", req);
        res.writeHead(200, {
            "Content-Type": "text/plain" // it is possible to create new header to response
        })
        res.end(body);
    });
});

server.listen(80, () => {
    console.log('started listening on port 80');
})