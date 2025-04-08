import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
    console.log("Request came");
    var res: string = buildResponse(200, "OK");
    socket.write(res);
    socket.end();
});

function buildResponse(status: number, reason: string): string {
    const CRLF: string = "\r\n"
    const statusLine = `HTTP/1.1 ${status} ${reason}${CRLF}`;
    const headers = `${CRLF}`
    const body = "";
    var response = statusLine + headers + body;
    console.log("Returning Reponse")
    console.log(JSON.stringify({ response }))
    return response;
}

server.listen(4221, "localhost");
