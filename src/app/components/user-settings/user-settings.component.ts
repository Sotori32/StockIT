import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FirebaseError } from 'firebase/app';
import { catchError } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login/login.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  hide = true;
  isAuthError = false;

  constructor(private userService: UserService, private loginService: LoginService) { }

  public user: UserModel | undefined = undefined;

  ngOnInit(): void {
    this.userService.getUserInfoSync().subscribe(user => {
      this.user = user.payload.doc.data()
    })
  }

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  }, {
    validators: [this.checkPasswords('newPassword', 'confirmNewPassword')]
  })

  checkPasswords(pass: string, confPass: string) {
    return function (group: any) {
      let passValue = group!.get(pass).value;
      let confirmPassValue = group.get(confPass).value

      if (passValue === confirmPassValue) {
        return null;
      }
      return { 'passwordsNotMatch': true }
    }
  }

  public async changePassword(value: Partial<{ currentPassword: string | null, newPassword: string | null }>) {
    if (this.user?.email) {
      try {
        await this.loginService.changePassword(this.user.email, value.currentPassword!, value.newPassword!)
      } catch (error) {
        console.log(error)
        this.isAuthError = true;
        debugger; 
      }
    }
  }

  getErrorMessagePassword() {
    if (this.changePasswordForm.get('password')?.hasError('required')) {
      return 'You must enter a password';
    }

    if (this.changePasswordForm.get('password')?.hasError('minlength')) {
      return 'Minimum required length is 8'
    }

    return this.changePasswordForm.get('password')?.errors ? 'invalid' : '';
  }

}
