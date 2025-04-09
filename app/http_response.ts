import { CRLF } from "./contants";
import type { HttpHeaders } from "./http_header";

export interface HTTPResponse {
    statusCode: number,
    reason: string
    body?: any,
    header: HttpHeaders
}


export function buildResponse(res: HTTPResponse): string {

    const statusLine = `HTTP/1.1 ${res.statusCode} ${res.reason}${CRLF}`;
    const headers = buildDefaultHeader(res.body, res.header);

    const headersStr = `${headers.getHeadersString()}${CRLF}${CRLF}`
    const body = res.body ?? "";

    var response = statusLine + headersStr + body;
    console.log("Returning Reponse")
    console.log(JSON.stringify({ response }))
    return response;
}

function buildDefaultHeader(res: any, headers: HttpHeaders): HttpHeaders {
    var conenteType = ""
    var contentLength: number = 0;
    if (typeof (res) == "string") {
        contentLength = res.length
        conenteType = "text/plain"
    }

    headers.set("Content-Length", contentLength.toString())
    headers.set("Content-Type", conenteType)
    return headers;
}