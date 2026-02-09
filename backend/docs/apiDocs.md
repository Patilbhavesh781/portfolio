# Portfolio API Documentation

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication

### Register Admin
POST `/auth/register`

```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "password123"
}
Login

POST /auth/login

{
  "email": "admin@example.com",
  "password": "password123"
}

👤 User Profile

GET /auth/profile
Headers: Authorization: Bearer <token>

📁 Projects
Get All Projects

GET /projects

Get Single Project

GET /projects/:id

Create Project (Admin)

POST /projects
Headers: Authorization
Body: form-data (title, description, image, techStack, liveUrl, githubUrl)

Update Project (Admin)

PUT /projects/:id

Delete Project (Admin)

DELETE /projects/:id

📝 Blogs
Get All Blogs

GET /blogs

Get Single Blog

GET /blogs/:id

Create Blog (Admin)

POST /blogs
Headers: Authorization
Body: form-data (title, content, image, tags)

Update Blog (Admin)

PUT /blogs/:id

Delete Blog (Admin)

DELETE /blogs/:id

🛠 Skills
Get All Skills

GET /skills

Create Skill (Admin)

POST /skills

Update Skill (Admin)

PUT /skills/:id

Delete Skill (Admin)

DELETE /skills/:id

💼 Experience
Get All Experiences

GET /experiences

Create Experience (Admin)

POST /experiences

Update Experience (Admin)

PUT /experiences/:id

Delete Experience (Admin)

DELETE /experiences/:id

🎓 Education
Get All Education

GET /education

Create Education (Admin)

POST /education

Update Education (Admin)

PUT /education/:id

Delete Education (Admin)

DELETE /education/:id

🏅 Certifications
Get All Certifications

GET /certifications

Create Certification (Admin)

POST /certifications

Update Certification (Admin)

PUT /certifications/:id

Delete Certification (Admin)

DELETE /certifications/:id

⭐ Testimonials
Get All Testimonials

GET /testimonials

Create Testimonial (Admin)

POST /testimonials

Update Testimonial (Admin)

PUT /testimonials/:id

Delete Testimonial (Admin)

DELETE /testimonials/:id

📩 Contact Messages
Send Message

POST /contact

Get Messages (Admin)

GET /contact

Mark as Read

PUT /contact/:id/read

Delete Message

DELETE /contact/:id

📊 Stats
Get Stats

GET /stats

Update Stats (Admin)

PUT /stats

⚠️ Error Handling

All errors return:

{
  "success": false,
  "message": "Error message"
}
