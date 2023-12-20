# Multitasker

> Note: This project is not meant to be inspiring or highly technical. <br>
> The purpose of this project is to demonstrate my skills.<br>
> This is one of the reasons I chose to take a simple (end-of-course final) project and implement improvements on it.<br>
> The original project: [ZTM uni face detection app](https://github.com/zero-to-mastery/face-rec-app)

Log in (you can use Demo) and start finding faces in photos!

What I've updated:

- auth (sign in, register): in the HTML I've added specificity utilizing the pattern option, adding tool-tips, autoComplete.
- routing: Using react-router-dom v6.
- TDD: Type-Script (originally built in plain Java-Script).
- Migrations: React v18 (originally built in v16), this project was utilizing old class-based React. I've rebuilt it using (only) functions.
- Structure: File structure was shallow.
- Checks: This app used to have a lot of assumptions that were bug pron (TS helped a lot), I've reworked a lot of the logic and fetch calls.
- Style: Improved responsiveness.

## Coming up

Things I'm working on adding to this project.

- Another API service.
- Save the photos in the Face-Detection app to a user history.
