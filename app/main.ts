import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
    socket.on("data", (reqData) => {

        var req = parseRequest(reqData.toString())
        console.log("Request came", req);

        var res: string
        if (req.path == "/" && req.httpMethod == "GET") {
            res = buildResponse(200, "OK");
        } else {
            res = buildResponse(404, "Not Found")
        }

        socket.write(res);
        socket.end();
    })


});


interface HttpRequest {
    httpMethod: string,
    path: string,
    headers: Map<String, String>,
    body: any

}
const CRLF: string = "\r\n"
function parseRequest(req: string): HttpRequest {
    var reqs = req.split(CRLF)
    var requestLine = reqs[0].split(" ")
    var headers: Map<String, String> = new Map();
    for (var i = 1; i < reqs.length - 2; i++) {
        var headerValue = reqs[i].split(":");
        headers.set(headerValue[0], headerValue[1])
    }
    var body = reqs[reqs.length - 1]
    return {
        httpMethod: requestLine[0],
        path: requestLine[1],
        headers,
        body
    }

}
function buildResponse(status: number, reason: string): string {

    const statusLine = `HTTP/1.1 ${status} ${reason}${CRLF}`;
    const headers = `${CRLF}`
    const body = "";
    var response = statusLine + headers + body;
    console.log("Returning Reponse")
    console.log(JSON.stringify({ response }))
    return response;
}

server.listen(4221, "localhost");
