import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// Import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// Import to bring in the API call created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// Import to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
/**
 * Component for user login form.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { username: '', password: '' };
  /**
   * Constructs the UserLoginFormComponent.
   * @param fetchApiData - The service for fetching API data.
   * @param dialogRef - The reference to the dialog.
   * @param snackBar - The service for showing snack bar notifications.
   * @param router - The Angular router.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Angular's OnInit lifecycle hook.
   */
  ngOnInit(): void {}

  /**
   * Logs in a user.
   * Sends the user data to the backend and handles the response.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        //Logic for a successful user login
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close(); // Will close modal on success
        this.snackBar.open('User login successful', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies']);
      },
      (result) => {
        this.snackBar.open('User login failed', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
