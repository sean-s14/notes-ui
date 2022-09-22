# React Template

This template comes with `mui` for styling and components, and `react-router-dom` for navigation

There are some pages already created with the navigation setup:
- Home
- Projects
- Articles
- About
- Policies
- Contact
- Links to socials

---
### Packages
- `react-router-dom@6`
- `@mui/material`
- `@emotion/react`
- `@emotion/styled`
- `@mui/icons-material`
- `axios`
- `dayjs`
- `jwt-decode`

---
The following policies can be generated [here](https://www.termsfeed.com/privacy-policy-generator/) :
- Privacy Policy
- Cookies Policy
- Disclaimer
- Terms and Conditions
- EULA
- Return and Refund Policy
- (TOS) Terms of Service
- Terms of Use

---
## Setup

```bash
git clone https://github.com/shaun-ps-04/react_template.git .
git remote remove origin  # rm -rf .git may render this useless
rm -rf .git
git init
git branch -M main
npm install
npm start
```

- Change `name` in `package.json`
- Modify variables in `.env` if necessary
- Add `.env` to `.gitignore`

```bash
git add .
git commit -m "Initial Commit"
git remote add origin <path>
git push -u origin main
```
