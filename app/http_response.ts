import { isUint8Array } from "util/types";
import { CRLF } from "./contants";
import { ContentType, Header,  HttpHeaders } from "./http_header";
import type { HttpRequest } from "./http_request";

export interface HTTPResponse {
    statusCode: number,
    reason: string
    body?: any,
    header: HttpHeaders
}

function hexdump (data: Uint8Array, bytesPerLine = 16): string {
    const hex = Array.from(data, byte => byte.toString(16))
    .join(' ')
    return hex;
  }

export function buildResponse(res: HTTPResponse, req: HttpRequest): string {
    var body = processResponseBody(res.body);
    const statusLine = `HTTP/1.1 ${res.statusCode} ${res.reason}${CRLF}`;
    const headers = res.header;
    if(req.headers.get(Header.Accept_Encoding)?.includes("gzip")){
        headers.set(Header.Content_Encoding,"gzip")
        const data = Buffer.from(body);
        const compressedBody = Bun.gzipSync(body,{
        });
        body = hexdump(compressedBody)
        headers.set(Header.Content_Length,compressedBody.length.toString())

    }
    buildDefaultHeader(body, headers)
    console.log("headrs ==> ",headers)
    const headersStr = `${headers.getHeadersString()}${CRLF}${CRLF}`


    var response = statusLine + headersStr + body;
    console.log("Returning Reponse")
    console.log(response)
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
        conenteType = ContentType.text_plain
    } 
    // else if (isUint8Array(res)) {
    //     contentLength = res.length
    //     conenteType = ContentType.application_octet_stream
    // }


    if (!headers.has(Header.Content_Type)) {
        headers.set(Header.Content_Type, conenteType)
    }
    if (!headers.has(Header.Content_Length)) {
        headers.set(Header.Content_Length, contentLength.toString())
    }

    return headers;
}