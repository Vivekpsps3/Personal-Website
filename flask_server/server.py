from flask import Flask, request
from flask_socketio import SocketIO, emit
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import serialization

import os
import binascii
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Store client session data
client_sessions = {}

# 1. Generate Server ECC Key Pair
server_private_key = ec.generate_private_key(ec.SECP256R1())
server_public_key = server_private_key.public_key()

# Export the public key in raw format
server_public_key_bytes = server_public_key.public_bytes(
    encoding=serialization.Encoding.X962,
    format=serialization.PublicFormat.UncompressedPoint
)

@socketio.on("connect")
def handle_connect():
    logger.info(f"Client connected: {request.sid}")
    client_sessions[request.sid] = {"shared_key": None}

@socketio.on("disconnect")
def handle_disconnect():
    logger.info(f"Client disconnected: {request.sid}")
    if request.sid in client_sessions:
        del client_sessions[request.sid]

@socketio.on("exchange_keys")
def exchange_keys(client_public_key_hex):
    """Handles public key exchange over WebSocket"""
    try:
        logger.info(f"Received client public key: {client_public_key_hex[:20]}...")
        
        # Convert hex to bytes
        client_public_key_bytes = bytes.fromhex(client_public_key_hex)
        
        # Import client public key
        client_public_key = ec.EllipticCurvePublicKey.from_encoded_point(
            ec.SECP256R1(), 
            client_public_key_bytes
        )
        
        # Compute shared secret
        shared_secret = server_private_key.exchange(ec.ECDH(), client_public_key)
        
        # Derive symmetric key using SHA-256
        derived_key = shared_secret
        
        # Store the shared key in the client's session
        client_sessions[request.sid]["shared_key"] = derived_key
        
        # Send server public key to client
        logger.info("Sending server public key to client")
        emit("server_public_key", server_public_key_bytes.hex())
        
    except Exception as e:
        logger.error(f"Error in key exchange: {str(e)}")
        emit("error", {"message": "Key exchange failed"})

@socketio.on("encrypt_message")
def encrypt_message(data):
    """Encrypts messages sent by clients"""
    try:
        logger.info("Received encrypt_message request")
        plaintext = data["message"]
        shared_key_hex = data["shared_key"]
        shared_key = bytes.fromhex(shared_key_hex)
        
        # Generate a random IV
        iv = os.urandom(12)
        
        # Create an encryptor
        encryptor = Cipher(
            algorithms.AES(shared_key[:32]),  # Use first 32 bytes for AES-256
            modes.GCM(iv)
        ).encryptor()
        
        # Encrypt the plaintext
        ciphertext = encryptor.update(plaintext.encode()) + encryptor.finalize()
        
        # Get the tag
        tag = encryptor.tag
        
        logger.info("Message encrypted successfully")
        
        # Send the encrypted message back to the client
        result = {
            "iv": iv.hex(),
            "ciphertext": ciphertext.hex(), 
            "tag": tag.hex()
        }
        emit("encrypted_message", result)
        
    except Exception as e:
        logger.error(f"Error encrypting message: {str(e)}")
        emit("error", {"message": f"Encryption failed: {str(e)}"})

@socketio.on("decrypt_message")
def decrypt_message(data):
    """Decrypts messages for clients"""
    try:
        shared_key = bytes.fromhex(data["shared_key"])
        iv = bytes.fromhex(data["iv"])
        ciphertext = bytes.fromhex(data["ciphertext"])
        tag = bytes.fromhex(data["tag"])
        
        # Create a decryptor
        cipher = Cipher(
            algorithms.AES(shared_key[:32]),
            modes.GCM(iv, tag)
        )
        decryptor = cipher.decryptor()
        
        # Decrypt the ciphertext
        decrypted_message = decryptor.update(ciphertext) + decryptor.finalize()
        
        emit("decrypted_message", {"text": decrypted_message.decode()})
        
    except Exception as e:
        logger.error(f"Error decrypting message: {str(e)}")
        emit("error", {"message": f"Decryption failed: {str(e)}"})

if __name__ == "__main__":
    logger.info("Starting ECDH server on port 5000")
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
