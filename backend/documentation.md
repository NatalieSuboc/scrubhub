# Backend Documentation
---
### Running the Node Server
1. Download node / npm
- NodeJS - use `node -v` to check
- npm - use `npm -v` to check
2. (TODO) You may need to init the node server on your computer - use `npm init -y` when in the `backend` folder.
3. Install the following dependencies:
- `npm install typescript --save-dev`
- `npm install @types/node --save-dev`
- `npm install @types/express --save-dev`
4. Start the app using `npx tsc`. `tsc` is the TypeScript compiler and will read the TypeScript files, compile them
  into JS files, and then put them in the `build` folder. If succcessful, the console should display that it connected
  to PORT 4000. For Mac, Ctrl+C works to turn off the app.

### Running MongoDB
1. Run 
- `npm install mongodb`
2. Go to backend/src/dbconfig.ts
3. Replace <password> on line 3 with the password (make sure to change it back before committing)
4. Run as usual as above with:
- `npx tsc`
- `npm run build`
inside of the backend folder

Reference: https://khalilstemmler.com/blogs/typescript/node-starter-project/

**Note:** The .gitignore currently ignores the `node_modules` and `build` folder created when running the app - this
expected behavior (we don't want to upload them).
