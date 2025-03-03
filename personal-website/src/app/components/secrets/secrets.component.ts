import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EcdhService } from '../../services/ecdh.service';

@Component({
  selector: 'app-secrets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './secrets.component.html',
  styleUrl: './secrets.component.css'
})
export class SecretsComponent implements OnInit {
  
  decryptedMessage: string = '';
  encryptedData: any = null;
  message: string = '';
  isEncrypting: boolean = false;
  isDecrypting: boolean = false;
  errorMessage: string = '';
  keyExchangeComplete: boolean = false;
  
  constructor(private router: Router, private ecdhService: EcdhService) { }
  
  ngOnInit(): void {
    // Check if key exchange is already complete
    setTimeout(() => {
      this.keyExchangeComplete = this.ecdhService.isKeyExchangeComplete();
      if (!this.keyExchangeComplete) {
        this.errorMessage = "Establishing secure connection...";
      }
    }, 1000);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  async encryptMessage() {
    if (!this.message) {
      this.errorMessage = "Please enter a message to encrypt";
      return;
    }
    
    this.isEncrypting = true;
    this.errorMessage = '';
    
    try {
      this.encryptedData = await this.ecdhService.encryptMessage(this.message);
      this.decryptedMessage = ''; // Clear any previous decrypted message
      console.log('Encryption successful:', this.encryptedData);
    } catch (error: any) {
      console.error('Encryption failed:', error);
      this.errorMessage = `Encryption failed: ${error.message || error}`;
    } finally {
      this.isEncrypting = false;
    }
  }

  async decryptMessage() {
    if (!this.encryptedData) {
      this.errorMessage = "No encrypted data to decrypt";
      return;
    }
    
    this.isDecrypting = true;
    this.errorMessage = '';
    
    try {
      this.decryptedMessage = await this.ecdhService.decryptMessage(this.encryptedData);
      console.log('Decryption successful:', this.decryptedMessage);
    } catch (error: any) {
      console.error('Decryption failed:', error);
      this.errorMessage = `Decryption failed: ${error.message || error}`;
      this.decryptedMessage = '';
    } finally {
      this.isDecrypting = false;
    }
  }
  
  // Helper method to display ciphertext in a readable format
  displayCiphertext(): string {
    if (!this.encryptedData?.ciphertext || !this.encryptedData.ciphertext.length) {
      return 'No ciphertext available';
    }
    
    // Show first few bytes followed by ellipsis if it's long
    const prefix = this.encryptedData.ciphertext.slice(0, 20).join(',');
    return this.encryptedData.ciphertext.length > 20 
      ? `${prefix}... (${this.encryptedData.ciphertext.length} bytes)` 
      : prefix;
  }
}

