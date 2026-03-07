# 🚀 Git & GitHub Guide — Frontend Developers

### Mark Corpotax Project | UI/UX Development

> **यह guide उन developers के लिए है जो Git पहली बार use कर रहे हैं।**
> This guide is for developers who are new to Git. Read it completely before starting work.

---

## 📋 Table of Contents

1. [Git क्या है? (What is Git?)](#1-git-क्या-है)
2. [Setup — पहली बार क्या करना है](#2-setup--पहली-बार-क्या-करना-है)
3. [Project Download करो (Clone)](#3-project-download-करो-clone)
4. [Branch समझो](#4-branch-समझो)
5. [Daily Workflow — हर रोज का काम](#5-daily-workflow--हर-रोज-का-काम)
6. [Important Rules ⚠️](#6-important-rules-)
7. [अगर कोई Problem आए (Troubleshooting)](#7-अगर-कोई-problem-आए)
8. [Useful Commands Cheat Sheet](#8-useful-commands-cheat-sheet)

---

## 1. Git क्या है?

**Git** एक version control system है। इसे ऐसे समझो:

> जैसे Microsoft Word में "Track Changes" होता है — Git पूरे project के लिए वही काम करता है।
> हर change save होता है, कोई भी change गलती से delete नहीं होता।

**GitHub** एक website है जहाँ Git projects online store होते हैं।

- GitHub = Git का Google Drive की तरह है।

---

## 2. Setup — पहली बार क्या करना है

### Step 1: Git Install करो

👉 Download: https://git-scm.com/download/win

Install करते वक्त सब options **default** रखो, बस Next-Next-Next करते रहो।

### Step 2: Git Configure करो

**Git Bash** खोलो (Start Menu में search करो) और ये commands चलाओ:

```bash
git config --global user.name "Tumhara Naam"
git config --global user.email "tumhara@email.com"
```

> ⚠️ यहाँ अपना असली नाम और वही email डालो जो GitHub account पर है।

### Step 3: GitHub Account

अगर GitHub account नहीं है तो बनाओ: https://github.com
Account ID owner को दो ताकि वो तुम्हें project access दे सके।

---

## 3. Project Download करो (Clone)

**एक बार ही करना है — पहली बार setup के समय।**

1. Computer में एक folder बनाओ, जैसे: `C:\Projects\`
2. उस folder में जाओ → Right click → "Git Bash Here"
3. ये command चलाओ:

```bash
git clone https://github.com/imyogijani/mark-corpotax.git
```

4. Project download हो जाएगा। अब इस folder में जाओ:

```bash
cd mark-corpotax
```

---

## 4. Branch समझो

Branch को एक **अलग copy** की तरह समझो जहाँ तुम safely काम कर सकते हो।

```
GitHub Repository
│
├── master (branch)  ← यह OWNER का branch है — तुम यहाँ काम नहीं करोगे
│
└── frontend-dev (branch)  ← यह TUMHARA branch है — सारा काम यहीं होगा
```

> **Rule #1:** तुम सिर्फ `frontend-dev` branch पर काम करोगे। `master` को कभी touch मत करो।

### Frontend-dev Branch पर Switch करो

Clone के बाद **एक बार** यह command चलाओ:

```bash
git checkout frontend-dev
```

Check करने के लिए:

```bash
git branch
```

Output में `* frontend-dev` दिखना चाहिए। `*` means currently इसी branch पर हो।

---

## 5. Daily Workflow — हर रोज का काम

### 🌅 काम शुरू करते वक्त (Morning — Pull करो)

**सबसे पहले latest code लो:**

```bash
git pull origin frontend-dev
```

> यह ensure करता है कि तुम्हारे पास सबसे ताज़ा code है।

---

### 💻 काम करते रहो

VS Code में `frontend/src/` folder में changes करो।
Frontend files यहाँ हैं:

```
mark-corpotax/
└── frontend/
    └── src/
        ├── components/    ← Components यहाँ
        ├── app/           ← Pages यहाँ
        └── styles/        ← CSS/Styling यहाँ
```

---

### 🌇 काम खत्म होने पर (Evening — Push करो)

**Step 1: देखो क्या-क्या बदला**

```bash
git status
```

यह बताएगा कौन-कौन सी files change हुई हैं (लाल रंग में दिखेंगी)।

**Step 2: अपने changes stage करो (Add करो)**

```bash
git add .
```

> `.` (dot) means — सारी changed files को add करो।

**Step 3: Commit करो (Save करो)**

```bash
git commit -m "यहाँ लिखो तुमने क्या बदला"
```

Commit message examples:

```bash
git commit -m "Navbar ka color purple se blue kiya"
git commit -m "Services section card design update"
git commit -m "Mobile responsive fix for hero section"
```

**Step 4: GitHub पर Push करो (Upload करो)**

```bash
git push origin frontend-dev
```

✅ **Done! तुम्हारा काम GitHub पर save हो गया।**

---

### पूरा Daily Workflow एक जगह:

```bash
# सुबह — काम शुरू करने से पहले
git pull origin frontend-dev

# काम करो...

# शाम — काम खत्म होने पर
git status
git add .
git commit -m "aaj kya kiya uska description"
git push origin frontend-dev
```

---

## 6. Important Rules ⚠️

| ✅ करो                             | ❌ मत करो                               |
| ---------------------------------- | --------------------------------------- |
| हमेशा `frontend-dev` branch पर रहो | `master` branch पर जाने की कोशिश मत करो |
| हर रोज pull करके शुरू करो          | बिना pull किए काम मत शुरू करो           |
| `frontend/` folder में ही काम करो  | `backend/` folder को touch मत करो       |
| छोटे-छोटे commits करो              | एक बड़ा commit में सब कुछ मत डालो       |
| Commit message clear लिखो          | Empty या vague message मत लिखो          |
| काम खत्म होने पर push करो          | कई दिनों का काम एक साथ push मत करो      |

### ⛔ NEVER RUN THESE COMMANDS:

```bash
# इन्हें कभी मत चलाओ:
git checkout master      # ❌
git push origin master   # ❌
git merge master         # ❌
git reset --hard         # ❌
```

---

## 7. अगर कोई Problem आए

### Problem: "Your branch is behind..."

```bash
git pull origin frontend-dev
```

### Problem: Accidentally master branch पर चले गए

```bash
git checkout frontend-dev
```

### Problem: Push नहीं हो रहा — Login माँग रहा है

GitHub Desktop install करो: https://desktop.github.com
यह automatically login handle करता है। बाकी commands वैसे ही काम करेंगी।

### Problem: गलती से कोई file delete हो गई

```bash
git checkout -- filename.tsx
```

### Problem: सब कुछ गड़बड़ हो गया

Owner को immediately बताओ — कुछ भी permanently delete नहीं होता, fix हो सकता है।

---

## 8. Useful Commands Cheat Sheet

```bash
# देखो किस branch पर हो
git branch

# frontend-dev पर जाओ
git checkout frontend-dev

# Latest code lo
git pull origin frontend-dev

# Changed files देखो
git status

# सारे changes add करो
git add .

# Save (commit) करो
git commit -m "message yahan"

# GitHub पर upload (push) करो
git push origin frontend-dev

# पिछले commits देखो
git log --oneline
```

---

## 📞 Help चाहिए?

कोई भी problem आए तो:

1. पहले इस guide को दोबारा पढ़ो
2. Error message का screenshot लो
3. Project owner को WhatsApp/Call करो

---

> **Remember:** Git में कोई भी mistake permanent नहीं होती। घबराओ मत, owner को बताओ। 😊

---

_Guide Version: 1.0 | Project: Mark Corpotax | Branch: frontend-dev_
