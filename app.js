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

//mongose and mongo sandbox routes to understand how to connect to the db
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'new blog2',
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     });
//     blog.save()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch(err => {
//             console.log(err);
//         });
// })

// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//         .then(result => {
//             res.send(result)
//         })
//         .catch(err => console.log(err));
// })

// app.get('/single-blog', (req, res) => {
//     Blog.findById('60992b29917d5e3e98ebbf29')
//         .then(result => {
//             res.send(result)
//         })
//         .catch(err => console.log(err))
// })

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

//routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

//blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then(result => {
            res.render('index', { title: 'All Blogs', blogs: result })
        })
        .catch(err => console.log(err))
})

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
});

//redirect
app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

//404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});