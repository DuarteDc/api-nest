export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'development',
    port: +process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI,
});