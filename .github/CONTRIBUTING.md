# Contributing Guide — Mark Corpotax

## Branch Structure

| Branch         | Kaun use kare       | Kaam kya hai                         |
| -------------- | ------------------- | ------------------------------------ |
| `master`       | Sirf Project Owner  | Production-ready code, poora project |
| `frontend-dev` | Frontend Developers | Sirf UI/UX changes                   |

## Frontend Developers ke liye Rules

- ✅ **Sirf `frontend-dev` branch pe kaam karo**
- ✅ **Sirf `frontend/` directory ki files badlo**
- ✅ Roz subah kaam shuru karne se pehle latest code pull karo
- ✅ Commit message clear likho — kya badla woh describe karo
- ❌ **`master` branch pe kabhi push mat karo**
- ❌ **`backend/` folder ko kabhi touch mat karo**

## Shuru kaise kare?

Poora guide yahan padho: [`docs/GIT_GUIDE_FOR_DEVELOPERS.md`](../docs/GIT_GUIDE_FOR_DEVELOPERS.md)

## Roz ka Workflow (Daily Steps)

```bash
git pull origin frontend-dev   # Subah — latest code lo

# ... frontend/ folder mein apna kaam karo ...

git add .
git commit -m "kya kiya uska description"
git push origin frontend-dev   # Shaam — apna kaam upload karo
```
