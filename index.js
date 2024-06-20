const app = (await import('./app.js')).default;

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

// eslint-disable-next-line no-console
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
