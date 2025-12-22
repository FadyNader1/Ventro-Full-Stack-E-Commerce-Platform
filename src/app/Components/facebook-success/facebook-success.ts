import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-facebook-success',
  imports: [CommonModule, RouterModule, ToastModule],
  templateUrl: './facebook-success.html',
  styleUrl: './facebook-success.css',

})
export class FacebookSuccess implements OnInit {
  displayName: string = '';
constructor( private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute){}

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
      detail: `Hi ${this.displayName}, you're signed in with Facebook!`,
      life: 2000
    });
       // setTimeout(() => this.goToHome(), 5000);

       },
       (err) => console.log(err)
     );
   

     }

  goToHome(): void {
    this.router.navigate(['/home']); // أو ['/dashboard']
  }
}
