declare global {
    namespace User {
        interface Google {
            sub: string,
            name: string,
            given_name: string,
            family_name: string,
            picture: string,
            email:string,
            email_verified: boolean
        }
    }
}

export {};
