import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})

/**
 * MovieCardComponent class
 *
 * This class is responsible for displaying movie cards and handling user interactions related to movies.
 */
export class MovieCardComponent implements OnInit {
  /**
   * An array of movies to be displayed.
   */
  movies: any[] = [];
  user = JSON.parse(localStorage.getItem('user') || '');
  userData = { username: '', favorites: [] };
  favorites: any[] = [];

  constructor(
    /**
     * Constructor for the MovieCardComponent class.
     *
     * @param fetchApiData - The service to fetch data from the API.
     * @param dialog - The service to handle dialogs.
     * @param snackBar - The service to display snack bars.
     */
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllMovies();
    this.getFavMovies();
  }

  /**
   * Function to get all movies from the database
   * @returns all movies
   */

  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
  /**
   * Function to open the director dialog
   * @param name - The name of the director
   * @param bio - The biography of the director
   * @param country - The country of the director
   * @param birthYear - The birth date of the director
   * @param deathYear - The death date of the director
   */
  openDirectorDialog(
    name: string,
    bio: string,
    country: string,
    birthYear: number,
    deathYear: number
  ): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        name: name,
        bio: bio,
        country: country,
        birthYear: birthYear,
        deathYear: deathYear,
      },
      width: '450px',
    });
  }
  /**
   * Function to open the genre dialog
   * @param type - The name of the genre
   * @param description - The description of the genre
   */
  openGenreDialog(type: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        type: type,
        description: description,
      },
      width: '450px',
    });
  }
  /**
   * Function to open the synopsis dialog
   * @param description - The description of the movie
   */
  openSynopsisDialog(description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        description: description,
      },
      width: '450px',
    });
  }
  /**
   * Function to get user's favorite movies
   * @returns user's favorite movies
   */
  getFavMovies(): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);

      this.userData.favorites = parsedUser.favorites;
      this.favorites = parsedUser.favorites;
    }
    console.log('Favorite Movies:', this.favorites);
  }
  /**
   * Function to check if a movie is in the user's favorite list
   * @param movie - The movie to check
   * @returns boolean - true if the movie is in the favorite list, false otherwise
   */
  isFav(movie: any): boolean {
    return this.favorites.includes(movie._id);
    // const MovieID = movie._id;
    // if (this.favorites.some((movie) => movie == MovieID)) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
  /**
   * Function to toggle a movie in the user's favorite list
   * @param movie - The movie to toggle
   */
  toggleFav(movie: any): void {
    console.log('toggleFav called with movie:', movie);
    const isFavorite = this.isFav(movie);
    console.log('isFavorite:', isFavorite);
    isFavorite ? this.deleteFavMovies(movie) : this.addFavMovies(movie);
  }
  /**
   * Function to add a movie to the user's favorite list
   * @param movie - The movie to add
   */
  addFavMovies(movie: any): void {
    console.log('addFavMovies called with movie:', movie);
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      console.log('user:', parsedUser);

      this.fetchApiData.addfavoriteMovies(movie._id).subscribe((Resp) => {
        console.log('server response:', Resp);
        localStorage.setItem('user', JSON.stringify(Resp));
        this.getFavMovies();
        this.snackBar.open(
          `${movie.title} has been added to your favorites`,
          'OK',
          {
            duration: 3000,
          }
        );
      });
    }
  }
  /**
   * Function to remove a movie from the user's favorite list
   * @param movie - The movie to remove
   */
  deleteFavMovies(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe((Resp) => {
        localStorage.setItem('user', JSON.stringify(Resp));
        this.getFavMovies();
        this.snackBar.open(
          `${movie.title} has been removed from your favorites`,
          'OK',
          {
            duration: 3000,
          }
        );
      });
    }
  }
}
