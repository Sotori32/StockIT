import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from './services/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'StockIT';
  private subs: Subscription = new Subscription();

  constructor(private auth: AngularFireAuth, private router: Router) {
  }
  
  ngOnInit(): void {
    this.subs.add(this.auth.authState.subscribe(user => {
      if (!user && !this.router.url.match('/signup')) {this.router.navigate(['/login'])}
    }));
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
