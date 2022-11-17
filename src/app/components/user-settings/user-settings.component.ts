import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseError } from 'firebase/app';
import { catchError, Subscription } from 'rxjs';
import { InviteDisplayModel, InviteModel } from 'src/app/models/invite.model';
import { UserDisplayModel, UserModel } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login/login.service';
import { UserService } from 'src/app/services/user/user.service';
import { InviteUserComponent } from './invite-user/invite-user.component';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  hide = true;
  isAuthError = false;

  constructor(private userService: UserService, private loginService: LoginService, private dialog: MatDialog) { }

  public subs: Subscription = new Subscription();

  public user: UserModel | undefined = undefined;
  public users: UserDisplayModel[] = [];
  public invites: InviteDisplayModel[] = [];

  displayedColumns = [
    'name',
    'email',
    'actions'
  ]

  displayedColumnsInvite = [
    'name',
    'email',
    'link',
    'actions'
  ]

  ngOnInit(): void {
    this.subs.add(this.userService.getUserInfoSync().subscribe(user => {
      this.user = user.payload.doc.data()
    }))

    this.subs.add(this.userService.getUsersSync().subscribe(users => {
      this.users = users.map(user => {
        const userData = user.data();

        return {
          documentId: user.id,
          email: userData.email,
          id: userData.id,
          isOwnder: userData.isOwner,
          name: userData.name
        } as UserDisplayModel

      })
    }))

    this.subs.add(this.userService.getInvitesSync().subscribe(invites => {
      this.invites = invites.map(invite => {
        const inviteData = invite.payload.doc.data()

        return {
          email: inviteData.email,
          id: invite.payload.doc.id,
          link: `${document.location.origin}/signup?invite=${invite.payload.doc.id}`,
          name: inviteData.name
        } as InviteDisplayModel

      })
    }))
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

  public getErrorMessagePassword() {
    if (this.changePasswordForm.get('password')?.hasError('required')) {
      return 'You must enter a password';
    }

    if (this.changePasswordForm.get('password')?.hasError('minlength')) {
      return 'Minimum required length is 8'
    }

    return this.changePasswordForm.get('password')?.errors ? 'invalid' : '';
  }

  public openInviteUserDialog() {
    this.dialog.open(InviteUserComponent)
  }

  public deleteUser(documentId: string) {
    this.userService.deleteUser(documentId)
  }

  public deleteInvite(documentId: string) {
    this.userService.deleteInvite(documentId)
  }

}
