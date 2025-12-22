import { Component } from '@angular/core';
import {ReactiveFormsModule,FormBuilder,FormGroup,Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  RegisterErrors:string='';
  registerForm: FormGroup;

constructor(private fb: FormBuilder,private authService: AuthService,private messageService:MessageService,private router:Router) {
    this.registerForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z][a-zA-Z0-9]{5,}$/), // مثال: Abc123
        ],
      ],
    });
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }
showRegisterSuccess() {
 this.messageService.add({
        severity: 'success',
        summary: 'Account Created Successfully!',
        detail: 'Please check your inbox to activate your account.',
        life: 7000
      });
}
  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.authService.Register(formData).subscribe({
        next: (response) => {
          this.showRegisterSuccess();
          this.RegisterErrors='';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
          
         
        },
        error: (err) => {
          this.RegisterErrors = err.error.message;          
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }
  private markFormGroupTouched() {
    Object.values(this.registerForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
showPassword = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}
}
