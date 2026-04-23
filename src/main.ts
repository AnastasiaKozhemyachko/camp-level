import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app/app.component';

normalizeLegacyHashRoutes();

bootstrapApplication(AppComponent, appConfig)
  .catch((err: unknown) => console.error(err));

function normalizeLegacyHashRoutes(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const legacyHashRoutes: Record<string, string> = {
    '#sender': '#/sender',
    '#receiver': '#/'
  };

  const normalizedHash = legacyHashRoutes[window.location.hash];

  if (normalizedHash) {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}${normalizedHash}`
    );
  }
}

