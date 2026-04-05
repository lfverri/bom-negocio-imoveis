declare const _default: () => {
    database: {
        url: string | undefined;
    };
    web: {
        url: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    mail: {
        host: string | undefined;
        port: string;
        user: string | undefined;
        pass: string | undefined;
        from: string;
        resetUrl: string;
    };
    sicoob: {
        baseUrl: string | undefined;
        token: string | undefined;
    };
};
export default _default;
