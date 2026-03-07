# 🚀 Git & GitHub Guide — Frontend Developers

### Mark Corpotax Project | UI/UX Development

> **Yeh guide un developers ke liye hai jo pehli baar Git use kar rahe hain.**
> Is guide ko shuru karne se pehle poora padho — ek baar mein samajh aa jayega!

---

## 📋 Table of Contents

1. [Git kya hota hai?](#1-git-kya-hota-hai)
2. [Pehli baar ka Setup](#2-pehli-baar-ka-setup)
3. [Project Download karo (Clone)](#3-project-download-karo-clone)
4. [Branch kya hoti hai?](#4-branch-kya-hoti-hai)
5. [Roz ka kaam — Daily Workflow](#5-roz-ka-kaam--daily-workflow)
6. [Important Rules ⚠️](#6-important-rules-)
7. [Problem aaye toh kya karo?](#7-problem-aaye-toh-kya-karo)
8. [Commands Cheat Sheet](#8-commands-cheat-sheet)

---

## 1. Git kya hota hai?

**Git** ek **version control system** hai. Isko aise samjho:

> Jaise Microsoft Word mein "Track Changes" hota hai — Git poore project ke liye wahi kaam karta hai.
> Har change save hota hai, koi bhi file galti se delete nahi hoti.

**GitHub** ek website hai jahan Git projects online store hote hain.

> GitHub = Git ka **Google Drive** jaisa hai — sab kuch online safe rehta hai!

---

## 2. Pehli baar ka Setup

### Step 1 — Git Install Karo

👉 Yahan se download karo: https://git-scm.com/download/win

Install karte waqt sab options **default** rakhna — bas Next-Next-Finish karte raho.

### Step 2 — Apna Naam aur Email Set Karo

**Git Bash** kholo (Start Menu mein search karo "Git Bash") aur yeh commands chalao:

```bash
git config --global user.name "Tumhara Naam"
git config --global user.email "tumhari@email.com"
```

> ⚠️ Yahan apna asli naam aur wahi email daalo jo tumhara **GitHub account** pe hai.

### Step 3 — GitHub Account

Agar GitHub account nahi hai toh yahan banao: https://github.com

Account bana lo aur apni **GitHub username** owner ko bhejo — woh tumhe project ka access denge.

---

## 3. Project Download Karo (Clone)

**Yeh sirf ek baar karna hai — pehli baar setup ke time.**

1. Computer mein ek folder banao, jaise: `C:\Projects\`
2. Us folder mein jao → Right click karo → **"Git Bash Here"** click karo
3. Yeh commands ek-ek karke chalao:

```bash
git clone https://github.com/imyogijani/mark-corpotax.git
```

```bash
cd mark-corpotax
```

```bash
git checkout -b frontend-dev
```

> ✅ Bas! Ab tum `frontend-dev` branch pe ho — yahan se apna kaam shuru karo.

---

## 4. Branch kya hoti hai?

Branch ko ek **alag copy** ki tarah samjho jahan tum safely apna kaam kar sakte ho bina doosron ke kaam ko affect kiye.

```
GitHub Repository
│
├── master (branch)       ← Yeh OWNER ka branch hai — tum yahan kaam NAHI karoge
│
└── frontend-dev (branch) ← Yeh TUMHARA branch hai — sara UI/UX kaam yahan hoga
```

> **Rule #1:** Tum sirf `frontend-dev` branch pe kaam karoge. `master` ko kabhi touch mat karo!

---

## 5. Roz ka Kaam — Daily Workflow

### 🌅 Subah — Kaam Shuru karne se Pehle (Pull Karo)

**Sabse pehle latest code lo:**

```bash
git pull origin frontend-dev
```

> Yeh ensure karta hai ki tumhare paas sabse taza code hai. Kabhi bhi bina pull kiye kaam mat shuru karo!

---

### 💻 Kaam Karte Raho

VS Code mein `frontend/src/` folder mein changes karo.
Frontend files yahan hain:

```
mark-corpotax/
└── frontend/
    └── src/
        ├── components/    ← Components yahan hain
        ├── app/           ← Pages yahan hain
        └── styles/        ← CSS/Styling yahan hai
```

---

### 🌇 Shaam — Kaam Khatam Hone par (Push Karo)

**Step 1 — Dekho kya-kya badla:**

```bash
git status
```

Yeh batayega kaun-kaun si files change hui hain (laal rang mein dikhenge).

**Step 2 — Apne changes Stage Karo (Add Karo):**

```bash
git add .
```

> `.` (dot) matlab — saari changed files ek saath add karo.

**Step 3 — Commit Karo (Save Karo):**

```bash
git commit -m "yahan likho tumne kya badla"
```

Commit message ke examples:

```bash
git commit -m "Navbar ka color update kiya"
git commit -m "Services section card design theek kiya"
git commit -m "Mobile responsive fix for hero section"
```

**Step 4 — GitHub pe Push Karo (Upload Karo):**

```bash
git push origin frontend-dev
```

✅ **Ho gaya! Tumhara kaam GitHub pe save ho gaya.**

---

### Poora Daily Workflow — Ek Jagah:

```bash
# Subah — kaam shuru karne se pehle
git pull origin frontend-dev

# ... apna kaam karo frontend/ mein ...

# Shaam — kaam khatam hone par
git status
git add .
git commit -m "aaj kya kiya uska short description"
git push origin frontend-dev
```

---

## 6. Important Rules ⚠️

| ✅ Yeh Karo                            | ❌ Yeh Mat Karo                         |
| -------------------------------------- | --------------------------------------- |
| Hamesha `frontend-dev` branch pe raho  | `master` branch pe kabhi mat jao        |
| Roz subah `git pull` karke shuru karo  | Bina pull kiye kaam mat shuro karo      |
| Sirf `frontend/` folder mein kaam karo | `backend/` folder ko touch mat karo     |
| Chhote-chhote commits karo             | Ek bade commit mein sab kuch mat daalo  |
| Commit message clear likho             | Empty ya unclear message mat likho      |
| Kaam khatam hone par push karo         | Kai dino ka kaam ek saath push mat karo |

### ⛔ Yeh Commands KABHI Mat Chalao:

```bash
git checkout master      # ❌ Kabhi nahi!
git push origin master   # ❌ Kabhi nahi!
git merge master         # ❌ Kabhi nahi!
git reset --hard         # ❌ Kabhi nahi!
```

---

## 7. Problem Aaye Toh Kya Karo?

### Problem: "Your branch is behind..."

```bash
git pull origin frontend-dev
```

### Problem: Galti se master branch pe chale gaye

```bash
git checkout -b frontend-dev
```

### Problem: Push nahi ho raha — Login maang raha hai

GitHub Desktop install karo: https://desktop.github.com
Yeh automatically login handle karta hai. Baaki commands waise hi kaam karengi.

### Problem: Galti se koi file delete ho gayi

```bash
git checkout -- filename.tsx
```

### Problem: Sab kuch gadbad ho gaya

**Ghabrao mat!** Owner ko turant batao — Git mein koi bhi cheez permanently delete nahi hoti, sab fix ho sakta hai.

---

## 8. Commands Cheat Sheet

```bash
# Dekho kis branch pe ho
git branch

# frontend-dev pe jao
git checkout -b frontend-dev

# Latest code lo
git pull origin frontend-dev

# Changed files dekho
git status

# Saare changes add karo
git add .

# Save (commit) karo
git commit -m "message yahan"

# GitHub pe upload (push) karo
git push origin frontend-dev

# Pichle commits dekho
git log --oneline
```

---

## 📞 Help Chahiye?

Koi bhi problem aaye toh:

1. Pehle is guide ko dobara padho
2. Error message ka screenshot lo
3. Project owner ko WhatsApp/Call karo

---

> **Yaad rakho:** Git mein koi bhi mistake permanent nahi hoti. Ghabrao mat, owner ko batao! 😊

---

_Guide Version: 1.0 | Project: Mark Corpotax | Branch: frontend-dev_
