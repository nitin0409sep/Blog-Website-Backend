### \* CREATE INDEX articles_content_idx ON articles USING GIN (to_tsvector('english', content));

```
// Post_Id
// User Comment_id

// User1 Comment1 -> [ { User 2 - Comment2 } , { User 3 - Comment 3 } , { User 4 - Comment 4 } , { User 1 - Comment 5 } ]

// User2 Comment1

```

<!-- Like -->
<!-- Like Table - User_id, Post_id, Like - true, false -->

<!-- How user will know he had already liked or not the post -->

Jab Post get krtay hai post_id se toh 1 join laga dunga, jisse mein check kar ke boolean bhej dunga ki user already post
like kiya hai ya nahi;

Join b/w Posts and Likes
