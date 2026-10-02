# Anonymous Social Feed API

A backend API for an anonymous social feed where users can create posts, like posts, comment on posts, and reply to comments without creating an account or revealing their identity.

The system uses a server-generated UUID to maintain an anonymous identity across requests. The UUID is stored in an HTTP-only cookie and is used by the backend to associate a visitor with the content and interactions they create.

The project was built to explore backend development concepts including REST APIs, PostgreSQL database relationships, anonymous identity management, cookies, soft deletion, validation, authorization at the resource level, and data integrity.

---

## Features

* Anonymous post creation
* Anonymous comments
* Anonymous replies to comments
* Anonymous post likes
* Anonymous identity using UUID
* HTTP-only cookie-based identity
* Post management
* Comment management
* Reply management
* Like/unlike functionality
* Soft deletion
* Database relationships and constraints
* Request validation
* Error handling
* Pagination
* Protection against duplicate likes
* Resource ownership checks
* RESTful API architecture

---

## How Anonymous Identity Works

Unlike a traditional social media application, this API does not require users to create an account or log in.

Instead, the backend generates a unique anonymous identifier for each visitor.

The identifier is generated using Node.js's `crypto.randomUUID()`.

### Identity Flow

text
Client
   │
   │ Request
   ▼
Backend
   │
   ▼
Check anonymous_id cookie
   │
   ├── Cookie exists
   │       │
   │       ▼
   │   Use existing anonymous ID
   │
   └── Cookie does not exist
           │
           ▼
    crypto.randomUUID()
           │
           ▼
    Set HTTP-only cookie
           │
           ▼
      Continue request


The anonymous identifier is stored in a cookie using Express's `res.cookie()`.

Example concept:

javascript
const anonymousId = crypto.randomUUID();

res.cookie("anonymous_id", anonymousId, {
  httpOnly: true
});


> The actual cookie name and options used by the application should be documented here if they differ from this example.

The client does not need to manually generate or provide the anonymous ID.

The backend is responsible for generating and managing the anonymous identity.

---

# Why Use an Anonymous ID?

The system needs a way to distinguish between different visitors even though there are no registered accounts.

For example:

text
Anonymous Visitor A
        │
        ├── Post A
        ├── Comment A
        └── Like Post B

Anonymous Visitor B
        │
        ├── Post B
        ├── Comment B
        └── Like Post A


The anonymous UUID allows the backend to determine which anonymous visitor performed an action without requiring personally identifiable account information.

---

# Important Limitation

The anonymous identity is tied to the client's cookie.

If the cookie is cleared, a different browser/device is used, or the cookie is otherwise unavailable, the backend may generate a new anonymous identity.

Therefore, the anonymous UUID should **not** be treated as a permanent real-world identity.

---

# Tech Stack

* **Node.js** — JavaScript runtime
* **Express.js** — Backend framework
* **PostgreSQL** — Relational database
* **crypto.randomUUID()** — Anonymous identity generation
* **HTTP cookies** — Anonymous identity persistence

> Add any additional libraries used by the project here.

---

# Project Architecture

The application follows a REST API architecture.

text
Client
  │
  ▼
Express Router
  │
  ▼
Middleware
  │
  ├── Anonymous Identity
  ├── Validation
  └── Request Processing
  │
  ▼
Controller
  │
  ▼
Database Queries
  │
  ▼
PostgreSQL
  │
  ▼
API Response


---

# Database Design

The database is designed around anonymous users and their interactions with posts.

The main entities are:

text
Anonymous Identity
       │
       ├───────────────┐
       │               │
       ▼               ▼
     Posts           Comments
       │               │
       │               └── Replies
       │
       └── Likes


The anonymous identifier acts as the connection between an anonymous visitor and the actions they perform.

---

# Posts

Posts represent content created anonymously by visitors.

The post schema contains the fields required to identify the post, associate it with its anonymous creator, store the content, and track its state.

### Post Schema

text
[ADD YOUR EXACT POST SCHEMA/FIELDS HERE]


### Post Relationships

text
Post
 │
 ├── belongs to anonymous creator
 ├── has many likes
 └── has many comments


### Post Endpoints

Add the actual endpoints implemented in the project:

text
POST   [ADD CREATE POST ENDPOINT]

GET    [ADD GET POSTS/FEED ENDPOINT]

GET    [ADD GET SINGLE POST ENDPOINT]

PATCH  [ADD UPDATE POST ENDPOINT]

DELETE [ADD DELETE POST ENDPOINT]


---

# Likes

Likes represent anonymous visitors interacting with posts.

A visitor's anonymous UUID is used to associate the like with the visitor.

### Like Schema

text
[ADD YOUR EXACT LIKE SCHEMA/FIELDS HERE]


### Like Relationship

text
Anonymous Identity
        │
        ▼
      Like
        │
        ▼
      Post


The database should prevent the same anonymous identity from liking the same post multiple times.

For example:

text
UNIQUE (anonymous_id, post_id)


> Use the exact constraint implemented in your database.

### Like Endpoints

POST   /api/actions/like/:postId

DELETE /api/actions/unlike/:postId

GET    likes are gotten when getting the posts


---

# Comments

Comments allow anonymous visitors to respond to posts.

A comment contains a reference to the post it belongs to and the anonymous identity that created it.

### Comment Schema

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    anonymous_id UUID NOT NULL,
    content TEXT NOT NULL,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


### Comment Relationships

Post
 │
 └── Comments
       │
       ├── Comment
       ├── Comment
       └── Comment


### Comment Endpoints

text
POST   /api/actions/addComment

PATCH  /api/actions/delComment/:commentId

DELETE (i dont actually delete comments, we only perform soft delete)


---

# Comment Replies

The system allows anonymous visitors to reply to existing comments.

Replies are represented through the comment relationship rather than requiring a completely separate reply system.

Conceptually:

text
Post
 │
 └── Comment
       │
       ├── Reply
       ├── Reply
       └── Reply


A reply references its parent comment.

text
parent_comment_id
        │
        ▼
   Parent Comment


### Reply Schema

CREATE TABLE comment_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    comment_id UUID NOT NULL
        REFERENCES comments(id)
        ON DELETE CASCADE,

    anonymous_id UUID NOT NULL,

    content TEXT NOT NULL,

    deleted BOOLEAN NOT NULL DEFAULT false,

    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);

### Reply Endpoints

text
POST   /api/actions/replyComment

PATCH  /api/actions/deleteReply/:replyId

DELETE (soft delete only using patch)


---

# API Endpoints

The following section provides a central overview of the API.

## Posts

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| POST   | /api/post/create              | Create an anonymous post |
| GET    | /api/post/                    | Retrieve posts/feed      |
| GET    | /api/post/:postId             | Retrieve a single post   |
| PATCH  | /api/post/delete/:postId      | Update a post            |
| DELETE | /api/post/delete/:postId      | Soft-delete a post       |

---

## Likes

| Method | Endpoint                       | Description                          |
| ------ | ------------------------------ | ------------------------------------ |
| POST   | /api/actions/like/:postId      | Like a post                          |
| DELETE | /api/actions/unlike/:postId    | Remove a like                        |
| GET    | its gotten when getting posts  | Retrieve likes/count, if implemented |

---

## Comments

| Method | Endpoint                                               | Description               |
| ------ | ------------------------------------------------------ | ------------------------- |
| POST   | /api/actions/addComment                                | Create a comment          |
| GET    | comment retrival are gotten when getting the posts     | Retrieve comments         |
| GET    | comment retrival are gotten when getting the posts     | Retrieve a single comment |
| PATCH  | /api/actions/delComment/:commentId                                | Update a comment          |
| DELETE | /api/actions/delComment/:commentId                                | Soft-delete a comment     |

---

## Replies

| Method | Endpoint                                           | Description         |
| ------ | -------------------------------------------------- | ------------------- |
| POST   | /api/actions/replyComment                          | Create a reply      |
| GET    | reply retrival are gotten when getting the posts   | Retrieve replies    |
| PATCH  | /api/actions/deleteReply/:replyId                  | Update a reply      |
| DELETE | /api/actions/deleteReply/:replyId                  | Soft-delete a reply |

---

# Anonymous Resource Ownership

Although the application does not use traditional authentication, the backend still needs to determine whether an anonymous visitor is allowed to modify a resource.

The anonymous UUID stored in the request cookie is used for this purpose.

For example:

text
Anonymous ID: A
        │
        ▼
     Post 123


If another visitor attempts to modify Post 123:

text
Anonymous ID: B
        │
        ▼
     Post 123
        │
        ▼
    ❌ Forbidden


The backend should perform the ownership check rather than relying on the client.

---

# Soft Deletion

Posts and comments use soft deletion rather than immediately removing records from the database.

Instead of permanently deleting a record, the record is marked as deleted.

Example:

text
deleted = true


The record can therefore remain in the database while being excluded from normal feed or comment responses.

### Example Flow

text
Delete Request
      │
      ▼
Ownership Check
      │
      ▼
Mark Resource as Deleted
      │
      ▼
Resource remains in database
      │
      ▼
Normal queries exclude deleted content


Soft deletion also allows related database records to remain structurally connected where appropriate.

> Document the exact behavior your implementation uses for likes, comments, and replies belonging to a deleted post.

---

# Validation

The backend validates incoming requests before performing database operations.

Examples include:

* Required fields
* Content type
* Content length
* UUID format
* Post IDs
* Comment IDs
* Pagination parameters
* Request body structure

Invalid input should be rejected before unnecessary database operations are performed.

Example response:

json
{
  "success": false,
  "message": "Invalid request"
}


> Replace this example with the actual response format used by the API.

---

# Error Handling

The API uses HTTP status codes to communicate the result of requests.

| Status Code | Meaning                                  |
| ----------- | ---------------------------------------- |
| 200         | Successful request                       |
| 201         | Resource created                         |
| 204         | Successful request with no response body |
| 400         | Bad request                              |
| 403         | Action not permitted                     |
| 404         | Resource not found                       |
| 409         | Conflict                                 |
| 422         | Validation error                         |
| 500         | Internal server error                    |

> Keep this section consistent with the actual status codes returned by your implementation.

---

# Pagination

Feed and collection endpoints should support pagination so that the API does not attempt to return an unnecessarily large number of records.

Example:

http
GET [YOUR_POST_ENDPOINT]?page=1&limit=20


Example response:

json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}


> Replace this example with your actual pagination implementation.

---

# API Response Format

The API uses a consistent response structure where applicable.

### Successful Response

json
{
  "success": true,
  "data": {}
}


### Error Response

json
{
  "success": false,
  "message": "Error message"
}


> Update these examples to match your actual implementation.

---

# Environment Variables

Create a `.env` file containing the required environment variables.

Example:

env
PORT=5000

DATABASE_URL=your_database_url

NODE_ENV=development

# Add other variables used by the application


Never commit sensitive environment variables or secrets to the repository.

---

# Running the Project Locally

### 1. Clone the repository

bash
git clone [ADD_REPOSITORY_URL]


### 2. Enter the project directory

bash
cd [PROJECT_DIRECTORY]


### 3. Install dependencies

bash
npm install


### 4. Configure environment variables

Create a `.env` file and provide the required values.

### 5. Start the development server

bash
npm run dev


### 6. Start the production server

bash
npm start


> Update these commands according to the scripts defined in `package.json`.

---

# Testing

The API should be tested against both successful and unsuccessful scenarios.

Important test cases include:

text
✓ Anonymous visitor can create a post
✓ Anonymous ID is generated when one does not exist
✓ Existing anonymous ID is reused
✓ Anonymous ID is stored in an HTTP-only cookie
✓ Anonymous visitor can create a comment
✓ Anonymous visitor can reply to a comment
✓ Anonymous visitor can like a post
✓ Same anonymous visitor cannot like the same post twice
✓ Anonymous visitor can remove their like
✓ Visitor cannot modify another visitor's post
✓ Visitor cannot modify another visitor's comment
✓ Deleted posts are excluded from normal feed results
✓ Deleted comments are handled correctly
✓ Invalid request data is rejected
✓ Invalid resource IDs are handled correctly
✓ Pagination behaves correctly


---

# Swagger / OpenAPI Documentation

Interactive API documentation can be provided using Swagger UI and OpenAPI.


Swagger UI:
[ADD SWAGGER URL HERE]


The documentation will describe:

* Available endpoints
* HTTP methods
* Request parameters
* Request bodies
* Cookie requirements
* Response structures
* HTTP status codes
* Error responses

---

# API Request Flow

A typical request involving an anonymous visitor follows this process:


                Client
                  │
                  ▼
             HTTP Request
                  │
                  ▼
       Check anonymous_id cookie
                  │
          ┌───────┴───────┐
          │               │
       Exists          Missing
          │               │
          │               ▼
          │       Generate UUID
          │               │
          │               ▼
          │       Set HTTP-only cookie
          │               │
          └───────┬───────┘
                  ▼
             Validate Input
                  │
                  ▼
          Check Resource/Owner
                  │
                  ▼
             Controller
                  │
                  ▼
             PostgreSQL
                  │
                  ▼
              Response


---

# Security Considerations

The application should protect the anonymous system against common backend security problems.

Important considerations include:

* HTTP-only cookies for the anonymous identifier
* Appropriate cookie security settings
* Input validation
* Parameterized SQL queries
* Resource ownership checks
* Duplicate-like prevention
* Rate limiting
* Protection against unauthorized resource modification
* Keeping database credentials and secrets out of source control

The anonymous UUID is an identifier, not authentication in the traditional account-based sense. Anyone who gains access to another visitor's anonymous cookie may potentially be able to act as that anonymous identity, so cookie security is important.

---

# Future Improvements

Potential improvements include:

* Swagger/OpenAPI documentation
* Automated API tests
* Rate limiting
* Centralized logging
* Docker support
* CI/CD
* Redis caching
* Content moderation
* Reporting system
* Notification system
* More advanced feed pagination
* Monitoring and observability

These features can be added as the project evolves.

---

# Project Goal

The primary goal of this project is to demonstrate practical backend development through the design and implementation of an anonymous social feed API.

The project focuses on:

* REST API design
* Relational database design
* PostgreSQL relationships
* Anonymous identity management
* HTTP cookies
* UUID generation
* Resource ownership
* Soft deletion
* Data integrity
* Validation
* Error handling
* API documentation

---

# Author

CodeBro Digital

A backend development project focused on building practical APIs and understanding how backend systems manage data, relationships, identity, and user-generated content.

---

# License

ISC
