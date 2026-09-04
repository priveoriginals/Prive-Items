/*==================================================
NEWS VIEW ENGINE v5
PART 1 - FOUNDATION
==================================================*/

(function(){

"use strict";

if (!document.querySelector(".news-layout")) {
    return;
}

/*=========================================
CONFIG
=========================================*/

const BLOG_FEED="/feeds/posts/default/-/News?alt=json&max-results=100";

/*=========================================
CURRENT URL
=========================================*/

const currentUrl=location.href.split("?")[0].split("#")[0];

/*=========================================
METADATA
=========================================*/

const meta=document.querySelector(".news-meta");

function metaValue(name){

if(!meta)return"";

const el=meta.querySelector("."+name);

return el?el.textContent.trim():"";

}

/*=========================================
CURRENT POST
=========================================*/

const current={

category:metaValue("news-category"),

series:metaValue("news-series"),

cast:metaValue("news-cast"),

crew:metaValue("news-crew"),

description:metaValue("news-description"),

badge:metaValue("news-badge"),

hero:metaValue("news-hero-image"),

thumbnail:metaValue("news-thumbnail-image"),

featured:metaValue("news-featured"),

trending:metaValue("news-trending"),

priority:Number(metaValue("news-priority"))||999,

heroEnabled:metaValue("news-hero")

};

/*=========================================
ELEMENTS
=========================================*/

const heroImage=document.querySelector(".news-hero-img");

const heroBadge=document.querySelector(".news-hero-badge");

const titleBox=document.querySelector(".news-title");

const breadcrumbTitle=document.querySelector(".news-current-title");

const dateBox=document.querySelector(".news-date");

const categoryBox=document.querySelector(".news-post-category");

const relatedList=document.querySelector(".news-related-list");

const latestList=document.querySelector(".news-latest-list");

const trendingList=document.querySelector(".news-trending-list");

const categoryList=document.querySelector(".news-category-list");

/*=========================================
HELPERS
=========================================*/

function escapeHTML(text){

return String(text||"")

.replace(/&/g,"&amp;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;")

.replace(/"/g,"&quot;")

.replace(/'/g,"&#039;");

}

function stripHTML(text){

return String(text||"")

.replace(/<[^>]*>/g,"")

.trim();

}

function formatDate(date){

return new Date(date).toLocaleDateString("en-IN",{

day:"numeric",

month:"short",

year:"numeric"

});

}

/*=========================================
CACHE
=========================================*/

let posts=[];

/*==================================================
NEWS VIEW ENGINE v5
PART 2 - CURRENT POST
==================================================*/

/*=========================================
HERO IMAGE
=========================================*/

function renderHero(){

if(!heroImage)return;

let image=current.hero;

if(!image){

const first=document.querySelector(".news-article img");

if(first){

image=first.src;

}

}

if(image){

heroImage.src=image;

heroImage.alt=document.title;

}

}

/*=========================================
HERO BADGE
=========================================*/

function renderBadge(){

if(!heroBadge)return;

heroBadge.className="news-hero-badge";

if(!current.badge){

heroBadge.style.display="none";

return;

}

const badge=current.badge.trim();

heroBadge.textContent=badge;

heroBadge.style.display="inline-flex";

switch(badge.toLowerCase()){

case"breaking":

heroBadge.classList.add("badge-breaking");

break;

case"top story":

heroBadge.classList.add("badge-topstory");

break;

case"new":

heroBadge.classList.add("badge-new");

break;

case"upcoming":

heroBadge.classList.add("badge-upcoming");

break;

case"off air":

heroBadge.classList.add("badge-offair");

break;

case"trending":

heroBadge.classList.add("badge-trending");

break;

case"shocking":

heroBadge.classList.add("badge-shocking");

break;

}

}

/*=========================================
TITLE
=========================================*/

function renderTitle(){

const title=document.title
.replace(/\s*[-|].*$/,"")
.trim();

if(titleBox){

titleBox.textContent=title;

}

if(breadcrumbTitle){

breadcrumbTitle.textContent=title;

}

}

/*=========================================
CATEGORY
=========================================*/

function renderCategory(){

if(categoryBox){

categoryBox.textContent=current.category||"News";

}

}

/*=========================================
DATE
=========================================*/

function renderDate(){

if(!dateBox)return;

const published=document.querySelector(".published");

if(published){

dateBox.textContent=published.textContent.trim();

return;

}

const postTime=document.querySelector(".post-timestamp");

if(postTime){

dateBox.textContent=postTime.textContent.trim();

return;

}

const entryDate=document.querySelector(".date-header span");

if(entryDate){

dateBox.textContent=entryDate.textContent.trim();

}

}

/*=========================================
RENDER CURRENT POST
=========================================*/

function renderCurrentPost(){

renderHero();

renderBadge();

renderTitle();

renderCategory();

renderDate();

}

/*==================================================
NEWS VIEW ENGINE v5
PART 3 - FEED & CARD ENGINE
==================================================*/

/*=========================================
LOAD BLOG FEED
=========================================*/

async function loadFeed(){

try{

const response=await fetch(BLOG_FEED);

const json=await response.json();

posts=json.feed.entry||[];

initNews();

}catch(error){

console.error("News Feed Error:",error);

}

}

/*=========================================
GET POST LINK
=========================================*/

function getPostLink(post){

const link=post.link.find(item=>item.rel==="alternate");

return link?link.href:"";

}

/*=========================================
GET POST CATEGORY
=========================================*/

function getPostCategory(post){

const html = post.content ? post.content.$t : "";

const match = html.match(
/<div class="news-category">\s*([\s\S]*?)\s*<\/div>/i
);

if(match){
return match[1].trim();
}

if(post.category && post.category.length){
return post.category[0].term;
}

return "News";

}

/*=========================================
GET THUMBNAIL
=========================================*/

function getThumbnail(post){

const html=post.content?post.content.$t:"";

const match=html.match(

/<div class="news-thumbnail-image">\s*([\s\S]*?)\s*<\/div>/i

);

if(match){

return match[1].trim();

}

if(post.media$thumbnail){

return post.media$thumbnail.url.replace("/s72-c/","/s600/");

}

return"";

}

/*=========================================
GET HIDDEN META
=========================================*/

function getHiddenMeta(post,className){

const html=post.content?post.content.$t:"";

const match=html.match(

new RegExp(

'<div class="'+className+'">\\s*([\\s\\S]*?)\\s*<\\/div>',

"i"

)

);

return match?match[1].trim():"";

}

function getBadgeClass(badge){

switch(String(badge).trim().toLowerCase()){

case "breaking":
return "badge-breaking";

case "top story":
return "badge-topstory";

case "new":
return "badge-new";

case "upcoming":
return "badge-upcoming";

case "off air":
return "badge-offair";

case "trending":
return "badge-trending";

case "shocking":
return "badge-shocking";

default:
return "";

}

  
}
/*=========================================
CREATE NEWS CARD
=========================================*/

function createCard(post){

const title=stripHTML(post.title.$t);

const link=getPostLink(post);

const thumb=getThumbnail(post);

const badge=getHiddenMeta(post,"news-badge");

const date=formatDate(post.published.$t);

const category = getPostCategory(post);

const desc =
getHiddenMeta(post,"news-description") ||
(post.summary ? stripHTML(post.summary.$t).substring(0,90) : "");

return`

<a href="${link}" class="news-card">

<div class="news-card-thumb">

<img
src="${thumb}"
alt="${escapeHTML(title)}"
loading="lazy">

${badge?`

<div class="news-card-badge ${getBadgeClass(badge)}">

${escapeHTML(badge)}

</div>

`:""}

</div>

<div class="news-card-content">

<h3 class="news-card-title">

${escapeHTML(title)}

</h3>

<p class="news-card-desc">

${escapeHTML(desc)}

</p>

<div class="news-card-meta">

<span>${date}</span>

<span>•</span>

<span>${escapeHTML(category)}</span>

</div>

</div>

</a>

`;

}
  
  /*==================================================
NEWS VIEW ENGINE v5
PART 4 - RELATED NEWS
==================================================*/

/*=========================================
RELATED NEWS
=========================================*/

function renderRelated(){

if(!relatedList)return;

let html="";

let count=0;

posts.forEach(post=>{

if(count>=5)return;

const link=getPostLink(post);

if(link===currentUrl)return;

/* Related Metadata */

const series=getHiddenMeta(post,"news-series");

const cast=getHiddenMeta(post,"news-cast");

const crew=getHiddenMeta(post,"news-crew");

/* Match */

const matched=

(current.series&&series===current.series)||

(current.cast&&cast===current.cast)||

(current.crew&&crew===current.crew);

if(!matched)return;

html+=createCard(post);

count++;

});

if(html===""){

html='<div class="news-empty">No Related News Found</div>';

}

relatedList.innerHTML=html;

}

/*==================================================
LATEST NEWS
==================================================*/

function renderLatest(){

if(!latestList)return;

let html="";

let count=0;

posts.forEach(post=>{

if(count>=5)return;

const link=getPostLink(post);

if(link===currentUrl)return;

html+=createCard(post);

count++;

});

if(html===""){

html='<div class="news-empty">No Latest News</div>';

}

latestList.innerHTML=html;

}

/*==================================================
TRENDING NEWS
==================================================*/

function renderTrending(){

if(!trendingList)return;

let html="";

let count=0;

posts.forEach(post=>{

if(count>=5)return;

const link=getPostLink(post);

if(link===currentUrl)return;

const trending=getHiddenMeta(post,"news-trending");

if(trending.toLowerCase()!=="yes")return;

html+=createCard(post);

count++;

});

if(html===""){

html='<div class="news-empty">No Trending News</div>';

}

trendingList.innerHTML=html;

}
  
  /*==================================================
NEWS VIEW ENGINE v5
PART 5 - CATEGORIES + INIT + START
==================================================*/

/*=========================================
CATEGORIES
=========================================*/

function renderCategories(){

if(!categoryList)return;

const categories=[

{
title:"Series",
url:"/p/news.html?category=Series"
},

{
title:"Movies",
url:"/p/news.html?category=Movies"
},

{
title:"Cast & Crew",
url:"/p/news.html?category=Cast"
},

{
title:"Spoiler",
url:"/p/news.html?category=Spoiler"
},

{
title:"Privé",
url:"/p/news.html?category=Prive"
}

];

let html="";

categories.forEach(item=>{

html+=`

<a
href="${item.url}"
class="news-category-item">

${item.title}

</a>

`;

});

categoryList.innerHTML=html;

}

/*=========================================
INIT
=========================================*/

function initNews(){

renderCurrentPost();

renderRelated();

renderLatest();

renderTrending();

renderCategories();

}

/*=========================================
START
=========================================*/

if(document.readyState==="loading"){

document.addEventListener("DOMContentLoaded",loadFeed);

}else{

loadFeed();

}

/*=========================================
END
=========================================*/

})();