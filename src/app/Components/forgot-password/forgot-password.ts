import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, ToastModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  forgotForm: FormGroup;
  errorMessage = '';
  isSuccess = false;
  isResending = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotForm.get('email');
  }

  // === Toast Messages ===
  private showToast(severity: 'success' | 'error', summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  private showForgotPasswordSuccess(): void {
    this.showToast('success', 'Check Your Email!', 'We sent a password reset link to your inbox.');
  }

  private showResendSuccess(): void {
    this.showToast('success', 'Resent!', 'A new reset link has been sent.');
  }

  private showResendFailed(): void {
    this.showToast('error', 'Failed', 'Could not resend. Please try again.');
  }

  // === Submit Form ===
  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    const email = this.email?.value;

    this.errorMessage = '';
    this.isSuccess = false;

    this.authService.ForgotPassword(email).subscribe({
      next: () => {
        this.isSuccess = true;
        this.showForgotPasswordSuccess();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to send reset link. Please try again.';
      }
    });
  }

  // === Resend Email ===
  onResend(): void {
    const email = this.email?.value;
    if (!email) return;

    this.isResending = true;

    this.authService.ForgotPassword(email).subscribe({
      next: () => {
        this.isResending = false;
        this.showResendSuccess();
      },
      error: () => {
        this.isResending = false;
        this.showResendFailed();
      }
    });
  }
}