import { CRLF } from "./contants";

export class HttpHeaders extends Map<String, String> {

    getHeadersString(): string {
        console.log("headerString =====================>", this.entries())
        return this.entries().map<string>((e, i) => `${e[0]}:${e[1]}`).toArray().join(CRLF);
    }
}

export const Header = {
    Accept_Encoding:"Accept-Encoding",
    Content_Encoding:"Content-Encoding",
    Content_Length:"Content-Length",
    Content_Type:"Content-Type",
    User_Agent:"User-Agent"
}

export const ContentType = {
    text_plain:"text/plain",
    application_octet_stream:"application/octet-stream"
}