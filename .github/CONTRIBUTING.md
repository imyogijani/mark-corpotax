# Contributing Guide — Mark Corpotax

## Branch Structure

| Branch         | Owner               | Purpose                             |
| -------------- | ------------------- | ----------------------------------- |
| `master`       | Project Owner only  | Production-ready code, full project |
| `frontend-dev` | Frontend Developers | UI/UX changes only                  |

## Rules for Frontend Developers

- ✅ **Work ONLY on `frontend-dev` branch**
- ✅ **Modify ONLY files inside `frontend/` directory**
- ✅ Pull latest code before starting each day
- ✅ Write clear commit messages describing what you changed
- ❌ **Never push to `master` branch**
- ❌ **Never touch `backend/` directory**

## Getting Started

Refer to the full guide: [`docs/GIT_GUIDE_FOR_DEVELOPERS.md`](../docs/GIT_GUIDE_FOR_DEVELOPERS.md)

## Daily Workflow

```bash
git pull origin frontend-dev   # Start of day
# ... make your changes in frontend/ folder ...
git add .
git commit -m "describe your changes"
git push origin frontend-dev   # End of day
```
