const baseUrl = 'http://127.0.0.1:8000'



const app = Vue.createApp({
  data: function () {
    return {
      title: 'G12 Forum',
      token: '',
      user: {},
      posts: [
        {
          comments: [],
        },
      ],
      showNewPost: false,
      showEditPost: false,
      showAddComment: false,
      showLogin: false,
      showRegister: false,
      registerForm: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      loginForm: {
        email: '',
        password: ''
      },
      postForm: {
        title: '',
        content: ''
      },
      editForm: {
        title: '',
        content: ''
      },
      addCommentForm: {
        content: ''
      },
      errors: {}
    }
  },
  created: async function () {
    this.token = sessionStorage.getItem('token') || ''
    if (this.token == "" || this.token == null) {
      this.user = sessionStorage.getItem('user') || {}
    }
    else {
      this.user = JSON.parse(sessionStorage.getItem('user') || {});
    }
    await this.getPosts()
    this.posts.forEach(post => this.getComments(post));
  },
  methods: {
    isValidEmail(email) {
      // Implement a simple email validation logic
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    },
    register: async function () {
      try {
        // Validate form inputs
        this.errors = {};
        if (!this.registerForm.name) {
          this.errors.name = 'Name is required.';
        }
        if (!this.registerForm.email) {
          this.errors.email = 'Email is required.';
        } else if (!this.isValidEmail(this.registerForm.email)) {
          this.errors.email = 'Invalid email format.';
        } else if (this.registerForm.email == this.loginForm.email) {
          this.errors.email = 'This email is already taken.';
        }
        if (!this.registerForm.password) {
          this.errors.password = 'Password is required.';
        }
        if (this.registerForm.password !== this.registerForm.password_confirmation) {
          this.errors.password_confirmation = 'Passwords do not match.';
        }

        if (Object.keys(this.errors).length > 0) {
          return;
        }

        const response = await fetch(`${baseUrl}/register`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.registerForm)
        });

        const data = await response.json();
        this.showRegister = false;
        this.registerForm = {
          name: '',
          email: '',
          password: '',
          password_confirmation: ''
        };
        this.errors = {};

      } catch (error) {
        console.error(error);
      }
    },

    login: async function () {
      try {
        // Reset login errors
        this.errors = {};
        // Perform validation
        if (!this.loginForm.email) {
          this.errors.email = 'Email is required.';
        }
        if (!this.loginForm.password) {
          this.errors.password = 'Password is required.';
        }
        const response = await fetch(`${baseUrl}/login`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.loginForm)
        });

        if (response.ok) {
          const json = await response.json();
          this.token = json.token;
          this.user = json.user;
          sessionStorage.setItem('token', this.token);
          sessionStorage.setItem('user', JSON.stringify(json.user));
          this.getPosts();
          this.showLogin = false;
        } else {
          const errorData = await response.json();
          if (errorData.errors) {
            this.errors = errorData.errors;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    getPosts: async function () {
      try {

        // baseaUrl/api/users/{id}/posts
        const response = await fetch(`${baseUrl}/api/users/${this.user.id}/posts`, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })
        this.posts = await response.json()


      } catch { error } {
        console.log(error)
      }
    },
    addPost: async function () {
      try {
        this.errors = {};
        // Perform validation
        if (!this.postForm.title) {
          this.errors.title = 'Title is required.';
        }
        if (!this.postForm.content) {
          this.errors.content = 'Content is required.';
        }
        // url: baseUrl/api/users/{id}/posts
        const response = await fetch(`${baseUrl}/api/users/${this.user.id}/posts`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(this.postForm)
        });
        if (response.ok) {
          this.showNewPost = false;
          const json = await response.json();
          this.posts.push(json);
          // this.showNewPost = false;
          window.location.href = '/';
        } else {
          const errorData = await response.json();
          if (errorData.errors) {
            this.postErrors = errorData.errors;
          }
        }

      } catch (error) {
        console.log(error);
      }
    },

    editPost: function (post) {
      this.editForm.title = post.title;
      this.editForm.content = post.content;
      this.editForm.id = post.id;

      // Show the edit post form
      this.showEditPost = true;
    },
    updatePost: async function () {
      try {
        this.errors = {};
        // Perform validation
        if (!this.editForm.title) {
          this.errors.title = 'Title is required.';
        }
        if (!this.editForm.content) {
          this.errors.content = 'Content is required.';
        }
        const response = await fetch(`${baseUrl}/api/users/${this.user.id}/posts/${this.editForm.id}`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(this.editForm)
        });
        if (response.ok) {
          const updatedPost = await response.json();
          const index = this.posts.findIndex(post => post.id === updatedPost.id);
          if (index !== -1) {
            this.posts.splice(index, 1, updatedPost);
          }
          this.showEditPost = false;
          window.location.href = '/';
        } else {
          const errorData = await response.json();
          if (errorData.errors) {
            this.postErrors = errorData.errors;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    deletePost: async function (post) {
      try {
        const response = await fetch(`${baseUrl}/api/users/${this.user.id}/posts/${post.id}`, {
          method: 'delete',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (response.ok) {
          // Remove the deleted post from the posts array
          this.posts = this.posts.filter(n => n.id !== post.id);
        }

      } catch (error) {
        console.log(error);
      }

    },

    // getComments: async function (post) {
    //   try {
    //     if (this.token) {
    //       const response = await fetch(`${baseUrl}/api/posts/${post.id}/comments`, {
    //         method: 'get',
    //         headers: {
    //           'Accept': 'application/json',
    //           'Authorization': `Bearer ${this.token}`
    //         }
    //       });

    //       const comments = await response.json();

    //       // Assign the fetched comments to the specific post's comments property
    //       post.comments = comments;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    addComment: function (post) {
      // this.addCommentForm.content = post.content;
      this.addCommentForm.id = post.id;

      // Show the edit post form
      this.showAddComment = true;

    },
    createComment: async function () {
      try {
        this.errors = {};
        // Perform validation
        if (!this.addCommentForm.content) {
          this.errors.content = 'Content is required.';
        }
        const response = await fetch(`${baseUrl}/api/posts/${this.addCommentForm.id}/comments`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(this.addCommentForm)
        })
        if (response.ok) {
          const createComment = await response.json();
          this.showAddComment = false;
          this.addCommentForm.content = '';
          location.reload();
        } else {
          const errorData = await response.json();
          if (errorData.errors) {
            this.postErrors = errorData.errors;
          }
        }
      } catch (error) {
        console.log(error);
      }

    },

    upvotePost: async function (post) {
      try {
        const response = await fetch(`${baseUrl}/api/posts/${post.id}/upvote`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });

        post.upvotes++;

        // if (response.ok) {
        //   const data = await response.json();
        //   if (data.message === 'Upvoted successfully') {
        //     // Update the post's upvote count
        //     post.upvotes++;
        //     post.hasUpvoted = true; // Mark that the user has upvoted this post
        //   }
        // } else {
        //   const errorData = await response.json();
        //   console.log('Error upvoting post:', errorData.error);
        // }

      } catch (error) {
        console.log('Error upvoting post:', error);
      }
    },

    logout: async function () {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');

      // Clear data
      this.token = '';
      this.user = {};
      this.posts = [];

      window.location.href = '/';
    }

  }
})

app.mount('#app')