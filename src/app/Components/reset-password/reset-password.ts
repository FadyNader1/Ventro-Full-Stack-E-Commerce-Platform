import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../Services/auth-service';
import { IResetPassword } from '../../Interfaces/IAuth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ToastModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  errorMessage = '';
  showPassword = false;

  // مُهيأ من البداية
  resetParams: IResetPassword = { email: '', token: '', newPassword: '' };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!email || !token) {
      this.errorMessage = 'Invalid or missing reset link.';
      return;
    }

    // الآن آمن: الكائن مُهيأ
    this.resetParams.email = email;
    this.resetParams.token = token;

    // إنشاء الفورم
    this.resetForm = this.fb.group(
      {
        newPassword: ['', [
          Validators.required,
          Validators.pattern(/^[A-Z][a-zA-Z0-9]{5,}$/)
        ]],
        confirmPassword: ['', [
          Validators.required,
          Validators.pattern(/^[A-Z][a-zA-Z0-9]{5,}$/)
        ]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  passwordMatchValidator = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  showResetPasswordSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Your password has been reset successfully!'
    });
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.resetParams.email || !this.resetParams.token) {
      return;
    }

    this.errorMessage = '';

    const payload: IResetPassword = {
      newPassword: this.resetForm.value.newPassword,
      token: this.resetParams.token,
      email: this.resetParams.email
    };

    this.authService.ResetPassword(payload).subscribe({
      next: () => {
        this.showResetPasswordSuccess();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);

        
      },
      error: (err) => {
        if( err.error?.message)
         this.errorMessage ='Failed to reset password. Link may be expired.';
        console.error('Reset Password Error:', err);
      }
    });
  }
}