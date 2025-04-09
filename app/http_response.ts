import { isUint8Array } from "util/types";
import { CRLF } from "./contants";
import type { HttpHeaders } from "./http_header";

export interface HTTPResponse {
    statusCode: number,
    reason: string
    body?: any,
    header: HttpHeaders
}


export function buildResponse(res: HTTPResponse): string {
    const body = processResponseBody(res.body);
    const statusLine = `HTTP/1.1 ${res.statusCode} ${res.reason}${CRLF}`;
    const headers = buildDefaultHeader(body, res.header);

    const headersStr = `${headers.getHeadersString()}${CRLF}${CRLF}`


    var response = statusLine + headersStr + body;
    console.log("Returning Reponse")
    console.log(JSON.stringify({ response }))
    return response;
}

function processResponseBody(resbody: any): any {
    var res = resbody ?? ""
    if (typeof (res) == "string") {
        res = res.trim()
    }
    return res
}

function buildDefaultHeader(res: any, headers: HttpHeaders): HttpHeaders {
    var conenteType = ""
    var contentLength: number = 0;
    if (typeof (res) == "string") {
        contentLength = res.length
        conenteType = "text/plain"
    } else if (isUint8Array(res)) {
        contentLength = res.length
        conenteType = "application/octet-stream"
    }


    headers.set("Content-Length", contentLength.toString())
    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", conenteType)
    }

    return headers;
}