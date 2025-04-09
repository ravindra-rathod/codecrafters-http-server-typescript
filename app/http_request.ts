import { CRLF } from "./contants";
import { HttpHeaders } from "./http_header";

export interface HttpRequest {
    httpMethod: string,
    path: string,
    headers: HttpHeaders,
    body: any
}

export function parseRequest(req: string): HttpRequest {
    var reqs = req.split(CRLF)
    var requestLine = reqs[0].split(" ")
    var headers: HttpHeaders = new HttpHeaders();
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