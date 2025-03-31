import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  public usuarioLogado = false;

  constructor(private router: Router,
              private accountService: AccountService) {

  router.events.subscribe(
    (val) => {
      if(val instanceof NavigationEnd) {
        this.accountService.currentUser$.subscribe(
          (value) => this.usuarioLogado = value != null
        )
        console.log(this.usuarioLogado);
      }
    }
  )

  }
              

  ngOnInit(): void {
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }

}
