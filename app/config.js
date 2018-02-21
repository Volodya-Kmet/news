const config = {
        database: {
            host: '127.0.0.1',
            port: 27017,
            db: 'news'
        },
        server: {
            host: '127.0.0.1',
            port: 8800
        },
        API: {
            key: '27c459eea11f4adc852261ed2f4cb121',
            endpoint: 'https://newsapi.org/v2/'
        }
    }

module.exports = config;