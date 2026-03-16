const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/blog/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The theme objects and state were already added. Let's just do class replacements correctly.

// bgLight and bgDark
content = content.replace(/className="absolute top-0 right-0 w-\[800px\] h-\[800px\] bg-blue-100\/30 rounded-full blur-\[120px\] -mr-64 -mt-64"/g, 'className={`absolute top-0 right-0 w-[800px] h-[800px] ${themeTheme.bgLight} rounded-full blur-[120px] -mr-64 -mt-64`}');
content = content.replace(/className="absolute bottom-0 left-0 w-\[600px\] h-\[600px\] bg-emerald-50\/30 rounded-full blur-\[100px\] -ml-48 -mb-48"/g, 'className={`absolute bottom-0 left-0 w-[600px] h-[600px] ${themeTheme.bgDark} rounded-full blur-[100px] -ml-48 -mb-48`}');

// Knowledge Hub sparkles bubble
content = content.replace(/className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-blue-100 shadow-\[0_10px_30px_rgba\(37,99,235,0\.08\)\] text-blue-600 text-\[10px\] font-black uppercase tracking-\[0\.4em\] mb-10"/g, 'className={`inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border ${themeTheme.lightBorder} shadow-[0_10px_30px_rgba(37,99,235,0.08)] ${themeTheme.text} text-[10px] font-black uppercase tracking-[0.4em] mb-10`}');

// text-blue-600 to themeTheme.text
content = content.replace(/className="text-blue-600"/g, 'className={themeTheme.text}');
// With wrapping quotes:
content = content.replace(/'text-blue-600'/g, 'themeTheme.text');
content = content.replace(/className="([^"]*?)text-blue-600([^"]*?)"/g, 'className={`$1${themeTheme.text}$2`}');
content = content.replace(/className="([^"]*?)text-blue-500([^"]*?)"/g, 'className={`$1${themeTheme.textLight}$2`}');
content = content.replace(/className="([^"]*?)group-hover:text-blue-600([^"]*?)"/g, 'className={`$1group-hover:${themeTheme.text}$2`}');
content = content.replace(/className="([^"]*?)hover:text-blue-600([^"]*?)"/g, 'className={`$1hover:${themeTheme.text}$2`}');


// border-blue-600
content = content.replace(/className="([^"]*?)border-blue-600([^"]*?)"/g, 'className={`$1${themeTheme.borderSolid}$2`}');
content = content.replace(/className="([^"]*?)hover:border-blue-600([^"]*?)"/g, 'className={`$1${themeTheme.hoverBorderSolid}$2`}');

// bg-blue-600
content = content.replace(/className="([^"]*?)bg-blue-600([^"]*?)"/g, 'className={`$1${themeTheme.bgSolid}$2`}');
content = content.replace(/className="([^"]*?)hover:bg-blue-600([^"]*?)"/g, 'className={`$1${themeTheme.bgHoverSolid}$2`}');

// group-hover:bg-blue-600 group-hover:text-white
content = content.replace(/className="([^"]*?)group-hover:bg-blue-600 group-hover:text-white([^"]*?)"/g, 'className={`$1${themeTheme.bgHoverSolid} group-hover:text-white$2`}');

// text-blue-400
content = content.replace(/className="([^"]*?)text-blue-400([^"]*?)"/g, 'className={`$1${themeTheme.text}$2`}');

// bg-blue-50 or bg-blue-500/10 etc (badgeBg)
content = content.replace(/className="([^"]*?)bg-blue-50([^"]*?)"/g, 'className={`$1${themeTheme.badgeBg}$2`}');

// text-shadow, gradient, ring etc can also be added.

// Fix any potential template string nesting issues
content = content.replace(/className="([^"]*?)\$\{([a-zA-Z.]+)\}([^"]*?)"/g, 'className={`$1${$2}$3`}');
content = content.replace(/className=`([^`]*?)\$\{([a-zA-Z.]+)\}([^`]*?)`/g, 'className={`$1${$2}$3`}'); // If we did it twice.

// Also need to rewrite the 3 blog cards mapping hover color
// hover:border-blue-100
content = content.replace(/hover:border-blue-100/g, 'hover:${themeTheme.lightBorder}');
content = content.replace(/className="([^"]*?)\$\{themeTheme\.lightBorder\}([^"]*?)"/g, 'className={`$1${themeTheme.lightBorder}$2`}');

// bg-blue-600/10 -> wait, alpha colors are hard to map directly if we don't have a token. Let's just leave it or map it to textLight which is similar, but opacity is the key. Since it's /10, we could add a token or just let it be. Let's add an bgLightToken mapping `bg-blue-600/10` to `bg-blue-600/10` vs `bg-emerald-600/10`.
content = content.replace(/bg-blue-600\/10/g, '${themeTheme.bgSolid}/10');

// Fix string replacement bugs
content = content.replace(/className="([^"]*?)\$\{([a-zA-Z.]+)\}\/([0-9]+)([^"]*?)"/g, 'className={`$1${$2}/$3$4`}');


fs.writeFileSync(filePath, content, 'utf8');
console.log('done running token replacements');
