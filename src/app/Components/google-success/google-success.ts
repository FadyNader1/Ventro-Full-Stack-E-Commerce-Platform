import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-google-success',
  imports: [CommonModule, RouterModule, ToastModule],
  templateUrl: './google-success.html',
  styleUrl: './google-success.css'
})
export class GoogleSuccess implements OnInit {
  displayName: string = '';
constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token=this.route.snapshot.queryParamMap.get('token');
    const refreshToken=this.route.snapshot.queryParamMap.get('refreshToken');
    if(token && refreshToken){
      localStorage.setItem('Token',token);
      localStorage.setItem('RefreshToken',refreshToken);
    }
   
     this.authService.getCurrentUser().subscribe(
       (user) => {
        this.displayName=user.displayName
         this.messageService.add({
      severity: 'success',
      summary: 'Welcome!',
      detail: `Hi ${this.displayName}, you're signed in with Google!`,
      life: 3000
    });
        //setTimeout(() => this.goToHome(), 5000);
       },
       (err) => console.log(err)
     );
   

     }

  goToHome(): void {
    this.router.navigate(['/home']); // أو ['/dashboard']
  }
}
