import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { IConfirmEmail } from '../../Interfaces/IAuth';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule,RouterLink],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css',
})
export class ConfirmEmail implements OnInit {
  isSuccess = false;
  isError = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params=>{
 const token =params.get('token');
 const userId=params.get('userId');
  if (!token || !userId) {
      this.handleError('Invalid or missing confirmation link.');
      return;
    }
    this.authService.ConfirmEmail(token, userId).subscribe({
      next: () => {
        this.isSuccess = true;
        this.showToast('success', 'Welcome!', 'Your email has been confirmed.');
      },
      error: (err) => {
        this.isSuccess = false;
        this.handleError(err.error?.message || 'Confirmation failed. The link may be expired.');
      }
    });
    })
  }

  private handleError(message: string): void {
    this.isError = true;
    this.errorMessage = message;
    this.showToast('error', 'Failed', message);
  }
  

  private showToast(severity: 'success' | 'error', summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 2000 });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}