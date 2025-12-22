import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, ToastModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  LoginErrors = '';
  LoginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private rout:ActivatedRoute
  ) {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z0-9]{5,}$/)]],
    });
  }

  get email() { return this.LoginForm.get('email'); }
  get password() { return this.LoginForm.get('password'); }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.LoginErrors = '';
    if (this.LoginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.authService.Login(this.LoginForm.value).subscribe({
      next: () => {
        this.showLoginSuccess();
        this.LoginErrors = '';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (err) => {
        console.error(err.error.message);
        this.LoginErrors = err.error?.message || 'Invalid email or password.';
      }
    });
  }

  private markFormGroupTouched() {
    Object.values(this.LoginForm.controls).forEach(control => control.markAsTouched());
  }

  showLoginSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Login Successful!',
      detail: 'Welcome back to Ventro!',
      life: 5000
    });
  }

  googleLogin() {
  this.authService.loginWithGoogle();
}

facebookLogin() {
  this.authService.LoginWithFacebook();
}


}