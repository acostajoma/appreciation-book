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
        interface Facebook {
            id : string;
            name: string;
            picture: {
                data : {
                    height: number;
                    is_silhouette: boolean,
                    url: string,
                    width: number
                }
            },
            email?:string
        }
    }
}

export {};
