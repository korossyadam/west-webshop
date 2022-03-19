import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public isSignedIn = false;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    if(localStorage.getItem('user') == null)
      this.isSignedIn = false;
    else
      this.isSignedIn = true;
  }

  async signIn(email: string, password: string){
    console.log("...............");
    await this.authService.signIn(email, password);
    
    if(this.authService.isLoggedIn)
      this.isSignedIn = true;
  }

  async signUp(email: string, password: string){
    console.log("SIGNZP");
    await this.authService.signUp(email, password);
    
    if(this.authService.isLoggedIn)
      this.isSignedIn = true;
  }

  handleLogout(){
    this.isSignedIn = false;
  }

}
