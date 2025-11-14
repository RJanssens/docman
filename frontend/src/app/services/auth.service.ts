import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from '../models/document.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  private authConfig: AuthConfig = {
    issuer: 'http://localhost:8180/realms/docman',
    redirectUri: window.location.origin,
    clientId: 'docman-frontend',
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: true,
    requireHttps: false
  };

  constructor(
    private oauthService: OAuthService,
    private http: HttpClient
  ) {
    this.configureOAuth();
  }

  private configureOAuth(): void {
    this.oauthService.configure(this.authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        this.isAuthenticatedSubject.next(true);
        this.loadUserProfile();
      }
    });

    // Automatically refresh token
    this.oauthService.setupAutomaticSilentRefresh();
  }

  public login(): void {
    this.oauthService.initCodeFlow();
  }

  public logout(): void {
    this.oauthService.logOut();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  public getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  public isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  private loadUserProfile(): void {
    this.http.get<UserInfo>(`${this.apiUrl}/auth/user`).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
      }
    });
  }

  public getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/auth/user`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }
}
