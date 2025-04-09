import * as net from "net";
import { parseRequest } from "./http_request";
import { buildResponse, type HTTPResponse } from "./http_response";
import { url } from "inspector";
import { HttpHeaders } from "./http_header";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
    socket.on("data", (reqData) => {

        var req = parseRequest(reqData.toString())
        console.log("Request came", req);

        var res: HTTPResponse
        if (req.path.startsWith("/echo") && req.httpMethod == "GET") {
            var echoString = req.path.replace("/echo/", "")
            res = {
                statusCode: 200,
                reason: "OK",
                body: decodeURI(echoString),
                header: new HttpHeaders()
            }
        }
        if (req.path == "/user-agent" && req.httpMethod == "GET") {
            res = {
                statusCode: 200,
                reason: "OK",
                body: req.headers.get("User-Agent"),
                header: new HttpHeaders()
            }
        }
        else if (req.path == "/" && req.httpMethod == "GET") {
            res = {
                statusCode: 200,
                reason: "OK",
                header: new HttpHeaders()
            }
        } else {
            res = { statusCode: 404, reason: "Not Found", header: new HttpHeaders() }
        }

        socket.write(buildResponse(res));
        socket.end();
    })


});

server.listen(4221, "localhost");
