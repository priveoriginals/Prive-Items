/*==================================================
SERIES VIEW PAGE v2.0
SINGLE CLEAN SCRIPT
==================================================*/

(function(){

"use strict";

if (!document.querySelector(".series-view-page")) {
    return;
}

/*==================================================
CONFIG
==================================================*/

const EPISODE_PAGE_SIZE = 5;

const PROMO_PAGE_SIZE = 6;

const VIDEO_FEED_LABEL = "latestvideo";

const SERIES_FEED_LABEL = "series";
  
const CAST_CREW_FEED_LABEL = "castcrew";
  
/*==================================================
CURRENT SERIES DATA
==================================================*/

let seriesData = {

    id: "",

    title: "",

    year: "",

    language: "",

    rating: "",

    status: "",

    genres: [],

    banner: "",

    logo: "",

    poster: "",

    highlight: "",

    trailer: "",

    description: "",

    episodeLabel: "",

    seasons: [],

    cast: [],

    crew: []

};

/*==================================================
DATA ARRAYS
==================================================*/

let seriesEpisodes = [];

let seriesVideos = [];

let promoVideos = [];

let musicVideos = [];

let allSeriesPosts = [];
  
let castCrewPosts = [];
  
/*==================================================
PAGINATION
==================================================*/

let currentEpisodePage = 1;

let currentPromoPage = 1;

/*==================================================
COMMON FUNCTIONS
==================================================*/

function stripHTML(text){

    const div =
        document.createElement("div");

    div.innerHTML =
        text || "";

    return (
        div.textContent ||
        div.innerText ||
        ""
    ).trim();

}

function escapeHTML(text){

    return String(text || "")

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}

/*==================================================
POST LINK
==================================================*/

function getPostLink(post){

    if(
        !post ||
        !post.link
    ){

        return "#";

    }

    const link =
        post.link.find(
            item =>
            item.rel === "alternate"
        );

    return link
        ?
        link.href
        :
        "#";

}

/*==================================================
NORMALIZE ID
==================================================*/

function normalizeID(value){

    return String(
        value || ""
    )
    .trim()
    .toLowerCase()
    .replace(/\s+/g,"-");

}

/*==================================================
SERIES META
==================================================*/

function getMeta(className){

    const meta =
        document.querySelector(
            ".series-meta"
        );

    if(!meta){

        return "";

    }

    const element =
        meta.querySelector(
            "." + className
        );

    if(!element){

        return "";

    }

    return stripHTML(
        element.innerHTML
    );

}

/*==================================================
MULTIPLE META
==================================================*/

function getMetaList(className){

    const meta =
        document.querySelector(
            ".series-meta"
        );

    if(!meta){

        return [];

    }

    return Array.from(
        meta.querySelectorAll(
            "." + className
        )
    )
    .map(
        element =>
        stripHTML(
            element.innerHTML
        )
    )
    .filter(Boolean);

}

/*==================================================
SEASONS
==================================================*/

function getSeasons(){

    const meta =
        document.querySelector(
            ".series-meta"
        );

    if(!meta){

        return [];

    }

    return Array.from(
        meta.querySelectorAll(
            ".series-season"
        )
    )
    .map(
        season => {

            const name =
                season.querySelector(
                    ".season-name"
                );

            const url =
                season.querySelector(
                    ".season-url"
                );

            return {

                name:
                    name
                    ?
                    stripHTML(
                        name.innerHTML
                    )
                    :
                    "",

                url:
                    url
                    ?
                    stripHTML(
                        url.innerHTML
                    )
                    :
                    "#"

            };

        }
    )
    .filter(
        season =>
        season.name
    );

}

/*==================================================
CAST
==================================================*/

function getCast(){

    const meta =
        document.querySelector(
            ".series-meta"
        );

    if(!meta){

        return [];

    }

    return Array.from(
        meta.querySelectorAll(
            ".series-cast-member"
        )
    )
    .map(
        member => {

            const name =
                member.querySelector(
                    ".cast-name"
                );

            const page =
                member.querySelector(
                    ".cast-page"
                );

            const role =
                member.querySelector(
                    ".cast-role"
                );

            const priority =
                member.querySelector(
                    ".cast-priority"
                );

            return {

                name:
                    name
                    ?
                    stripHTML(
                        name.innerHTML
                    )
                    :
                    "",

                page:
                    page
                    ?
                    stripHTML(
                        page.innerHTML
                    )
                    :
                    "#",

                role:
                    role
                    ?
                    stripHTML(
                        role.innerHTML
                    )
                    :
                    "",

                priority:
                    priority
                    ?
                    Number(
                        stripHTML(
                            priority.innerHTML
                        )
                    ) || 0
                    :
                    0

            };

        }
    )
    .filter(
        person =>
        person.name
    );

}

/*==================================================
CREW
==================================================*/

function getCrew(){

    const meta =
        document.querySelector(
            ".series-meta"
        );

    if(!meta){

        return [];

    }

    return Array.from(
        meta.querySelectorAll(
            ".series-crew-member"
        )
    )
    .map(
        member => {

            const name =
                member.querySelector(
                    ".crew-name"
                );

            const page =
                member.querySelector(
                    ".crew-page"
                );

            const role =
                member.querySelector(
                    ".crew-role"
                );

            const priority =
                member.querySelector(
                    ".crew-priority"
                );

            return {

                name:
                    name
                    ?
                    stripHTML(
                        name.innerHTML
                    )
                    :
                    "",

                page:
                    page
                    ?
                    stripHTML(
                        page.innerHTML
                    )
                    :
                    "#",

                role:
                    role
                    ?
                    stripHTML(
                        role.innerHTML
                    )
                    :
                    "",

                priority:
                    priority
                    ?
                    Number(
                        stripHTML(
                            priority.innerHTML
                        )
                    ) || 0
                    :
                    0

            };

        }
    )
    .filter(
        person =>
        person.name
    );

}

  
/*==================================================
READ SERIES METADATA
==================================================*/

function readSeriesMetadata(){

    seriesData.id =
        getMeta(
            "series-id"
        );

    seriesData.year =
        getMeta(
            "series-year"
        );

    seriesData.language =
        getMeta(
            "series-language"
        );

    seriesData.rating =
        getMeta(
            "series-rating"
        );

    seriesData.status =
        getMeta(
            "series-status"
        );

    seriesData.genres =
        getMetaList(
            "series-genre"
        );

    seriesData.banner =
        getMeta(
            "series-banner"
        );

    seriesData.logo =
        getMeta(
            "series-logo"
        );

    seriesData.poster =
        getMeta(
            "series-poster"
        );

    seriesData.highlight =
        getMeta(
            "series-highlight"
        );

    seriesData.trailer =
        getMeta(
            "series-trailer-url"
        );

    seriesData.description =
        getMeta(
            "series-description"
        );

    seriesData.episodeLabel =
        getMeta(
            "series-episode-label"
        );

    
  
    seriesData.seasons =
        getSeasons();

    
    seriesData.cast =
        getCast();

    seriesData.crew =
        getCrew();
     

    /*
    Get Blogger title
    */

    const titleSelectors = [

        ".post-title",

        ".entry-title",

        "h1.post-title",

        "h1.entry-title"

    ];

    for(
        const selector
        of titleSelectors
    ){

        const element =
            document.querySelector(
                selector
            );

        if(
            element &&
            element.textContent.trim()
        ){

            seriesData.title =
                stripHTML(
                    element.textContent
                );

            break;

        }

    }

    /*
    Fallback
    */

    if(!seriesData.title){

        seriesData.title =
            document.title
            .replace(
                /\s*\|.*$/,
                ""
            )
            .trim();

    }

}

/*==================================================
HERO
==================================================*/

function renderSeriesHero(){

    const hero =
        document.querySelector(
            ".series-hero"
        );

    if(!hero){

        return;

    }

    /*
    Banner
    */

    const heroImage =
        hero.querySelector(
            ".series-hero-image"
        );

    if(heroImage){

        if(seriesData.banner){

            heroImage.style.backgroundImage =
                "url(\"" +
                seriesData.banner
                    .replace(/"/g,'\\"')
                +
                "\")";

        }
        else{

            heroImage.style.backgroundImage =
                "none";

        }

    }

    /*
    Logo
    */

    const logo =
        hero.querySelector(
            ".series-hero-logo"
        );

    if(logo){

        if(seriesData.logo){

            logo.src =
                seriesData.logo;

            logo.alt =
                seriesData.title;

            logo.style.display =
                "";

        }
        else{

            logo.style.display =
                "none";

        }

    }

    /*
    Trailer
    */

    const trailerButton =
        hero.querySelector(
            ".series-watch-trailer"
        );

    if(trailerButton){

        if(seriesData.trailer){

            trailerButton.href =
                seriesData.trailer;

            trailerButton.style.display =
                "";

        }
        else{

            trailerButton.style.display =
                "none";

        }

    }

}

/*==================================================
ABOUT INFO
==================================================*/

function renderSeriesInfo(){

    const year =
        document.querySelector(
            ".series-info-year"
        );

    const genre =
        document.querySelector(
            ".series-info-genre"
        );

    const rating =
        document.querySelector(
            ".series-info-rating"
        );

    if(year){

        year.textContent =
            seriesData.year || "";

    }

    if(genre){

        genre.textContent =
            seriesData.genres.join(
                ", "
            );

    }

    if(rating){

        rating.textContent =
            seriesData.rating || "";

    }

}

/*==================================================
DESCRIPTION
==================================================*/

function renderSeriesDescription(){

    const description =
        document.querySelector(
            "#series-description-text"
        );

    if(!description){

        return;

    }

    description.textContent =
        seriesData.description || "";

    const readMore =
        document.querySelector(
            "#series-read-more"
        );

    if(!readMore){

        return;

    }

    if(
        !seriesData.description ||
        seriesData.description.length <= 280
    ){

        readMore.style.display =
            "none";

        description.classList.add(
            "expanded"
        );

        return;

    }

    readMore.style.display =
        "inline-flex";

    readMore.onclick =
        function(){

            const expanded =
                description.classList.toggle(
                    "expanded"
                );

            readMore.classList.toggle(
                "active",
                expanded
            );

            const textNode =
                Array.from(
                    readMore.childNodes
                )
                .find(
                    node =>
                    node.nodeType ===
                    Node.TEXT_NODE
                );

            if(textNode){

                textNode.textContent =
                    expanded
                    ?
                    "Read Less "
                    :
                    "Read More ";

            }

        };

}

/*==================================================
ABOUT CREDITS
==================================================*/

function renderAboutCredits(){

    const container =
        document.querySelector(
            "#series-about-credits"
        );

    if(!container){

        return;

    }

    const credits = [];

    seriesData.crew
    .forEach(
        person => {

            if(
                person.role &&
                person.name
            ){

                credits.push({

                    role:
                        person.role,

                    name:
                        person.name

                });

            }

        }
    );

    if(
        seriesData.cast.length
    ){

        credits.push({

            role:
                "Main Cast",

            name:
                seriesData.cast
                .map(
                    person =>
                    person.name
                )
                .join(", ")

        });

    }

    if(!credits.length){

        container.innerHTML =
            "";

        return;

    }

    container.innerHTML =
        credits
        .map(
            credit => `

                <div class="series-credit-row">

                    <strong>
                        ${escapeHTML(
                            credit.role
                        )}:
                    </strong>

                    <span>
                        ${escapeHTML(
                            credit.name
                        )}
                    </span>

                </div>

            `
        )
        .join("");

}

/*==================================================
SHARE
==================================================*/

function bindSeriesShare(){

    const button =
        document.querySelector(
            ".series-share"
        );

    if(!button){

        return;

    }

    if(
        button.dataset
        .shareBound
    ){

        return;

    }

    button.dataset
        .shareBound =
        "true";

    button.onclick =
        async function(){

            const shareData = {

                title:
                    seriesData.title ||
                    document.title,

                text:
                    seriesData.highlight ||
                    seriesData.title ||
                    document.title,

                url:
                    window.location.href

            };

            try{

                if(
                    navigator.share
                ){

                    await navigator.share(
                        shareData
                    );

                }
                else if(
                    navigator.clipboard
                ){

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    button.classList.add(
                        "copied"
                    );

                    setTimeout(
                        () => {

                            button.classList.remove(
                                "copied"
                            );

                        },
                        1500
                    );

                }

            }
            catch(error){

                console.log(
                    "Share cancelled."
                );

            }

        };

}

/*==================================================
SEASON LINKS
==================================================*/

function renderSeasonLinks(){

    const container =
        document.querySelector(
            "#series-season-links"
        );

    if(!container){

        return;

    }

    if(
        !seriesData.seasons.length
    ){

        container.innerHTML =
            "";

        return;

    }

    container.innerHTML =
        seriesData.seasons
        .map(
            season => `

                <a

                    class="series-season-link"

                    href="${escapeHTML(
                        season.url
                    )}">

                    <span>
                        ${escapeHTML(
                            season.name
                        )}
                    </span>

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            `
        )
        .join("");

}

/*==================================================
EPISODE META FROM BLOGGER POST
==================================================*/

function getEpisodeMeta(
    post,
    className
){

    const html =
        post &&
        post.content &&
        post.content.$t
        ?
        post.content.$t
        :
        "";

    if(!html){

        return "";

    }

    /*
    Supports:
    <span class="episode-duration">
    <div class="episode-duration">
    and additional classes
    */

    const regex =
        new RegExp(

            '<(?:span|div)'
            +
            '\\b[^>]*'
            +
            '\\bclass=["\'][^"\']*\\b'
            +
            className
            +
            '\\b[^"\']*["\']'
            +
            '[^>]*>'
            +
            '\\s*([\\s\\S]*?)'
            +
            '<\\/(?:span|div)>',

            "i"

        );

    const match =
        html.match(
            regex
        );

    if(!match){

        return "";

    }

    return stripHTML(
        match[1]
    );

}

/*==================================================
EPISODE IMAGE
==================================================*/

function getEpisodeThumbnail(post){

    const image =
        getEpisodeMeta(
            post,
            "episode-image"
        );

    if(image){

        return image;

    }

    const videoImage =
        getEpisodeMeta(
            post,
            "video-thumbnail"
        );

    if(videoImage){

        return videoImage;

    }

    if(
        post.media$thumbnail &&
        post.media$thumbnail.url
    ){

        return post.media$thumbnail.url
            .replace(
                "/s72-c/",
                "/s600/"
            );

    }

    return "";

}

/*==================================================
EPISODE DURATION
==================================================*/

function getEpisodeDuration(post){

    const duration =
        getEpisodeMeta(
            post,
            "episode-duration"
        );

    if(duration){

        return duration;

    }

    return getEpisodeMeta(
        post,
        "video-duration"
    );

}

/*==================================================
EPISODE DESCRIPTION
==================================================*/

function getEpisodeDescription(post){

    const description =
        getEpisodeMeta(
            post,
            "episode-description"
        );

    if(description){

        return description;

    }

    return getEpisodeMeta(
        post,
        "video-description"
    );

}

/*==================================================
EPISODE TITLE
==================================================*/

function getEpisodeTitle(post){

    const metaTitle =
        getEpisodeMeta(
            post,
            "episode-title"
        );

    if(metaTitle){

        return metaTitle;

    }

    return stripHTML(
        post &&
        post.title &&
        post.title.$t
        ?
        post.title.$t
        :
        ""
    );

}

/*==================================================
LOAD EPISODES
==================================================*/

async function loadSeriesEpisodes(){

    if(
        !seriesData.episodeLabel
    ){

        seriesEpisodes = [];

        renderEpisodeCount(0);

        renderEpisodes();

        return;

    }

    const label =
        encodeURIComponent(
            seriesData.episodeLabel
        );

    const feedURL =
        "/feeds/posts/default/-/" +
        label +
        "?alt=json&max-results=100";

    try{

        const response =
            await fetch(
                feedURL
            );

        if(!response.ok){

            throw new Error(
                "Episode feed failed"
            );

        }

        const json =
            await response.json();

        seriesEpisodes =
            json.feed &&
            json.feed.entry
            ?
            json.feed.entry
            :
            [];

        seriesEpisodes.sort(
            (a,b) => {

                return (
                    new Date(
                        b.published.$t
                    )
                    -
                    new Date(
                        a.published.$t
                    )
                );

            }
        );

        currentEpisodePage =
            1;

        renderEpisodeCount(
            seriesEpisodes.length
        );

        renderEpisodes();

    }
    catch(error){

        console.error(
            "Series Episode Feed:",
            error
        );

        seriesEpisodes = [];

        renderEpisodeCount(0);

        renderEpisodes();

    }

}

/*==================================================
EPISODE COUNT
==================================================*/

function renderEpisodeCount(
    count
){

    const element =
        document.querySelector(
            ".series-info-episodes"
        );

    if(!element){

        return;

    }

    element.textContent =
        count +
        (
            count === 1
            ?
            " Episode"
            :
            " Episodes"
        );

}

/*==================================================
EPISODE CARD
==================================================*/

function createEpisodeCard(post){

    const title =
        getEpisodeTitle(
            post
        );

    const link =
        getPostLink(
            post
        );

    const thumbnail =
        getEpisodeThumbnail(
            post
        );

    const duration =
        getEpisodeDuration(
            post
        );

const description =
        getEpisodeDescription(
            post
        );

    return `

        <a

            href="${escapeHTML(
                link
            )}"

            class="series-episode-item">

            <div
                class="series-episode-thumb">

                ${
                    thumbnail
                    ?
                    `

                    <img

                        src="${escapeHTML(
                            thumbnail
                        )}"

                        alt="${escapeHTML(
                            title
                        )}"

                        loading="lazy">

                    `
                    :
                    ""
                }
     ${
                duration
                ?
                `

                <span
                    class="series-episode-duration">

                    ${escapeHTML(
                        duration
                    )}

                </span>

                `
                :
                ""
            }
            </div>

            <div
                class="series-episode-content">

                <h3
                    class="series-episode-title">

                    ${escapeHTML(
                        title
                    )}

                </h3>

                ${
                    description
                    ?
                    `

                    <p
                        class="series-episode-description">

                        ${escapeHTML(
                            description
                        )}

                    </p>

                    `
                    :
                    ""
                }

            </div>

        </a>

    `;

}

/*==================================================
RENDER EPISODES
==================================================*/

function renderEpisodes(){

    const container =
        document.querySelector(
            "#series-episodes-list"
        );

    if(!container){

        return;

    }

    const totalPages =
        Math.ceil(
            seriesEpisodes.length /
            EPISODE_PAGE_SIZE
        );

    if(totalPages === 0){

        container.innerHTML = `
            <div class="series-empty">
                No Episodes Found
            </div>
        `;

        renderEpisodePagination();
        return;

    }

    if(currentEpisodePage > totalPages){

        currentEpisodePage = totalPages;

    }

    const start =
        (currentEpisodePage - 1)
        * EPISODE_PAGE_SIZE;

    const pageItems =
        seriesEpisodes.slice(
            start,
            start + EPISODE_PAGE_SIZE
        );

    container.classList.add(
        "series-page-out"
    );

    setTimeout(function(){

        container.innerHTML =
            pageItems
            .map(createEpisodeCard)
            .join("");

        bindImageFallback();

        container.classList.remove(
            "series-page-out"
        );

        container.classList.add(
            "series-page-in"
        );

        requestAnimationFrame(function(){

            container.classList.remove(
                "series-page-in"
            );

        });

    },220);

    renderEpisodePagination();

}

/*==================================================
EPISODE PAGINATION
==================================================*/

function renderEpisodePagination(){

    const container =
        document.querySelector(
            "#series-episodes-pagination"
        );

    if(!container){

        return;

    }

    const totalPages =
        Math.ceil(
            seriesEpisodes.length /
            EPISODE_PAGE_SIZE
        );

    if(
        totalPages <= 1
    ){

        container.innerHTML =
            "";

        return;

    }

    let html = "";

    html += `

        <button

            type="button"

            class="series-page-prev"

            ${
                currentEpisodePage === 1
                ?
                "disabled"
                :
                ""
            }>

            ‹

        </button>

    `;

 const pages = [];

if(totalPages <= 7){

    for(let i=1;i<=totalPages;i++){

        pages.push(i);

    }

}

else{

    if(currentEpisodePage <= 4){

        pages.push(1,2,3,4,5,"...",totalPages);

    }

    else if(currentEpisodePage >= totalPages-3){

        pages.push(
            1,
            "...",
            totalPages-4,
            totalPages-3,
            totalPages-2,
            totalPages-1,
            totalPages
        );

    }

    else{

        pages.push(
            1,
            "...",
            currentEpisodePage-1,
            currentEpisodePage,
            currentEpisodePage+1,
            "...",
            totalPages
        );

    }

}

pages.forEach(page=>{

    if(page==="..."){

        html+=`
            <span class="series-page-dots">
                ...
            </span>
        `;

    }

    else{

        html+=`

            <button
                type="button"
                class="series-page-number ${
                    page===currentEpisodePage
                    ?"active":""
                }"
                data-page="${page}">

                ${page}

            </button>

        `;

    }

});

    html += `

        <button

            type="button"

            class="series-page-next"

            ${
                currentEpisodePage === totalPages
                ?
                "disabled"
                :
                ""
            }>

            ›

        </button>

    `;

    container.innerHTML =
        html;

    container
    .querySelectorAll(
        "button"
    )
    .forEach(
        button => {

            button.onclick =
                function(){

                    if(
                        this.disabled
                    ){

                        return;

                    }

                    if(
                        this.classList.contains(
                            "series-page-prev"
                        )
                    ){

                        currentEpisodePage--;

                    }

                    else if(
                        this.classList.contains(
                            "series-page-next"
                        )
                    ){

                        currentEpisodePage++;

                    }

                    else{

                        currentEpisodePage =
                            Number(
                                this.dataset.page
                            );

                    }

                    const list =
document.querySelector(
"#series-episodes-list"
);

list.classList.add(
"series-page-changing"
);

setTimeout(()=>{

    renderEpisodes();

    list.classList.remove(
        "series-page-changing"
    );

    scrollToEpisodeSection();

},250);

                };

        }
    );

}

/*==================================================
SCROLL EPISODES
==================================================*/

function scrollToEpisodeSection(){

    const section =
        document.querySelector(
            ".series-episodes-section"
        );

    if(!section){

        return;

    }

    window.scrollTo({

        top:
            section
            .getBoundingClientRect()
            .top
            +
            window.pageYOffset
            -
            20,

        behavior:
            "smooth"

    });

}

/*==================================================
VIDEO META
==================================================*/

function getVideoMeta(
    post,
    className
){

    const html =
        post &&
        post.content &&
        post.content.$t
        ?
        post.content.$t
        :
        "";

    if(!html){

        return "";

    }

    const regex =
        new RegExp(

            '<(?:span|div)'
            +
            '\\b[^>]*'
            +
            '\\bclass=["\'][^"\']*\\b'
            +
            className
            +
            '\\b[^"\']*["\']'
            +
            '[^>]*>'
            +
            '\\s*([\\s\\S]*?)'
            +
            '<\\/(?:span|div)>',

            "i"

        );

    const match =
        html.match(
            regex
        );

    if(!match){

        return "";

    }

    return stripHTML(
        match[1]
    );

}
  
  /*==================================================
CAST CREW META
==================================================*/

function getCastCrewMeta(
    post,
    className
){

    const html =
        post &&
        post.content &&
        post.content.$t
        ?
        post.content.$t
        :
        "";

    if(!html){

        return "";

    }

    const regex =
        new RegExp(

            '<(?:span|div)' +
            '\\b[^>]*' +
            '\\bclass=["\'][^"\']*\\b' +
            className +
            '\\b[^"\']*["\']' +
            '[^>]*>' +
            '\\s*([\\s\\S]*?)' +
            '<\\/(?:span|div)>',

            "i"

        );

    const match =
        html.match(regex);

    return match
        ?
        stripHTML(match[1])
        :
        "";

}
  /*==================================================
VIDEO SERIES ID
==================================================*/

function getVideoSeriesID(post){

    return normalizeID(
        getVideoMeta(
            post,
            "series-id"
        )
    );

}

/*==================================================
VIDEO THUMBNAIL
==================================================*/

function getSeriesVideoThumbnail(
    post
){

    const thumbnail =
        getVideoMeta(
            post,
            "video-thumbnail"
        );

    if(thumbnail){

        return thumbnail;

    }

    const episodeImage =
        getVideoMeta(
            post,
            "episode-image"
        );

    if(episodeImage){

        return episodeImage;

    }

    if(
        post.media$thumbnail &&
        post.media$thumbnail.url
    ){

        return post.media$thumbnail.url
            .replace(
                "/s72-c/",
                "/s600/"
            );

    }

    return "";

}

/*==================================================
VIDEO DURATION
==================================================*/

function getSeriesVideoDuration(
    post
){

    const duration =
        getVideoMeta(
            post,
            "episode-duration"
        );

    if(duration){

        return duration;

    }

    return getVideoMeta(
        post,
        "episode-duration"
    );

}

/*==================================================
VIDEO LABEL
==================================================*/

function hasVideoLabel(
    post,
    label
){

    if(
        !post ||
        !post.category
    ){

        return false;

    }

    return post.category.some(
        category =>

            String(
                category.term || ""
            )
            .trim()
            .toLowerCase()
            ===
            String(label)
            .trim()
            .toLowerCase()
    );

}

/*==================================================
LOAD PROMO + MUSIC VIDEOS
==================================================*/

async function loadSeriesVideos(){

    const feedURL =
        "/feeds/posts/default/-/" +
        encodeURIComponent(
            VIDEO_FEED_LABEL
        )
        +
        "?alt=json&max-results=100";

    try{

        const response =
            await fetch(
                feedURL
            );

        if(!response.ok){

            throw new Error(
                "Video feed failed"
            );

        }

        const json =
            await response.json();

        seriesVideos =
            json.feed &&
            json.feed.entry
            ?
            json.feed.entry
            :
            [];

        seriesVideos.sort(
            (a,b) => {

                return (
                    new Date(
                        b.published.$t
                    )
                    -
                    new Date(
                        a.published.$t
                    )
                );

            }
        );

        const currentID =
            normalizeID(
                seriesData.id
            );

        /*
        Only current series videos
        */

        if(currentID){

            seriesVideos =
                seriesVideos.filter(
                    post =>
                        getVideoSeriesID(
                            post
                        )
                        ===
                        currentID
                );

        }
        else{

            seriesVideos = [];

        }

        /*
        Promos
        */

        promoVideos =
            seriesVideos.filter(
                post =>
                    hasVideoLabel(
                        post,
                        "latestpromo"
                    )
            );

        /*
        Music
        */

        musicVideos =
            seriesVideos.filter(
                post =>
                    hasVideoLabel(
                        post,
                        "musicvideo"
                    )
            );

        currentPromoPage =
            1;

        renderPromos();

        renderMusicVideos();

    }
    catch(error){

        console.error(
            "Series Video Feed:",
            error
        );

        seriesVideos = [];

        promoVideos = [];

        musicVideos = [];

        renderPromos();

        renderMusicVideos();

    }

}

  /*==================================================
LOAD CAST CREW POSTS
==================================================*/

async function loadCastCrewPosts(){

    try{

        const response =
            await fetch(

                "/feeds/posts/default/-/" +

                encodeURIComponent(
                    CAST_CREW_FEED_LABEL
                ) +

                "?alt=json&max-results=100"

            );

        if(!response.ok){

            throw new Error(
                "Cast Crew Feed Failed"
            );

        }

        const json =
            await response.json();

        castCrewPosts =
            json.feed &&
            json.feed.entry
            ?
            json.feed.entry
            :
            [];

    }

    catch(error){

        console.error(
            "Cast Crew Feed:",
            error
        );

        castCrewPosts = [];

    }

}

/*==================================================
VIDEO LINK
==================================================*/

function getSeriesVideoLink(
    post
){

    return getPostLink(
        post
    );

}

/*==================================================
PROMO CARD
==================================================*/

function createPromoCard(post){

    const title =
        stripHTML(
            post.title &&
            post.title.$t
            ?
            post.title.$t
            :
            ""
        );

    const thumbnail =
        getSeriesVideoThumbnail(
            post
        );

    const duration =
        getSeriesVideoDuration(
            post
        );

    const link =
        getSeriesVideoLink(
            post
        );

    return `

        <a

            href="${escapeHTML(
                link
            )}"

            class="series-promo-card">

            <div
                class="series-promo-thumb">

                ${
                    thumbnail
                    ?
                    `

                    <img

                        src="${escapeHTML(
                            thumbnail
                        )}"

                        alt="${escapeHTML(
                            title
                        )}"

                        loading="lazy">

                    `
                    :
                    ""
                }

                <span
                    class="series-promo-play">

                    ▶

                </span>

                ${
                    duration
                    ?
                    `

                    <span
                        class="series-promo-duration">

                        ${escapeHTML(
                            duration
                        )}

                    </span>

                    `
                    :
                    ""
                }

            </div>

            <h3
                class="series-promo-title">

                ${escapeHTML(
                    title
                )}

            </h3>

        </a>

    `;

}

/*==================================================
RENDER PROMOS
==================================================*/

function renderPromos(){

    const container =
        document.querySelector(
            "#series-promos-grid"
        );

    if(!container){

        return;

    }

    const start =
        (
            currentPromoPage - 1
        )
        *
        PROMO_PAGE_SIZE;

    const current =
        promoVideos.slice(
            start,
            start +
            PROMO_PAGE_SIZE
        );

    if(!current.length){

        container.innerHTML = `

            <div class="series-empty">

                No Promos Found

            </div>

        `;

        renderPromoPagination();

        return;

    }

    container.classList.add(
        "series-promo-page-out"
    );

    setTimeout(function(){

        container.innerHTML =
            current
            .map(
                createPromoCard
            )
            .join("");

        container.classList.remove(
            "series-promo-page-out"
        );

        container.classList.add(
            "series-promo-page-in"
        );

        requestAnimationFrame(function(){

            container.classList.remove(
                "series-promo-page-in"
            );

        });

    },220);

    renderPromoPagination();

}

/*==================================================
PROMO PAGINATION
==================================================*/

function renderPromoPagination(){

    const container =
        document.querySelector(
            "#series-promos-pagination"
        );

    if(!container){

        return;

    }

    const totalPages =
        Math.ceil(
            promoVideos.length /
            PROMO_PAGE_SIZE
        );

    if(
        totalPages <= 1
    ){

        container.innerHTML =
            "";

        return;

    }

    let html = "";

    html += `

        <button

            type="button"

            class="series-page-prev"

            ${
                currentPromoPage === 1
                ?
                "disabled"
                :
                ""
            }>

            ‹

        </button>

    `;

   const pages = [];

if(totalPages <= 7){

    for(let i = 1; i <= totalPages; i++){

        pages.push(i);

    }

}

else{

    if(currentPromoPage <= 4){

        pages.push(
            1,2,3,4,5,"...",totalPages
        );

    }

    else if(currentPromoPage >= totalPages - 3){

        pages.push(
            1,
            "...",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
        );

    }

    else{

        pages.push(
            1,
            "...",
            currentPromoPage - 1,
            currentPromoPage,
            currentPromoPage + 1,
            "...",
            totalPages
        );

    }

}

pages.forEach(function(page){

    if(page === "..."){

        html += `
            <span class="series-page-dots">
                ...
            </span>
        `;

    }

    else{

        html += `

            <button

                type="button"

                class="series-page-number ${
                    page === currentPromoPage
                    ?
                    "active"
                    :
                    ""
                }"

                data-promo-page="${page}">

                    ${page}

            </button>

        `;

    }

});

    html += `

        <button

            type="button"

            class="series-page-next"

            ${
                currentPromoPage === totalPages
                ?
                "disabled"
                :
                ""
            }>

            ›

        </button>

    `;

    container.innerHTML =
        html;

    container
    .querySelectorAll(
        "button"
    )
    .forEach(
        button => {

            button.onclick =
                function(){

                    if(
                        this.disabled
                    ){

                        return;

                    }

                    if(
                        this.classList.contains(
                            "series-page-prev"
                        )
                    ){

                        currentPromoPage--;

                    }

                    else if(
                        this.classList.contains(
                            "series-page-next"
                        )
                    ){

                        currentPromoPage++;

                    }

                    else{

                        currentPromoPage =
                            Number(
                                this.dataset
                                .promoPage
                            );

                    }

                    renderPromos();

                };

        }
    );

}

/*==================================================
MUSIC CARD
==================================================*/

function createMusicCard(post){

    const title =
        stripHTML(
            post.title &&
            post.title.$t
            ?
            post.title.$t
            :
            ""
        );

    const thumbnail =
        getSeriesVideoThumbnail(
            post
        );

    const duration =
        getSeriesVideoDuration(
            post
        );

    const link =
        getSeriesVideoLink(
            post
        );

    return `

        <a

            href="${escapeHTML(
                link
            )}"

            class="series-music-card">

            <div
                class="series-music-thumb">

                ${
                    thumbnail
                    ?
                    `

                    <img

                        src="${escapeHTML(
                            thumbnail
                        )}"

                        alt="${escapeHTML(
                            title
                        )}"

                        loading="lazy">

                    `
                    :
                    ""
                }

                <span
                    class="series-music-play">

                    ▶

                </span>

                ${
                    duration
                    ?
                    `

                    <span
                        class="series-music-duration">

                        ${escapeHTML(
                            duration
                        )}

                    </span>

                    `
                    :
                    ""
                }

            </div>

            <h3
                class="series-music-title">

                ${escapeHTML(
                    title
                )}

            </h3>

        </a>

    `;

}

/*==================================================
RENDER MUSIC
==================================================*/

function renderMusicVideos(){

    const container =
        document.querySelector(
            "#series-music-scroll"
        );

    if(!container){

        return;

    }

    if(!musicVideos.length){

        container.innerHTML = `

            <div class="series-empty">

                No Music Videos Found

            </div>

        `;

        return;

    }

    container.innerHTML =
        musicVideos
        .map(
            createMusicCard
        )
        .join("");

    bindHorizontalScroll(
        container
    );

    bindImageFallback();

}

/*==================================================
HORIZONTAL SCROLL
==================================================*/

function bindHorizontalScroll(
    container
){

    if(!container){

        return;

    }

    const wrapper =
        container.parentElement;

    if(!wrapper){

        return;

    }

    const buttons =
        wrapper.querySelectorAll(
            ".series-scroll-prev, .series-scroll-next"
        );

    if(
        buttons.length < 2
    ){

        return;

    }

    buttons[0].onclick =
        function(){

            container.scrollBy({

                left:
                    -(
                        container.clientWidth
                        *
                        .85
                    ),

                behavior:
                    "smooth"

            });

        };

    buttons[1].onclick =
        function(){

            container.scrollBy({

                left:
                    container.clientWidth
                    *
                    .85,

                behavior:
                    "smooth"

            });

        };

}

  /*==================================================
CAST & CREW CARD
==================================================*/

function createCastCrewCard(person){

    return `

        <a

            href="${escapeHTML(
                person.link || "#"
            )}"

            class="series-cast-card">

            <div class="series-cast-thumb">

                <img

                    src="${escapeHTML(
                        person.image || ""
                    )}"

                    alt="${escapeHTML(
                        person.name
                    )}"

                    loading="lazy">

                <div
                    class="series-cast-info">

                    <strong>

                        ${escapeHTML(
                            person.name
                        )}

                    </strong>

                    <span>

                        ${escapeHTML(
                            person.role
                        )}

                    </span>

                </div>

            </div>

        </a>

    `;

}
  
/*==================================================
RELATED SERIES META
==================================================*/

function getPostSeriesMeta(
    post,
    className
){

    const html =
        post &&
        post.content &&
        post.content.$t
        ?
        post.content.$t
        :
        "";

    if(!html){

        return [];

    }

    const regex =
        new RegExp(

            '<(?:span|div)'
            +
            '\\b[^>]*'
            +
            '\\bclass=["\'][^"\']*\\b'
            +
            className
            +
            '\\b[^"\']*["\']'
            +
            '[^>]*>'
            +
            '\\s*([\\s\\S]*?)'
            +
            '<\\/(?:span|div)>',

            "gi"

        );

    const values = [];

    let match;

    while(
        (
            match =
            regex.exec(html)
        ) !== null
    ){

        const value =
            stripHTML(
                match[1]
            );

        if(value){

            values.push(
                value
            );

        }

    }

    return values;

}

/*==================================================
RELATED SERIES GENRES
==================================================*/

function getSeriesGenresFromPost(
    post
){

    return getPostSeriesMeta(
        post,
        "series-genre"
    )
    .map(
        genre =>
        genre
        .toLowerCase()
        .trim()
    )
    .filter(Boolean);

}

/*==================================================
RELATED SCORE
==================================================*/

function getRelatedSeriesScore(
    post
){

    const currentGenres =
        seriesData.genres
        .map(
            genre =>
            genre
            .toLowerCase()
            .trim()
        )
        .filter(Boolean);

    const otherGenres =
        getSeriesGenresFromPost(
            post
        );

    if(
        !currentGenres.length ||
        !otherGenres.length
    ){

        return 0;

    }

    /*
    Every current genre
    must exist in other series.
    */

    const matches =
        currentGenres.every(
            genre =>
            otherGenres.includes(
                genre
            )
        );

    if(!matches){

        return 0;

    }

    return currentGenres.length;

}

/*==================================================
RELATED SERIES CARD
==================================================*/

function createRelatedSeriesCard(
    post
){

    const title =
        stripHTML(
            post.title &&
            post.title.$t
            ?
            post.title.$t
            :
            ""
        );

    const link =
        getPostLink(
            post
        );

    const poster =
        getPostSeriesMeta(
            post,
            "series-poster"
        )[0]
        ||
        "";

    if(!poster){

        return "";

    }

    return `

        <a

            href="${escapeHTML(
                link
            )}"

            class="series-related-card"

            aria-label="${escapeHTML(
                title
            )}">

            <img

                src="${escapeHTML(
                    poster
                )}"

                alt="${escapeHTML(
                    title
                )}"

                loading="lazy">

        </a>

    `;

}

/*==================================================
LOAD CAST CREW POSTS
==================================================*/

async function loadCastCrewPosts(){

    try{

        const response =
            await fetch(

                "/feeds/posts/default/-/" +
                encodeURIComponent(CAST_CREW_FEED_LABEL) +
                "?alt=json&max-results=100"

            );

        if(!response.ok){

            throw new Error("Cast Feed Error");

        }

        const json =
            await response.json();

        castCrewPosts =
            json.feed && json.feed.entry
            ? json.feed.entry
            : [];

    }

    catch(error){

        console.error(
            "Cast Feed:",
            error
        );

        castCrewPosts = [];

    }

}
  /*==================================================
FIND CAST CREW POST
==================================================*/

function findCastCrewPost(name){

    const target =
        normalizeID(name);

    return castCrewPosts.find(function(post){

        return normalizeID(
            stripHTML(post.title.$t)
        ) === target;

    }) || null;

}
  /*==================================================
GET CAST CREW IMAGE
==================================================*/

function getCastCrewImage(post){

    return getCastCrewMeta(
        post,
        "cast-photo"
    );

}

/*==================================================
GET CAST CREW PRIORITY
==================================================*/

function getCastCrewPriority(post){

    return Number(

        getCastCrewMeta(
            post,
            "cast-priority"
        )

    ) || 0;

}
  
  /*==================================================
RENDER CAST CREW
==================================================*/

function renderCastCrew(){

    const container =
        document.querySelector(
            "#series-cast-scroll"
        );

    if(!container){

        return;

    }

    const people = [];

    seriesData.cast.forEach(function(member){

        const post =
            findCastCrewPost(
                member.name
            );

        if(!post){

            return;

        }

        people.push({

            name:
                stripHTML(post.title.$t),

            role:
                member.role,

            image:
                getCastCrewImage(post),

            priority:
                getCastCrewPriority(post),

            link:
                getPostLink(post)

        });

    });

    seriesData.crew.forEach(function(member){

        const post =
            findCastCrewPost(
                member.name
            );

        if(!post){

            return;

        }

        people.push({

            name:
                stripHTML(post.title.$t),

            role:
                member.role,

            image:
                getCastCrewImage(post),

            priority:
                getCastCrewPriority(post),

            link:
                getPostLink(post)

        });

    });

    people.sort(function(a,b){

        return b.priority - a.priority;

    });

    if(!people.length){

        container.innerHTML =
            '<div class="series-empty">No Cast &amp; Crew Found</div>';

        return;

    }

    container.innerHTML =
        people.map(function(person){

            return `

<a href="${escapeHTML(person.link)}" class="series-cast-card">

<div class="series-cast-thumb">

<img
src="${escapeHTML(person.image)}"
alt="${escapeHTML(person.name)}"
loading="lazy">

<div class="series-cast-info">

<strong>

${escapeHTML(person.name)}

</strong>

<span>

${escapeHTML(person.role)}

</span>

</div>

</div>

</a>

`;

        }).join("");

    bindHorizontalScroll(container);

    bindImageFallback();

}
  
/*==================================================
LOAD RELATED SERIES
==================================================*/

async function loadRelatedSeries(){

    const container =
        document.querySelector(
            "#series-related-scroll"
        );

    if(!container){

        return;

    }

    const feedURL =
        "/feeds/posts/default/-/" +
        encodeURIComponent(
            SERIES_FEED_LABEL
        )
        +
        "?alt=json&max-results=100";

    try{

        const response =
            await fetch(
                feedURL
            );

        if(!response.ok){

            throw new Error(
                "Series feed failed"
            );

        }

        const json =
            await response.json();

        allSeriesPosts =
            json.feed &&
            json.feed.entry
            ?
            json.feed.entry
            :
            [];

        renderRelatedSeries();

    }
    catch(error){

        console.error(
            "Related Series Feed:",
            error
        );

        allSeriesPosts = [];

        container.innerHTML = `

            <div class="series-empty">

                No Related Series Found

            </div>

        `;

    }

}
  
/*==================================================
RENDER RELATED SERIES
==================================================*/

function renderRelatedSeries(){

    const container =
        document.querySelector(
            "#series-related-scroll"
        );

    if(!container){

        return;

    }

    const currentID =
        normalizeID(
            seriesData.id
        );

    const related =
        allSeriesPosts

        .filter(
            post => {

                const ids =
                    getPostSeriesMeta(
                        post,
                        "series-id"
                    );

                const postID =
                    ids.length
                    ?
                    normalizeID(
                        ids[0]
                    )
                    :
                    "";

                if(
                    currentID &&
                    postID === currentID
                ){

                    return false;

                }

                return true;

            }
        )

        .map(
            post => ({

                post:
                    post,

                score:
                    getRelatedSeriesScore(
                        post
                    )

            })
        )

        .filter(
            item =>
            item.score > 0
        )

        .sort(
            (a,b) =>
            b.score -
            a.score
        )

        .slice(
            0,
            6
        );

    const cards =
        related
        .map(
            item =>
            createRelatedSeriesCard(
                item.post
            )
        )
        .filter(Boolean)
        .join("");

    if(!cards){

        container.innerHTML = `

            <div class="series-empty">

                No Related Series Found

            </div>

        `;

        return;

    }

    container.innerHTML =
        cards;

    bindHorizontalScroll(
        container
    );

    bindImageFallback();

}

/*==================================================
IMAGE FALLBACK
==================================================*/

function bindImageFallback(){

    document
    .querySelectorAll(
        ".series-view-page img"
    )
    .forEach(
        img => {

            if(
                img.dataset
                .fallbackBound
            ){

                return;

            }

            img.dataset
                .fallbackBound =
                "true";

            img.addEventListener(
                "error",
                function(){

                    this.onerror =
                        null;

                    this.style.objectFit =
                        "cover";

                    this.src =
                        "data:image/svg+xml;charset=UTF-8,"
                        +
                        encodeURIComponent(`

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 800 1000">

                                <rect
                                    width="800"
                                    height="1000"
                                    fill="#151515"/>

                                <text
                                    x="400"
                                    y="500"
                                    text-anchor="middle"
                                    dominant-baseline="middle"
                                    fill="#777"
                                    font-size="32"
                                    font-family="Arial">

                                    Privé Originals

                                </text>

                            </svg>

                        `);

                }
            );

        }
    );

}

/*==================================================
HORIZONTAL DRAG
==================================================*/

function enableHorizontalDrag(
    container
){

    if(!container){

        return;

    }

    if(
        container.dataset
        .dragEnabled
    ){

        return;

    }

    container.dataset
        .dragEnabled =
        "true";

    let isDown = false;

    let startX = 0;

    let scrollLeft = 0;

    container.addEventListener(
        "mousedown",
        function(event){

            isDown = true;

            startX =
                event.pageX -
                container.offsetLeft;

            scrollLeft =
                container.scrollLeft;

        }
    );

    container.addEventListener(
        "mouseleave",
        function(){

            isDown = false;

        }
    );

    container.addEventListener(
        "mouseup",
        function(){

            isDown = false;

        }
    );

    container.addEventListener(
        "mousemove",
        function(event){

            if(!isDown){

                return;

            }

            event.preventDefault();

            const x =
                event.pageX -
                container.offsetLeft;

            const walk =
                (x - startX) * 1.5;

            container.scrollLeft =
                scrollLeft - walk;

        }
    );

}

/*==================================================
ENABLE HORIZONTAL DRAG
==================================================*/

function enableSeriesHorizontalDrag(){

    const selectors = [

        "#series-music-scroll",

        "#series-cast-scroll",

        "#series-related-scroll"

    ];

    selectors.forEach(
        selector => {

            const container =
                document.querySelector(
                    selector
                );

            if(container){

                enableHorizontalDrag(
                    container
                );

            }

        }
    );

}

/*==================================================
HORIZONTAL CONTROLS
==================================================*/

function bindAllHorizontalControls(){

    const sections = [

        {
            container:
                "#series-music-scroll",

            section:
                ".series-music-section"

        },

        {
            container:
                "#series-cast-scroll",

            section:
                ".series-cast-section"

        },

        {
            container:
                "#series-related-scroll",

            section:
                ".series-related-section"

        }

    ];

    sections.forEach(
        item => {

            const container =
                document.querySelector(
                    item.container
                );

            const section =
                document.querySelector(
                    item.section
                );

            if(
                !container ||
                !section
            ){

                return;

            }

            const buttons =
                section.querySelectorAll(
                    ".series-scroll-prev, .series-scroll-next"
                );

            if(
                buttons.length < 2
            ){

                return;

            }

            buttons[0].onclick =
                function(){

                    container.scrollBy({

                        left:
                            -(
                                container.clientWidth
                                *
                                .85
                            ),

                        behavior:
                            "smooth"

                    });

                };

            buttons[1].onclick =
                function(){

                    container.scrollBy({

                        left:
                            container.clientWidth
                            *
                            .85,

                        behavior:
                            "smooth"

                    });

                };

        }
    );

}

  /*==================================================
SERIES VIEW PAGE v2.0
PART 6 - RELATED NEWS & GOSSIPS
==================================================*/

/*==================================================
NEWS DATA
==================================================*/

let seriesNews = [];

/*==================================================
LOAD RELATED NEWS
==================================================*/

async function loadSeriesNews(){

    const container =
        document.querySelector(
            "#series-news-grid"
        );

    if(
        !container
    ){

        return;

    }

    const currentID =
    normalizeID(
        seriesData.id
    );

 if(
    !currentID
){

    container.innerHTML =

    `
    <div class="series-empty">

        No News Found

    </div>
    `;

    return;

 }

    try{

        const response =
            await fetch(

                "/feeds/posts/default?alt=json&max-results=100"

            );

        if(
            !response.ok
        ){

            throw new Error(
                "News Feed Error"
            );

        }

        const json =
            await response.json();

        const posts =

            json.feed &&
            json.feed.entry

            ?

            json.feed.entry

            :

            [];

        seriesNews = posts.filter(function(post){

    if(
        !post.category ||
        !post.category.some(function(item){

            return String(item.term || "")
                .trim()
                .toLowerCase() === "news";

        })
    ){

        return false;

    }

    return normalizeID(

        getHiddenMeta(
            post,
            "series-id"
        )

    ) === currentID;

});

    renderSeriesNews();

} 

    catch(error){

        console.error(
            error
        );

        container.innerHTML =

        `

        <div class="series-empty">

            No News Found

        </div>

        `;

    }
}
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

 /*==================================================
CREATE SERIES NEWS CARD
==================================================*/

function createSeriesNewsCard(post){

    const title =
        stripHTML(
            post.title.$t
        );

    const link =
        getPostLink(
            post
        );

    const thumb =
        getThumbnail(
            post
        );

    const badge =
        getHiddenMeta(
            post,
            "news-badge"
        );

    const date =
        new Date(
            post.published.$t
        ).toLocaleDateString(
            "en-IN",
            {
                day:"numeric",
                month:"short",
                year:"numeric"
            }
        );

    const category =
        getPostCategory(
            post
        );

    const desc =
        getHiddenMeta(
            post,
            "news-description"
        ) ||
        (
            post.summary
            ?
            stripHTML(
                post.summary.$t
            ).substring(
                0,
                90
            )
            :
            ""
        );

    return `

<a href="${link}" class="news-card">

<div class="news-card-thumb">

<img
src="${thumb}"
alt="${escapeHTML(title)}"
loading="lazy">

${
badge
?

`
<div class="news-card-badge ${getBadgeClass(badge)}">

${escapeHTML(badge)}

</div>
`

:

""

}

</div>

<div class="news-card-content">

<h3 class="news-card-title">

${escapeHTML(title)}

</h3>

<p class="news-card-desc">

${escapeHTML(desc)}

</p>

<div class="news-card-meta">

<span>

${date}

</span>

<span>•</span>

<span>

${escapeHTML(category)}

</span>

</div>

</div>

</a>

`;

}
/*==================================================
RENDER RELATED NEWS
==================================================*/

function renderSeriesNews(){

    const container =
        document.querySelector(
            "#series-news-grid"
        );

    if(
        !container
    ){

        return;

    }

    if(
        !seriesNews.length
    ){

        container.innerHTML =

        `

        <div class="series-empty">

            No News Found

        </div>

        `;

        return;

    }

    container.innerHTML =

        seriesNews

        .slice(
            0,
            4
        )

        .map(
            createSeriesNewsCard
        )

        .join("");

}

/*==================================================
VIEW ALL LINK
==================================================*/

function updateSeriesNewsLink(){

    const button =
        document.querySelector(
            "#series-news-view-all"
        );

    if(
        !button
    ){

        return;

    }

    const currentID =
    normalizeID(
        seriesData.id
    );

    if(
        !currentID
    ){

        button.style.display =
            "none";

        return;

    }

    button.href =

        "/p/news.html?type=series&value=" +

        encodeURIComponent(
            currentID
        );

}

/*==================================================
INITIALIZE RELATED NEWS
==================================================*/

function initSeriesPart6(){

    updateSeriesNewsLink();

    loadSeriesNews();

}

/*==================================================
FINAL UI
==================================================*/

function updateSeriesUI(){

    bindImageFallback();

    bindAllHorizontalControls();

    enableSeriesHorizontalDrag();

}

/*==================================================
MAIN INITIALIZATION
==================================================*/

async function initSeriesViewPage(){

    /*
    1. Read metadata first
    */

    readSeriesMetadata();

    /*
    2. Static sections
    */

    renderSeriesHero();

    renderSeriesInfo();

    renderSeriesDescription();

    renderAboutCredits();

    renderSeasonLinks();

    bindSeriesShare();

    /*
    3. Dynamic sections
    */

    await Promise.allSettled([

        loadSeriesEpisodes(),

        loadSeriesVideos(),

        loadRelatedSeries(),
      
        loadSeriesNews(),
      loadCastCrewPosts()
      
     
  
    ]);
renderCastCrew();
    /*
    4. Related News
    */

    updateSeriesNewsLink();
  
    /*
    5. Final UI
    */

    updateSeriesUI();

    /*
    Dynamic image/content check
    */

    setTimeout(
        updateSeriesUI,
        500
    );

}

/*==================================================
START
==================================================*/

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        initSeriesViewPage,
        {
            once:true
        }
    );

}
else{

    initSeriesViewPage();

}

})();