export default (dbHost, dbName, dbUser, dbPassword) => {
    return `Server=tcp:${dbHost};
    Initial Catalog=${dbName};
    User ID=${dbUser};
    Password=${dbPassword};
    Encrypt=True;`;
};