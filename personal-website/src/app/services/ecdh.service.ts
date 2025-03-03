import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class EcdhService {
  private socket: Socket;
  private sharedKey: Uint8Array | null = null;
  private privateKey!: CryptoKey;
  private publicKey!: CryptoKey;

  constructor() {
    this.socket = io('https://vivekpanchagnula.com/api/'); // Connect to Flask server
    this.generateEccKey();
  }

  // 1. Generate ECC Key Pair
  private async generateEccKey() {
    const keyPair = await window.crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey", "deriveBits"]
    );
    this.privateKey = keyPair.privateKey;
    this.publicKey = keyPair.publicKey;

    // Export Public Key
    const exportedKey = await window.crypto.subtle.exportKey("raw", this.publicKey);
    const clientPublicKeyHex = Array.from(new Uint8Array(exportedKey)).map(b => b.toString(16).padStart(2, '0')).join('');

    // Send to Server
    this.socket.emit("exchange_keys", clientPublicKeyHex);
    this.socket.on("server_public_key", (serverPublicKeyHex: string) => this.deriveSharedKey(serverPublicKeyHex));
  }

  // 2. Compute Shared Secret
  private async deriveSharedKey(serverPublicKeyHex: string) {
    const serverPublicKeyBytes = Uint8Array.from(serverPublicKeyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const serverPublicKey = await window.crypto.subtle.importKey(
      "raw",
      serverPublicKeyBytes,
      { name: "ECDH", namedCurve: "P-256" },
      true,
      []
    );

    const sharedSecret = await window.crypto.subtle.deriveBits(
      { name: "ECDH", public: serverPublicKey },
      this.privateKey,
      256
    );

    this.sharedKey = new Uint8Array(sharedSecret);
  }

  // 3. Encrypt Message
  async encryptMessage(plaintext: string) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const key = await window.crypto.subtle.importKey(
      "raw", 
      this.sharedKey!, 
      { name: "AES-GCM" }, 
      false, 
      ["encrypt"]
    );

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );
    
    // Convert to ArrayBuffer to array for display
    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));

    // Convert the shared key Uint8Array to hex string using browser-compatible method
    const sharedKeyHex = Array.from(this.sharedKey!)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    this.socket.emit("encrypt_message", {
      message: plaintext,
      shared_key: sharedKeyHex,
    });

    return { 
      iv: Array.from(iv), 
      ciphertext: encryptedArray 
    };
  }

  // 4. Decrypt Message
  async decryptMessage(encryptedData: any) {
    const { iv, ciphertext } = encryptedData;
    
    if (!iv || !ciphertext) {
      throw new Error("Missing required encryption data (IV or ciphertext)");
    }
    
    const key = await window.crypto.subtle.importKey(
      "raw", 
      this.sharedKey!, 
      { name: "AES-GCM" }, 
      false, 
      ["decrypt"]
    );

    try {
      // Convert arrays back to Uint8Arrays
      const ivArray = new Uint8Array(iv);
      const ciphertextArray = new Uint8Array(ciphertext);
      
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivArray },
        key,
        ciphertextArray
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  }
  
  // 5. Check if key exchange is complete
  isKeyExchangeComplete(): boolean {
    return this.sharedKey !== null;
  }
}
