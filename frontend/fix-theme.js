const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/appointment/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add division state and effect
const stateToAdd = `
  const [division, setDivision] = useState<string>("finance");

  useEffect(() => {
    const handleSync = () => {
      setDivision(localStorage.getItem("user_division") || "finance");
    };
    handleSync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("division-change", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("division-change", handleSync);
    };
  }, []);

  const themeTheme = division === 'taxation' ? {
    text: 'text-emerald-600',
    textLight: 'text-emerald-500',
    textFocus: 'group-focus-within:text-emerald-400',
    ring: 'focus:ring-emerald-500/20',
    border: 'focus:border-emerald-500/50',
    gradient: 'from-emerald-600 to-teal-500',
    gradientHover: 'hover:from-emerald-500 hover:to-teal-400',
    shadow: 'shadow-[0_20px_50px_rgba(16,185,129,0.2)]',
    boxHover: 'group-hover:bg-emerald-600 group-hover:border-emerald-500',
    bgLight: 'bg-emerald-100/30',
    bgDark: 'bg-emerald-50/30',
    activeTab: 'bg-emerald-600 border-emerald-500 shadow-emerald-500/20 text-white scale-[1.02]',
    btnSelect: 'hover:bg-emerald-600 hover:text-white focus:bg-emerald-600 focus:text-white',
    progressBar: 'bg-gradient-to-r from-emerald-500 to-teal-400'
  } : {
    text: 'text-blue-600',
    textLight: 'text-blue-500',
    textFocus: 'group-focus-within:text-blue-400',
    ring: 'focus:ring-blue-500/20',
    border: 'focus:border-blue-500/50',
    gradient: 'from-blue-600 to-cyan-500',
    gradientHover: 'hover:from-blue-500 hover:to-cyan-400',
    shadow: 'shadow-[0_20px_50px_rgba(37,99,235,0.2)]',
    boxHover: 'group-hover:bg-blue-600 group-hover:border-blue-500',
    bgLight: 'bg-blue-100/30',
    bgDark: 'bg-blue-50/30',
    activeTab: 'bg-blue-600 border-blue-500 shadow-blue-500/20 text-white scale-[1.02]',
    btnSelect: 'hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
    progressBar: 'bg-gradient-to-r from-blue-500 to-cyan-400'
  };
`;

content = content.replace('  const { hero, form: formContent } = content;', stateToAdd + '\n  const { hero, form: formContent } = content;');

// 2. Replace static emerald classes with dynamic template strings using themeTheme

// Background circles
content = content.replace('bg-emerald-100/30', '${themeTheme.bgLight}');
content = content.replace('bg-emerald-50/30', '${themeTheme.bgDark}');
// Since those strings are in a className string, we need to convert them to template literals if they aren't already.

const replaceClass = (originalHtml, oldClass, newClassVar) => {
    // A primitive approach: find the class and replace it. Need to make sure we wrap with curly braces and backticks if it's currently a standard string.
    // However, it's easier to just do regex to find standard string classNames and convert them.
}

content = content.replace(/className="([^"]*?)text-emerald-600([^"]*?)"/g, 'className={`$1${themeTheme.text}$2`}');
content = content.replace(/className="([^"]*?)text-emerald-500([^"]*?)"/g, 'className={`$1${themeTheme.textLight}$2`}');
content = content.replace(/className="([^"]*?)group-focus-within:text-emerald-400([^"]*?)"/g, 'className={`$1${themeTheme.textFocus}$2`}');

content = content.replace(/className="([^"]*?)bg-gradient-to-r from-emerald-500 to-teal-400([^"]*?)"/g, 'className={`$1${themeTheme.progressBar}$2`}');

// focus:ring-emerald-500/20 focus:border-emerald-500/50
content = content.replace(/focus:ring-emerald-500\/20 focus:border-emerald-500\/50/g, '${themeTheme.ring} ${themeTheme.border}');

// Convert standard strings containing the replaced stuff to template literals
content = content.replace(/className="([^"]*?\$\{themeTheme\.[a-zA-Z]+\}[^"]*?)"/g, 'className={`$1`}');

// btnSelect
content = content.replace(/hover:bg-emerald-600 hover:text-white font-bold uppercase text-\[10px\] tracking-widest pl-10 focus:bg-emerald-600 focus:text-white/g, '${themeTheme.btnSelect} font-bold uppercase text-[10px] tracking-widest pl-10');

// Form Button
content = content.replace(/bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black uppercase tracking-\[0\.3em\] py-10 rounded-\[2rem\] shadow-\[0_20px_50px_rgba\(37,99,235,0\.2\)\]/g, 
  'bg-gradient-to-r ${themeTheme.gradient} ${themeTheme.gradientHover} text-white font-black uppercase tracking-[0.3em] py-10 rounded-[2rem] ${themeTheme.shadow}');

// bgLight and bgDark
content = content.replace(/className="absolute top-0 right-0 w-\[800px\] h-\[800px\] bg-emerald-100\/30 rounded-full blur-\[120px\] -mr-64 -mt-64"/g, 'className={`absolute top-0 right-0 w-[800px] h-[800px] ${themeTheme.bgLight} rounded-full blur-[120px] -mr-64 -mt-64`}');
content = content.replace(/className="absolute bottom-0 left-0 w-\[600px\] h-\[600px\] bg-emerald-50\/30 rounded-full blur-\[100px\] -ml-48 -mb-48"/g, 'className={`absolute bottom-0 left-0 w-[600px] h-[600px] ${themeTheme.bgDark} rounded-full blur-[100px] -ml-48 -mb-48`}');


// RadioGroupItem activeTab
content = content.replace(/field\.value === slot \? "bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-500\/20 scale-\[1\.02\]" : "border-slate-800 text-slate-400"/g, 
  'field.value === slot ? themeTheme.activeTab : "border-slate-800 text-slate-400"');

// Benefit icons hover
content = content.replace(/group-hover:bg-emerald-600 group-hover:border-emerald-500/g, '${themeTheme.boxHover}');
content = content.replace(/text-emerald-500 group-hover:text-white/g, '${themeTheme.textLight} ${themeTheme.iconHover}');

// Some left overs
content = content.replace(/className="([^"]*?)\$\{([^}]*?)\}([^"]*?)"/g, 'className={`$1${$2}$3`}');


fs.writeFileSync(filePath, content, 'utf8');
console.log('done');
