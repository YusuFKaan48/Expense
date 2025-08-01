/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/drawer/Category`; params?: Router.UnknownInputParams; } | { pathname: `/drawer/Home`; params?: Router.UnknownInputParams; } | { pathname: `/profile/Profile`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/drawer/Category`; params?: Router.UnknownOutputParams; } | { pathname: `/drawer/Home`; params?: Router.UnknownOutputParams; } | { pathname: `/profile/Profile`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/drawer/Category${`?${string}` | `#${string}` | ''}` | `/drawer/Home${`?${string}` | `#${string}` | ''}` | `/profile/Profile${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/drawer/Category`; params?: Router.UnknownInputParams; } | { pathname: `/drawer/Home`; params?: Router.UnknownInputParams; } | { pathname: `/profile/Profile`; params?: Router.UnknownInputParams; };
    }
  }
}
