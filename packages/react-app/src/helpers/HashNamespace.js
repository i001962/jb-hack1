import "crypto";

export default function HashNamespace (string) {
    return window.btoa(string);
}