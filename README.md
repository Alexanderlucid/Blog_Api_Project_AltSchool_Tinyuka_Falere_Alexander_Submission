# Blogging API Documentation

A RESTful API for a multi-user blogging platform. Built with **Node.js**, **Express**, and **MongoDB**, and hosted on **Render**.

---

##  Base URL

```
https://blog-api-project-altschool-tinyuka.onrender.com/api
```

---

##  Authentication

JWT-based.

**Header Format:**
```
Authorization: Bearer <token>
```

---

## User Endpoints

###  Register

`POST /api/users/register`

**Body:**
```json
{
  "first_name": "Alexander",
  "last_name": "Falere",
  "email": "alex@example.com",
  "password": "test1234"
}
```

---

###  Login

`POST /api/auth/login`

**Body:**
```json
{
  "email": "alex@example.com",
  "password": "test1234"
}
```

**Returns:**
```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": { ... }
}
```

---

##  Blog Endpoints

> All blog creation/editing requires a valid JWT.

---

###  Create a Blog (Draft by Default)

`POST /api/blogs`

**Headers:**  
`Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "My Blog",
  "description": "Short summary",
  "tags": ["tech", "node"],
  "body": "Full content here..."
}
```

---

###  Get All Published Blogs

`GET /api/blogs`

**Query Parameters (Optional):**

| Param    | Description                          |
|----------|--------------------------------------|
| `title`  | Search by title                      |
| `tags`   | Comma-separated tags                 |
| `author` | Filter by author ID                  |
| `sortBy` | `read_count`, `reading_time`, `timestamp` |
| `page`   | Page number (default: 1)             |
| `limit`  | Items per page (default: 20)         |

---

###  Get a Single Blog by ID

`GET /api/blogs/:id`

> Also increments read count

---

###  Get User’s Blogs

`GET /api/blogs/user`

**Headers:**  
`Authorization: Bearer <token>`

---

###  Update a Blog

`PUT /api/blogs/:id`

**Headers:**  
`Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Updated title",
  "body": "Updated blog content"
}
```

---

### Publish a Blog

`PATCH /api/blogs/:id/publish`

**Headers:**  
`Authorization: Bearer <token>`

---

###  Delete a Blog

`DELETE /api/blogs/:id`

**Headers:**  
`Authorization: Bearer <token>`

---

##  Reading Time

- Estimated by word count: **200 words per minute**

---

##  Status Codes

| Code | Meaning           |
|------|-------------------|
| 200  | OK                |
| 201  | Created           |
| 400  | Bad request       |
| 401  | Unauthorized      |
| 403  | Forbidden         |
| 404  | Not found         |
| 500  | Server error      |

---

##  Notes

- Passwords hashed with `bcrypt`
- JWTs expire in **1 hour**
- Only blog authors can update/publish/delete their blogs

---

## Deployment

Hosted on **Render**:  
🔗 `https://blog-api-project-altschool-tinyuka.onrender.com`

---

## Manual Testing

Test endpoints using **Postman** or **cURL**. Ensure to set the `Content-Type` to `application/json` and include your JWT token when required.