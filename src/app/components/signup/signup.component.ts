import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, mergeMap, Subscription } from 'rxjs';
import { InviteModel } from 'src/app/models/invite.model';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  private subs: Subscription = new Subscription();

  hide = true;
  inviteInfo?: InviteModel & {ref: DocumentReference<InviteModel>}

  constructor(private loginService: LoginService, private auth: AngularFireAuth, private router: Router, private route: ActivatedRoute) {
  }
  
  ngOnInit(): void {
    this.subs.add(this.auth.authState.subscribe((user) => {
      if (user) {this.router.navigate(['/'])}
    }));

    this.subs.add(this.route.queryParams.pipe(filter(qp => qp['invite']), mergeMap(p => {
      const inviteCode = p['invite'];
      return this.loginService.getInviteInfo(inviteCode)
    })).subscribe(inf => {
      this.inviteInfo = {...inf.data()!, ref: inf.ref};
      this.signupForm.controls.email.setValue(this.inviteInfo?.email ?? "");
      this.signupForm.controls.name.setValue(this.inviteInfo?.name ?? "");
    }))
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  getErrorMessageEmail() {
    if (this.signupForm.get('email')?.hasError('required')) {
      return 'You must enter a value';
    }

      return this.signupForm.get('email')?.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessageName() {
    if (this.signupForm.get('name')?.hasError('required')) {
      return 'You must enter a name';
    }

    return this.signupForm.get('name')?.errors ? 'invalid' : '';
  }

  getErrorMessagePassword() {
    if (this.signupForm.get('password')?.hasError('required')) {
      return 'You must enter a password';
    }

    if (this.signupForm.get('password')?.hasError('minlength')) {
      return 'Minimum required length is 8'
    }

    return this.signupForm.get('password')?.errors ? 'invalid' : '';
  }

  onSubmit(value: Partial<{ name: string | null, email: string | null, password: string | null }>) {
    debugger;
    if (!!this.inviteInfo) {
      this.loginService.registerBasicUser(this.inviteInfo, value.password ?? "")
      return
    }
    this.loginService.register(value.name ?? "", value.email ?? "", value.password ?? "");   
  }

  goToPage(pageName: string){
    this.router.navigate([`${pageName}`]);
  }
}
