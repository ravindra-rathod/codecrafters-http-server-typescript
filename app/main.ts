import * as net from "net";
import { parseRequest } from "./http_request";
import { buildResponse, type HTTPResponse } from "./http_response";
import { url } from "inspector";
import { ContentType, Header, HttpHeaders } from "./http_header";
import path from "path";
import { file } from "bun";
import { isUint8Array } from "util/types";
import { StringDecoder } from "string_decoder";
// You can use print statements as follows for debugging, they'll be visible when running tests.
var args = process.argv
const storageDir = args[3]
console.log("Logs from your program will appear here!", storageDir);


const server = net.createServer((socket) => {
    socket.on("data", async (reqData) => {

        var req = parseRequest(reqData.toString())
        console.log("Request came", req);

        var res: HTTPResponse
        if (req.path.startsWith("/files") && req.httpMethod == "POST") {
            var filename = decodeURI(req.path.replace("/files/", ""))
            var file = Bun.file(`${storageDir}/${filename}`)
            await Bun.write(file, req.body)
            res = {
                statusCode: 201,
                reason: "Created",
                header: new HttpHeaders()
            }
        }
        else if (req.path.startsWith("/files") && req.httpMethod == "GET") {
            var filename = decodeURI(req.path.replace("/files/", ""))
            var file = Bun.file(`${storageDir}/${filename}`)

            if (await file.exists()) {

                var content = await file.text()
                var header = new HttpHeaders();
                header.set(Header.Content_Type, ContentType.application_octet_stream)
                res = {
                    statusCode: 200,
                    reason: "OK",
                    body: content,
                    header: header
                }
            } else {
                res = { statusCode: 404, reason: "Not Found", header: new HttpHeaders() }
            }

        } else if (req.path.startsWith("/echo") && req.httpMethod == "GET") {
            var echoString = req.path.replace("/echo/", "")
            res = {
                statusCode: 200,
                reason: "OK",
                body: decodeURI(echoString),
                header: new HttpHeaders()
            }
        } else if (req.path == "/user-agent" && req.httpMethod == "GET") {
            res = {
                statusCode: 200,
                reason: "OK",
                body: req.headers.get(Header.User_Agent),
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

        socket.write(buildResponse(res,req));
        socket.end();
    })


});

server.listen(4221, "localhost");
