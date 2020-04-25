const express = require('express');
const app = express();
const mysql = require('mysql');
const isEmpty = require('is-empty');

/**
 * Build mysql Connection
 * @type {Connection}
 */
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'umch!@#$',
    database: 'blog_post'
});
conn.connect();

// Routes To Server Request
app.get('/', function (req, res) {
    res.json([{'APP': 'App Working'}]);
});

/**
 * return Top Posts with most no of comments
 */
app.get('/topPosts', function (req, res) {
    conn.query(`SELECT posts.id AS post_id, posts.title AS post_title, posts.body AS post_body ,
                     count(posts.id) as total_number_of_comments 
                     FROM posts JOIN comments 
                    WHERE posts.id = comments.postId GROUP BY posts.id
                    ORDER BY total_number_of_comments DESC`,
        function (err, result) {

            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                //console.log('topPosts Result : ', result);
                res.json(result);
            }
        });
});

/**
 * Filter Comment based on All Available Fields
 */
app.get('/filterComments', function (req, res) {
    let searchItem = req.query.searchItem;
    if (isEmpty(searchItem)) {
        res.json({"Error": "searchItem Required !"});
        return false;
    }

    conn.query(`SELECT * FROM comments WHERE CONCAT(id, '', postId, '', name, '', email, '', body) 
               LIKE ? `, "%" + searchItem + "%",
        function (err, result) {
            if (err) {
                console.log("error: ", err);
                res.json(err);
            } else {
                // console.log(`Search Item Result : `, result);
                res.json(result);
            }
        });
});

//Run express Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});