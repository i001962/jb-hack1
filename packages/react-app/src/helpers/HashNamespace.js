export default function HashNamespace(user1, user2) {
    // Return the namespace that'll will be used for Gun. 
    // It hash the user1 eth key using user2's key as secret.
    const sha256Hasher = crypto.createHmac("sha256", user2);

    // hash the string
    const hash = sha256Hasher.update(user1).digest("base64");

    return hash;
}