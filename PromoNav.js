(function () {
"use strict";

if (!document.getElementById("promo-navigation")) {
    return;
}
/*=========================================
PREVIOUS & NEXT PROMO
=========================================*/

document.addEventListener("DOMContentLoaded",function(){

const meta=document.querySelector(".episode-meta");

if(!meta) return;

const episodeLabel=meta.querySelector(".episode-list-label")?.textContent.trim()||"";

if(!episodeLabel) return;

const currentUrl=location.href
.replace("?m=1","")
.replace(/\/$/,"");

fetch(

window.location.origin+

"/feeds/posts/default/-/"+

encodeURIComponent(episodeLabel)+

"?alt=json&max-results=500"

)

.then(response=>response.json())

.then(data=>{

const posts=data.feed.entry||[];

let currentIndex=-1;

posts.forEach((post,index)=>{

const link=post.link.find(l=>l.rel==="alternate");

if(!link) return;

const postUrl=link.href
.replace("?m=1","")
.replace(/\/$/,"");

if(postUrl===currentUrl){

currentIndex=index;

}

});

if(currentIndex===-1) return;

/*=========================
Previous Promo
=========================*/

if(currentIndex<posts.length-1){

createEpisodeCard(

posts[currentIndex+1],

"Previous Promo",

"prev-episode"

);

}

/*=========================
Next Promo
=========================*/

if(currentIndex>0){

createEpisodeCard(

posts[currentIndex-1],

"Next Promo",

"next-episode"

);

}

})

.catch(error=>console.log(error));

});

/*=========================================
CARD
=========================================*/

function createEpisodeCard(post,label,target){

let title=post.title.$t;

let url="#";

const link=post.link.find(l=>l.rel==="alternate");

if(link){

url=link.href;

}

let thumb="";

if(post.media$thumbnail){

thumb=post.media$thumbnail.url

.replace("/s72-c/","/w640-h360-p-k-no-nu/")

.replace("s72-c","w640-h360-p-k-no-nu");

}

document.getElementById(target).innerHTML=`

<a href="${url}" class="epnav-card">

<div class="epnav-thumb">

<img
src="${thumb}"
alt="${title}"
loading="lazy">

</div>

<div class="epnav-content">

<span class="epnav-label">

${label}

</span>

<h3 class="epnav-title">

${title}

</h3>

</div>

</a>

`;

}

})();