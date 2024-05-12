// Import necessary modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
/**
 * NavbarComponent class
 *
 * This class is responsible for handling the navigation bar and user interactions related to navigation.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  /**
   * Constructor for the NavbarComponent class.
   *
   * @param snackBar - The service to display snack bars.
   * @param router - The service to handle routing.
   */
  constructor(public snackBar: MatSnackBar, public router: Router) {}

  // ngOnInit lifecycle hook
  ngOnInit(): void {}

  /**
   * Function to navigate to the movies page.
   */
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Function to navigate to the profile page.
   */
  public openProfile(): void {
    this.router.navigate(['profile']);
  }
  /**
   * Function to log out the user.
   *
   * This function clears the token and user data from the browser's local storage, displays a notification, and redirects the user to the welcome page.
   */
  public logoutUser(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.snackBar.open('You have been logged out', 'OK', {
      duration: 2000,
    });
    this.router.navigate(['welcome']);
  }
}
