import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
import usersJSON from './mocks/users.json';
import { IUser } from '../interfaces/user.interface';
import { inject } from '@angular/core'
import { AuthService } from '../services/auth.service'

export const AppHttpInterceptorService: HttpInterceptorFn = (request, next) => {
  const { url, method, headers, body } = request;
  let users: IUser[] = usersJSON as IUser[];

  const authService = inject(AuthService);

  if (!url || !method) {
    return error('Invalid request');
  }

  return handleRoute();

  function handleRoute(): Observable<HttpEvent<any>> {
    switch (true) {
      case url.endsWith('/users') && method === 'GET':
        return getUsers();
      case url.endsWith('/users') && method === 'POST':
        return createUser();
      case url.match(/\/users\/\d+$/) && method === 'GET':
        return getUserById();
      case url.match(/\/users\/\d+$/) && method === 'PUT':
        return updateUser();
      case url.match(/\/users\/\d+$/) && method === 'DELETE':
        return deleteUser();
      default:
        return next(request);
    }
  }

  function getUsers(): Observable<HttpEvent<any>> {
    if (!isLoggedIn()) {
      authService.setUserLoggedIn(false);
    } else {
      authService.setUserLoggedIn(true);
    }

    return ok(users.map((x) => basicDetails(x)));
  }

  function getUserById(): Observable<HttpEvent<any>> {
    if (!isLoggedIn()) {
      authService.setUserLoggedIn(false);
    } else {
      authService.setUserLoggedIn(true);
    }

    const userId = idFromUrl();
    const user = users.find(x => x.id === userId);

    if (!user) {
      return error('User not found!');
    }

    return ok(basicDetails(user));
  }

  function createUser(): Observable<HttpEvent<any>> {
    if (!isLoggedIn()) {
      authService.setUserLoggedIn(false);
    } else {
      authService.setUserLoggedIn(true);
    }

    const user = body as IUser;

    if (!user) {
      return error('User data is empty!');
    }

    if (users.find(x => x.username.trim() === user.username.trim())) {
      return error('Username "' + user.username + '" is already taken')
    }

    user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
    users.push(user);

    return ok(basicDetails(user));
  }

  function updateUser(): Observable<HttpEvent<any>> {
    if (!isLoggedIn()) {
      authService.setUserLoggedIn(false);
    } else {
      authService.setUserLoggedIn(true);
    }

    const params = body as Partial<IUser>; // Ensure body is properly typed
    const userId = idFromUrl();
    const user = users.find(x => x.id === userId);

    if (!user) {
      return error('User not found!');
    }

    Object.assign(user, params);

    return ok(basicDetails(user));
  }

  function deleteUser() {
    if (!isLoggedIn()) {
      authService.setUserLoggedIn(false);
    } else {
      authService.setUserLoggedIn(true);
    }

    users = users.filter(x => x.id !== idFromUrl());

    return ok();
  }

  // Helper functions

  function ok(body?: any): Observable<HttpEvent<any>> {
    return of(new HttpResponse({ status: 200, body }))
    .pipe(delay(500)); // Simulate server delay
  }

  function error(message: string): Observable<never> {
    return throwError(() => new HttpErrorResponse({ error: message, status: 403 }));
  }

  function basicDetails(user: IUser): IUser {
    const { id, username, firstName, lastName, password, email, type } = user;
    return { id, username, firstName, lastName, password, email, type };
  }

  function idFromUrl(): number {
    const urlParts = url.split('/');
    const id = parseInt(urlParts[urlParts.length - 1], 10);
    if (isNaN(id)) {
      throw new Error('Invalid user ID');
    }
    return id;
  }

  function isLoggedIn(): boolean {
    return headers.get('Authorization') === 'Bearer fake-jwt-token';
  }
};
