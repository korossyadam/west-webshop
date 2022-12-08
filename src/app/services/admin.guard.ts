import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AdminService } from './admin.service';
import { UtilsService } from './utils.service';

@Injectable({
   providedIn: 'root'
})
export class AdminGuard implements CanActivate {

   // Static functions
   getUserId = this.utilsService.getUserId;

   constructor(private utilsService: UtilsService, private adminService: AdminService, private router: Router) { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let userId = this.getUserId();

      if (userId == '') {
         this.router.navigateByUrl('/main');
         return false;
      } else {
         return new Observable(obsv => {
            this.adminService.getAdminId(userId).pipe(take(1)).subscribe(data => {
               if (data.length <= 0) {
                  this.router.navigateByUrl('/main');
                  obsv.next(false);
               } else {
                  obsv.next(true)
               }
            });
         });
      }
   }

}
