import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
   providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

   // Static functions
   getEmail = this.utilsService.getEmail;

   constructor(private utilsService: UtilsService, private router: Router) { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      let isLoggedIn: boolean = false;
      if (this.getEmail() != '')
         isLoggedIn = true;

      if (isLoggedIn) {
         return true;
      } else {
         this.router.navigate(['/login']);
         return false;
      }
   }
}
