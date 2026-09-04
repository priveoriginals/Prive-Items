/*==================================================
CAST & CREW VIEW PAGE
JAVASCRIPT PART 1
CONFIG + HELPERS + PROFILE
==================================================*/

(function(){

"use strict";

if (!document.querySelector(".ccview-page")) {
    return;
}

/*==================================================
CONFIG
==================================================*/

const CCVIEW_CONFIG={

FEED:"/feeds/posts/default/-/castcrew?alt=json&max-results=999",

NEWS_COUNT:5,

WORK_LOAD:3

};

/*==================================================
GLOBAL DATA
==================================================*/

let ccCurrentPost=null;

let ccAllPosts=[];

let ccWorkList=[];

let ccRelatedList=[];

/*==================================================
CURRENT URL
==================================================*/

const ccCurrentURL=

location.href

.split("?")[0]

.replace(/\/$/,"");

/*==================================================
STRIP HTML
==================================================*/

function ccStripHTML(text){

return String(text||"")

.replace(/<[^>]*>/g,"")

.trim();

}

/*==================================================
ESCAPE HTML
==================================================*/

function ccEscapeHTML(text){

return String(text||"")

.replace(/&/g,"&amp;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;")

.replace(/"/g,"&quot;")

.replace(/'/g,"&#39;");

}

/*==================================================
POST LINK
==================================================*/

function ccPostLink(post){

if(!post.link){

return"#";

}

const item=

post.link.find(function(link){

return link.rel==="alternate";

});

return item?item.href:"#";

}

/*==================================================
READ META
==================================================*/

function ccMeta(

post,

className

){

const html=

post.content

?

post.content.$t

:

"";

const regex=

new RegExp(

'<(?:span|div)\\s+class=["\\\']'+

className+

'["\\\'][^>]*>'+

'([\\s\\S]*?)'+

'<\\/(?:span|div)>',

"i"

);

const match=

html.match(regex);

return match

?

ccStripHTML(match[1])

:

"";

}

/*==================================================
LOAD POSTS
==================================================*/

async function ccLoadPosts(){

try{

const response=

await fetch(

CCVIEW_CONFIG.FEED

);

const json=

await response.json();

ccAllPosts=

json.feed&&

json.feed.entry

?

json.feed.entry

:

[];

}

catch(error){

console.error(

"Cast Feed Error",

error

);

ccAllPosts=[];

}

}

/*==================================================
CURRENT POST
==================================================*/

function ccFindCurrentPost(){

ccCurrentPost=

ccAllPosts.find(function(post){

return(

ccPostLink(post)

.replace(/\/$/,"")

===

ccCurrentURL

);

});

}

/*==================================================
PROFILE
==================================================*/

function ccRenderProfile(){

if(!ccCurrentPost){

return;

}

const name=

ccStripHTML(

ccCurrentPost.title.$t

);

const photo=

ccMeta(

ccCurrentPost,

"cast-photo"

);

const profession=

ccMeta(

ccCurrentPost,

"cast-profession"

);

/* Breadcrumb */

document.getElementById(

"ccview-breadcrumb-name"

).textContent=name;

/* Profile */

document.getElementById(

"ccview-name"

).textContent=name;

document.getElementById(

"ccwork-person-name"

).textContent=name;

document.getElementById(

"ccview-profession"

).textContent=profession;

/* Photo */

const image=

document.getElementById(

"ccview-photo"

);

image.src=photo;

image.alt=name;

}

/*==================================================
ABOUT
==================================================*/

function ccRenderAbout(){

if(!ccCurrentPost){

return;

}

const about=

ccMeta(

ccCurrentPost,

"cast-about"

);

const box=

document.getElementById(

"ccview-about"

);

const button=

document.getElementById(

"ccview-readmore"

);

box.textContent=about;

/* Show button only if text is long */

requestAnimationFrame(function(){

if(

box.scrollHeight>

box.clientHeight+20

){

button.style.display=

"inline-block";

}

});

button.onclick=function(){

box.classList.toggle(

"expand"

);

button.textContent=

box.classList.contains(

"expand"

)

?

"Read Less"

:

"Read More";

};

}

/*==================================================
SOCIAL LINKS
==================================================*/

function ccRenderSocial(){

if(!ccCurrentPost){

return;

}

const social=

document.getElementById(

"ccview-social"

);

const items=[];

/* Facebook */

const facebook=

ccMeta(

ccCurrentPost,

"cast-facebook"

);

if(facebook){

items.push(

`<a href="${facebook}" target="_blank">

<i class="fa-brands fa-facebook-f"></i>

</a>`

);

}

/* Instagram */

const instagram=

ccMeta(

ccCurrentPost,

"cast-instagram"

);

if(instagram){

items.push(

`<a href="${instagram}" target="_blank">

<i class="fa-brands fa-instagram"></i>

</a>`

);

}

/* Twitter */

const twitter=

ccMeta(

ccCurrentPost,

"cast-twitter"

);

if(twitter){

items.push(

`<a href="${twitter}" target="_blank">

<i class="fa-brands fa-x-twitter"></i>

</a>`

);

}

/* YouTube */

const youtube=

ccMeta(

ccCurrentPost,

"cast-youtube"

);

if(youtube){

items.push(

`<a href="${youtube}" target="_blank">

<i class="fa-brands fa-youtube"></i>

</a>`

);

}

/* Website */

const website=

ccMeta(

ccCurrentPost,

"cast-website"

);

if(website){

items.push(

`<a href="${website}" target="_blank">

<i class="fa-solid fa-globe"></i>

</a>`

);

}

social.innerHTML=

items.join("");

}
/*==================================================
LOAD WORK DATA
==================================================*/

async function ccLoadWorkData(){

await ccLoadSeries();

ccPrepareWorkList();

}

/*==================================================
WORK PARSER
PART 2A-1
==================================================*/

/*==================================================
SERIES FEED
==================================================*/

const CC_SERIES_FEED=

"/feeds/posts/default/-/series?alt=json&max-results=999";

let ccSeriesPosts=[];

let ccVisibleWork=0;

/*==================================================
LOAD SERIES FEED
==================================================*/

async function ccLoadSeries(){

try{

const response=

await fetch(

CC_SERIES_FEED

);

const json=

await response.json();

ccSeriesPosts=

json.feed&&

json.feed.entry

?

json.feed.entry

:

[];

}

catch(error){

console.error(

"Series Feed Error",

error

);

ccSeriesPosts=[];

}

}

/*==================================================
GET SERIES POSTER
==================================================*/

function ccSeriesPoster(post){

return ccMeta(

post,

"series-poster"

);

}

/*==================================================
GET CREW ROLE
REGEX
==================================================*/

function ccGetCrewRole(

html,

person

){

const regex=

/<div\s+class=["']series-crew-member["'][\s\S]*?<\/div>/gi;

const blocks=

html.match(regex)||[];

for(

const block

of blocks

){

const name=

(

block.match(

/class=["']crew-name["'][^>]*>([\s\S]*?)<\/span>/i

)

||[]

)[1];

if(!name){

continue;

}

if(

ccStripHTML(name)

.toLowerCase()

.trim()

!==

person

){

continue;

}

const role=

(

block.match(

/class=["']crew-role["'][^>]*>([\s\S]*?)<\/span>/i

)

||[]

)[1];

return role

?

ccStripHTML(role)

:

"Crew";

}

return null;

}

/*==================================================
GET CAST ROLE
REGEX
==================================================*/

function ccGetCastRole(

html,

person

){

const regex=

/<div\s+class=["']series-cast-member["'][\s\S]*?<\/div>/gi;

const blocks=

html.match(regex)||[];

for(

const block

of blocks

){

const name=

(

block.match(

/class=["']cast-name["'][^>]*>([\s\S]*?)<\/span>/i

)

||[]

)[1];

if(!name){

continue;

}

if(

ccStripHTML(name)

.toLowerCase()

.trim()

!==

person

){

continue;

}

const role=

(

block.match(

/class=["']cast-role["'][^>]*>([\s\S]*?)<\/span>/i

)

||[]

)[1];

return role

?

ccStripHTML(role)

:

"Actor";

}

return null;

}

/*==================================================
WORK PARSER
PART 2A-2
==================================================*/

/*==================================================
PREPARE WORK LIST
==================================================*/

function ccPrepareWorkList(){

ccWorkList=[];

if(

!ccCurrentPost

){

return;

}

const person=

ccStripHTML(

ccCurrentPost.title.$t

)

.toLowerCase()

.trim();

const added={};

ccSeriesPosts.forEach(function(post){

const html=

post.content

?

post.content.$t

:

"";

let role=

ccGetCrewRole(

html,

person

);

let roleText="";

if(role){

roleText=

"As "+role;

}

else{

const castRole=

ccGetCastRole(

html,

person

);

if(castRole){

roleText=

"As "+castRole;

}

else{

return;

}

}

const link=

ccPostLink(post);

if(

added[link]

){

return;

}

added[link]=true;

ccWorkList.push({

title:

ccStripHTML(

post.title.$t

),

poster:

ccSeriesPoster(post),

link:link,

role:roleText

});

});

}

/*==================================================
SORT WORK
==================================================*/

function ccSortWork(){

ccWorkList.sort(function(a,b){

return a.title.localeCompare(

b.title

);

});

}

/*==================================================
LOAD WORK DATA
==================================================*/

async function ccLoadWorkData(){

await ccLoadSeries();

ccPrepareWorkList();

ccSortWork();

}

/*==================================================
WORK RENDER
PART 2B
==================================================*/

/*==================================================
WORK LIMIT
==================================================*/

function ccWorkLimit(){

return window.innerWidth<=991

?

3

:

6;

}

/*==================================================
RENDER WORK
==================================================*/

function ccRenderWork(){

const grid=

document.getElementById(

"ccwork-grid"

);

const button=

document.getElementById(

"ccwork-loadmore"

);

if(

!grid

){

return;

}

if(

!ccWorkList.length

){

grid.innerHTML=

'<div class="ccview-empty">No Works Found</div>';

if(button){

button.style.display="none";

}

return;

}

/*==============================
VISIBLE
==============================*/

if(

ccVisibleWork===0

){

ccVisibleWork=

ccWorkLimit();

}

const items=

ccWorkList.slice(

0,

ccVisibleWork

);

grid.innerHTML=

items.map(function(item){

return`

<a

href="${item.link}"

class="ccwork-card">

<div

class="ccwork-poster">

<img

src="${ccEscapeHTML(item.poster)}"

alt="${ccEscapeHTML(item.title)}"

loading="lazy">

</div>

<div

class="ccwork-title">

${ccEscapeHTML(item.title)}

</div>

<div

class="ccwork-role">

${ccEscapeHTML(item.role)}

</div>

</a>

`;

}).join("");

/*==============================
LOAD MORE
==============================*/

if(

!button

){

return;

}

if(

ccVisibleWork>=

ccWorkList.length

){

button.style.display=

"none";

}

else{

button.style.display=

"block";

}

}

/*==================================================
LOAD MORE
==================================================*/

function ccLoadMoreWork(){

ccVisibleWork+=3;

ccRenderWork();

}

/*==================================================
BUTTON
==================================================*/

document.addEventListener(

"click",

function(event){

if(

event.target.closest(

"#ccwork-loadmore"

)

){

ccLoadMoreWork();

}

});

/*==================================================
WINDOW RESIZE
==================================================*/

window.addEventListener(

"resize",

function(){

if(

ccVisibleWork<

ccWorkLimit()

){

ccVisibleWork=

ccWorkLimit();

}

ccRenderWork();

});

/*==================================================
RELATED CAST & CREW
PART 3A-1
==================================================*/

/*==================================================
GLOBAL
==================================================*/

let ccRelatedMap={};

let ccCurrentPerson="";

/*==================================================
GET CURRENT PERSON
==================================================*/

function ccCurrentPersonName(){

return ccStripHTML(

ccCurrentPost.title.$t

)

.toLowerCase()

.trim();

}

/*==================================================
READ RELATED CREW
==================================================*/

function ccReadCrewMembers(

html,

seriesTitle

){

const regex=

/<div\s+class=["']series-crew-member["'][\s\S]*?<\/div>/gi;

const blocks=

html.match(regex)||[];

blocks.forEach(function(block){

const name=

(

block.match(

/class=["']crew-name["'][^>]*>([\s\S]*?)<\/span>/i

)

||[]

)[1];

if(!name){

return;

}

const person=

ccStripHTML(name)

.trim();

if(

person

.toLowerCase()

===

ccCurrentPerson

){

return;

}

if(

!ccRelatedMap[person]

){

ccRelatedMap[person]={

name:person,

series:[]

};

}

ccRelatedMap[person]

.series

.push(seriesTitle);

});

}

/*==================================================
READ RELATED CAST
==================================================*/

function ccReadCastMembers(

html,

seriesTitle

){

const regex=

/<div\s+class=["']series-cast-member["'][\s\S]*?<\/div>/gi;

const blocks=

html.match(regex)||[];

blocks.forEach(function(block){

const name=

(

block.match(

/class=["']cast-name["'][^>]*>([\s\S]*?)<\/span>/i

)

||[]

)[1];

if(!name){

return;

}

const person=

ccStripHTML(name)

.trim();

if(

person

.toLowerCase()

===

ccCurrentPerson

){

return;

}

if(

!ccRelatedMap[person]

){

ccRelatedMap[person]={

name:person,

series:[]

};

}

ccRelatedMap[person]

.series

.push(seriesTitle);

});

}

/*==================================================
RELATED CAST & CREW
PART 3A-2
==================================================*/

/*==================================================
PREPARE RELATED LIST
==================================================*/

function ccPrepareRelatedList(){

ccRelatedList=[];

ccRelatedMap={};

ccCurrentPerson=

ccCurrentPersonName();

ccSeriesPosts.forEach(function(post){

const html=

post.content

?

post.content.$t

:

"";

let found=false;

/*==================================
CURRENT PERSON IN CREW
==================================*/

if(

ccGetCrewRole(

html,

ccCurrentPerson

)

){

found=true;

}

/*==================================
CURRENT PERSON IN CAST
==================================*/

if(

ccGetCastRole(

html,

ccCurrentPerson

)

){

found=true;

}

if(!found){

return;

}

const title=

ccStripHTML(

post.title.$t

);

ccReadCrewMembers(

html,

title

);

ccReadCastMembers(

html,

title

);

});

/*==================================================
MATCH CAST POSTS
==================================================*/

Object.keys(

ccRelatedMap

)

.forEach(function(name){

const personPost=

ccAllPosts.find(function(post){

return(

ccStripHTML(

post.title.$t

)

.toLowerCase()

===

name.toLowerCase()

);

});

if(

!personPost

){

return;

}

ccRelatedList.push({

name:name,

photo:

ccMeta(

personPost,

"cast-photo"

),

link:

ccPostLink(

personPost

),

count:

ccRelatedMap[name]

.series.length

});

});

/*==================================================
SORT
==================================================*/

ccRelatedList.sort(function(a,b){

return b.count-a.count;

});

/*==================================================
LIMIT
==================================================*/

ccRelatedList=

ccRelatedList.slice(

0,

6

);

}

/*==================================================
LOAD RELATED
==================================================*/

function ccLoadRelated(){

ccPrepareRelatedList();

}

/*==================================================
RELATED CAST & CREW
PART 3B-1
RENDER
==================================================*/

/*==================================================
RENDER RELATED
==================================================*/

function ccRenderRelated(){

const grid=document.getElementById("ccrelated-grid");

if(!grid){
return;
}

if(!ccRelatedList.length){
grid.innerHTML='<div class="ccview-empty">No Related Members Found</div>';
return;
}

grid.innerHTML=ccRelatedList.map(function(item){

return `
<a href="${item.link}" class="ccrelated-card">
<div class="ccrelated-thumb">
<img src="${ccEscapeHTML(item.photo)}"
alt="${ccEscapeHTML(item.name)}"
loading="lazy">
</div>

<div class="ccrelated-name">
${ccEscapeHTML(item.name)}
</div>
</a>
`;

}).join("");

}
  
  /*==================================================
REFRESH RELATED
==================================================*/

function ccRefreshRelated(){

ccRenderRelated();

}

/*==================================================
RELATED NEWS & GOSSIPS
PART 3B-2
==================================================*/

/*==================================================
CONFIG
==================================================*/

const CC_NEWS_FEED=

"/feeds/posts/default/-/News?alt=json&max-results=999";

let ccNewsList=[];

/*==================================================
LOAD NEWS
==================================================*/

async function ccLoadNews(){

if(!ccCurrentPost){

return;

}

try{

const response=

await fetch(

CC_NEWS_FEED

);

const json=

await response.json();

const posts=

json.feed&&

json.feed.entry

?

json.feed.entry

:

[];

const person=

ccStripHTML(
ccCurrentPost.title.$t
)
.toLowerCase()
.trim();

ccNewsList=

posts.filter(function(post){

const cast=

ccMeta(
post,
"news-cast"
).toLowerCase();

const crew=

ccMeta(
post,
"news-crew"
).toLowerCase();

return(

cast.includes(person)

||

crew.includes(person)

);

}).slice(0,5);

const viewAll =

document.getElementById(

"ccnews-viewall"

);

if(viewAll){

const person =

ccStripHTML(

ccCurrentPost.title.$t

);

viewAll.href =

"/p/news.html?type=celebrity&value=" +

encodeURIComponent(person);

}

}

catch(error){

console.error(

"News Error",

error

);

ccNewsList=[];

}

}

/*==================================================
RENDER NEWS
==================================================*/

function ccRenderNews(){

const list=

document.getElementById(

"ccnews-list"

);

if(!list){

return;

}

if(

!ccNewsList.length

){

list.innerHTML=

'<div class="ccview-empty">No News Found</div>';

return;

}

list.innerHTML=

ccNewsList.map(function(post){

const title=

ccStripHTML(

post.title.$t

);

const link=

ccPostLink(

post

);

const thumb = ccMeta(post, "news-thumbnail-image");

const desc=

post.summary

?

ccStripHTML(

post.summary.$t

).substring(

0,

120

)

:

"";

return`

<a

href="${link}"

class="ccnews-card">

<div

class="ccnews-thumb">

<img

src="${thumb}"

alt="${ccEscapeHTML(title)}"

loading="lazy">

</div>

<div

class="ccnews-content">

<div

class="ccnews-title">

${ccEscapeHTML(title)}

</div>

<div

class="ccnews-desc">

${ccEscapeHTML(desc)}

...</div>

</div>

</a>

`;

}).join("");

}

/*==================================================
FINAL INIT
==================================================*/

async function ccInitProfile(){

await ccLoadPosts();

ccFindCurrentPost();

if(!ccCurrentPost){

return;

}

ccRenderProfile();

ccRenderAbout();

ccRenderSocial();

await ccLoadWorkData();

ccRenderWork();

ccLoadRelated();

ccRenderRelated();

await ccLoadNews();

ccRenderNews();

}
document.addEventListener(

"DOMContentLoaded",

ccInitProfile

);