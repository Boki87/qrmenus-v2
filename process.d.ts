declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_APP_URL: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    DATABASE_URL: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
  }
}
