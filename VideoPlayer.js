(function(){

"use strict";

if (!document.querySelector(".epv-section")) {
    return;
}

document.addEventListener("DOMContentLoaded",function(){

const meta=document.querySelector(".episode-meta");

if(!meta) return;

/*=========================
Metadata
=========================*/

const series=meta.querySelector(".episode-series")?.textContent.trim()||"";

const seriesUrl=meta.querySelector(".episode-series-url")?.textContent.trim()||"#";

const title=meta.querySelector(".episode-title")?.textContent.trim()||"";

const description=meta.querySelector(".episode-description")?.textContent.trim()||"";

const releaseDate=meta.querySelector(".episode-release-date")?.textContent.trim()||"";

const duration=meta.querySelector(".episode-duration")?.textContent.trim()||"";

const language=meta.querySelector(".episode-language")?.textContent.trim()||"";

const rating=meta.querySelector(".episode-rating")?.textContent.trim()||"";

const youtubeId=meta.querySelector(".episode-youtube-id")?.textContent.trim()||"";

/*=========================
Breadcrumb
=========================*/

const seriesLink=document.querySelector(".epv-series-name");

seriesLink.textContent=series;

seriesLink.href=seriesUrl;

document.querySelector(".epv-current-title").textContent=title;

/*=========================
About
=========================*/

document.querySelector(".epv-description").textContent=description;

/*=========================
Meta
=========================*/

document.querySelector(".epv-release-date").textContent=releaseDate;

document.querySelector(".epv-duration").textContent=duration;

document.querySelector(".epv-language").textContent=language;

document.querySelector(".epv-rating").textContent=rating;

/*=========================
YouTube Player
=========================*/

const player=document.getElementById("epv-youtube-player");

if(player && youtubeId){

player.innerHTML=
'<iframe src="https://www.youtube.com/embed/'+youtubeId+'?rel=0&modestbranding=1&playsinline=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';

}

});

/*=========================================
VIDEO COMPONENT v2.0
PART 1/3
=========================================*/

document.addEventListener("DOMContentLoaded",function(){

const sections=document.querySelectorAll(".video-container");

sections.forEach(function(section){

initializeVideoSection(section);

});

});

/*=========================================
INITIALIZE
=========================================*/

function initializeVideoSection(section){

if(!section) return;

/*-----------------------
Settings
-----------------------*/

const settings={

label:section.dataset.label||"",

layout:section.dataset.layout||"list",

limit:parseInt(section.dataset.limit)||5,

showDescription:section.dataset.description==="true",

showPlayButton:section.dataset.playbutton==="true",

pagination:section.dataset.pagination==="true",

hideCurrent:section.dataset.current==="hide",

viewAll:section.dataset.viewall||""

};

/*-----------------------
Layout
-----------------------*/

section.classList.add(

"video-"+settings.layout

);

/*-----------------------
View All
-----------------------*/

const wrapper=

section.closest(".video-section");

if(wrapper){

const button=

wrapper.querySelector(".video-view-all");

if(button&&settings.viewAll){

button.href=settings.viewAll;

}

}

/*-----------------------
Loading
-----------------------*/

showVideoLoader(section);

/*-----------------------
Feed
-----------------------*/

fetch(

window.location.origin+

"/feeds/posts/default/-/"+

encodeURIComponent(settings.label)+

"?alt=json&max-results=500"

)

.then(function(response){

return response.json();

})

.then(function(data){

const posts=data.feed.entry||[];

renderVideoSection(

section,

posts,

settings

);

})

.catch(function(){

showVideoError(section);

});

}

/*=========================================
VIDEO COMPONENT v2.0
PART 2/3
=========================================*/

/*=========================================
GET EPISODE METADATA
=========================================*/

function getEpisodeMeta(post){

const temp=document.createElement("div");

temp.innerHTML=post.content.$t;

return{

description:
temp.querySelector(".episode-description")?.textContent.trim()||"",

duration:
temp.querySelector(".episode-duration")?.textContent.trim()||"",

language:
temp.querySelector(".episode-language")?.textContent.trim()||"",

rating:
temp.querySelector(".episode-rating")?.textContent.trim()||"",

releaseDate:
temp.querySelector(".episode-release-date")?.textContent.trim()||"",

series:
temp.querySelector(".episode-series")?.textContent.trim()||"",

seriesUrl:
temp.querySelector(".episode-series-url")?.textContent.trim()||"",

youtubeId:
temp.querySelector(".episode-youtube-id")?.textContent.trim()||""

};

}

/*=========================================
RENDER VIDEO SECTION
=========================================*/

function renderVideoSection(

section,
posts,
settings

){

section.innerHTML="";

const currentUrl=cleanPostUrl(location.href);

let count=0;

posts.forEach(function(post){

if(count>=settings.limit) return;

/*-----------------------
Post URL
-----------------------*/

let postUrl="#";

const link=post.link.find(function(item){

return item.rel==="alternate";

});

if(link){

postUrl=link.href;

}

/*-----------------------
Hide Current Post
-----------------------*/

if(

settings.hideCurrent &&

cleanPostUrl(postUrl)===currentUrl

){

return;

}

/*-----------------------
Create Card
-----------------------*/

section.insertAdjacentHTML(

"beforeend",

createVideoCard(

post,

postUrl,

settings

)

);

count++;

});

if(count===0){

showVideoEmpty(section);

}

}

/*=========================================
CREATE VIDEO CARD
=========================================*/

function createVideoCard(

post,
postUrl,
settings

){

const meta=getEpisodeMeta(post);

/*-----------------------
Title
-----------------------*/

const title=post.title.$t;

/*-----------------------
Thumbnail
-----------------------*/

let thumb=VIDEO_DEFAULT_THUMBNAIL;

if(post.media$thumbnail){

thumb=post.media$thumbnail.url

.replace("/s72-c/","/w640-h360-p-k-no-nu/")

.replace("s72-c","w640-h360-p-k-no-nu");

}

/*-----------------------
Description
-----------------------*/

const description=settings.showDescription

?

`

<p class="video-description">

${meta.description}

</p>

`

:"";

/*-----------------------
Play Button
-----------------------*/

const play=settings.showPlayButton

?

`

<div class="video-play">

<i class="fa-solid fa-play"></i>

</div>

`

:"";

/*-----------------------
Duration
-----------------------*/

const duration=meta.duration

?

`

<div class="video-duration">

${meta.duration}

</div>

`

:"";

return`

<a

href="${postUrl}"

class="video-card"

>

<div class="video-thumb">

<img

src="${thumb}"

alt="${title}"

loading="lazy"

onerror="this.src='${VIDEO_DEFAULT_THUMBNAIL}'"

>

${play}

${duration}

</div>

<div class="video-content">

<h3 class="video-title">

${title}

</h3>

${description}

</div>

</a>

`;

}

/*=========================================
VIDEO COMPONENT v2.0
PART 3/3
=========================================*/

/*=========================================
DEFAULT THUMBNAIL
=========================================*/

const VIDEO_DEFAULT_THUMBNAIL=
"https://via.placeholder.com/640x360?text=Video";

/*=========================================
CLEAN URL
=========================================*/

function cleanPostUrl(url){

return url

.replace("?m=1","")

.replace(/\/$/,"");

}

/*=========================================
LOADER
=========================================*/

function showVideoLoader(section){

section.innerHTML=

`

<div class="video-loading">

<div class="loader"></div>

</div>

`;

}

/*=========================================
EMPTY
=========================================*/

function showVideoEmpty(section){

section.innerHTML=

`

<div class="video-empty">

No Videos Available.

</div>

`;

}

/*=========================================
ERROR
=========================================*/

function showVideoError(section){

section.innerHTML=

`

<div class="video-error">

Unable to load videos.

</div>

`;

}

/*=========================================
PAGINATION
=========================================*/

/*

Reserved for v2.1

Series Page

Videos Page

Home Categories

*/

/*=========================================
SEARCH
=========================================*/

/*

Reserved for v2.2

Live Search

Category Search

*/

/*=========================================
CACHE
=========================================*/

/*

Reserved for v2.3

Memory Cache

Session Cache

*/

/*=========================================
LAZY LOAD
=========================================*/

/*

Reserved for v2.4

Intersection Observer

Infinite Scroll

*/

/*=========================================
END
=========================================*/