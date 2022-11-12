import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from '@firebase/util';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subs: Subscription = new Subscription();

  hide = true;

  constructor(private loginService: LoginService, private auth: AngularFireAuth, private router: Router) {
  }
  
  ngOnInit(): void {
    this.subs.add(this.auth.authState.subscribe((user) => {
      if (user) {this.router.navigate(['/'])}
    }));
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  getErrorMessageEmail() {
    if (this.loginForm.get('email')?.hasError('required')) {
      return 'Adja meg az email címét.';
    }

      return this.loginForm.get('email')?.hasError('email') ? 'Nem helyes formátum.' : '';
  }

  getErrorMessagePassword() {
    if (this.loginForm.get('password')?.hasError('required')) {
      return 'Adja meg a jelszavát.';
    }

    return this.loginForm.get('password')?.errors ? 'invalid' : '';
  }

  onSubmit(value: Partial<{ email: string | null; password: string | null; }>) {
    this.loginService.login(value.email ?? "", value.password ?? "");
  }

  goToPage(pageName: string){
    this.router.navigate([`${pageName}`]);
  }
}