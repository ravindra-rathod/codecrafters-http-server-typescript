import { CRLF } from "./contants";

export class HttpHeaders extends Map<String, String> {

    getHeadersString(): string {
        return this.entries().map<string>((e, i) => `${e[0]}:${e[1]}`).toArray().join(CRLF);
    }
}
