const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

//express app
const app = express();

//connect to mongoDB Atlas and start listening for requests after connection established
const dbURI = 'mongodb+srv://mellyynda:user123456@nodetuts.82blk.mongodb.net/note-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(5000))
    .catch(err => console.log(err));

// middleware and static files
app.use(express.static('public'));
app.use(morgan('dev'));

//mongose and mongo sandbox routes
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog2',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });
    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch(err => {
            console.log(err);
        });
})

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then(result => {
            res.send(result)
        })
        .catch(err => console.log(err));
})

app.get('/single-blog', (req, res) => {
    Blog.findById('60992b29917d5e3e98ebbf29')
        .then(result => {
            res.send(result)
        })
        .catch(err => console.log(err))
})
//middleware example
// app.use((req, res, next) => {
//     console.log("new request made");
//     console.log("path: ", req.path);
//     console.log("host: ", req.hostname);
//     console.log("method", req.method);
//     next();
// });

//register view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    //res.send("<p>home page</p>");
    //res.sendFile('./views/index.html', { root: __dirname });
    const blogs = [
        { title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur' },
        { title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur' },
        { title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    ];
    res.render('index', { title: 'Home', blogs });
});
app.use((req, res, next) => {
    console.log("in the next middleware");
    next();
})

app.get('/about', (req, res) => {
    //res.send("<p>about page</p>");
    //res.sendFile('./views/about.html', { root: __dirname });
    res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
});

//redirect
app.get('/about-us', (req, res) => {
    //res.send("<p>about page</p>");
    res.redirect('/about');
});

//404 page
app.use((req, res) => {
    //res.status(404).sendFile('./views/404.html', { root: __dirname });
    res.status(404).render('404', { title: '404' });
});