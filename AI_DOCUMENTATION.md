**1. What did you ask the AI to help you with, and why did you choose to use AI for that specific task?**

When setting up authentication, I used the reference app to get `cookie-session` configured and working. I understood the basic idea, after a successful login you set `req.session.userId`, and on protected routes you check that it exists. What I wasn't totally clear on was the `keys` option. I used AI to clarify for me.

> *"I'm building an Express app for a school project using cookie-session for authentication. I mostly understand how it works, you store data like userId in req.session and it persists across requests via a cookie. I'm just not totally clear on what the `keys` option does specifically. What is it protecting against and how does it work?"*

I chose AI because this was less about being stuck and more about wanting a clear, direct explanation of one specific thing. I had a working implementation already, I just wanted to make sure I actually understood what I had written.

**2. How did you evaluate whether the AI's output was correct or useful before using it?**

The AI explained that the `keys` option is used to cryptographically sign the cookie. When the server sends the session cookie to the browser, it also sends a signature generated from the cookie's contents and the secret key. On every subsequent request, Express re-computes the signature and compares it to the one in the cookie, if they don't match, the session is rejected. This prevents a user from opening DevTools and manually editing their `userId` to impersonate someone else, because changing the cookie contents would invalidate the signature.

To test this, I logged in, then opened the browser's Application tab in DevTools and manually edited the session cookie value. When I made a request to `GET /api/auth/me` after that, I got a `401` back, the tampered cookie was rejected. That confirmed the AI's explanation was accurate.

**3. How did what the AI produced differ from what you ultimately used, and what does that tell you about your own understanding of the problem?**

The AI's example hardcoded the secret key directly in the configuration:

```js
app.use(cookieSession({
  name: 'session',
  keys: ['secretkey'],
  maxAge: 24 * 60 * 60 * 1000
}));
```

I already had mine reading from `process.env.SESSION_SECRET` since the project requirements were clear that sensitive config belongs in `.env`. So that part I didn't need AI to tell me. What the AI did give me was the confidence that my setup was correct and a clearer mental model for why the signing actually matters, which made me feel better about the code I had already written.

**4. What did you learn from using AI in this way?**

I learned what the `keys` option is doing and why it's important. Understanding that the cookie is signed and that tampering with it server-side gets caught made the whole authentication flow feel more concrete. I also think this was a good example of using AI not because I was stuck, but just to fill in a gap in my understanding of something I had already implemented. Having the working code first and then asking for clarification on one piece felt like a more effective way to learn than asking AI to explain everything upfront.