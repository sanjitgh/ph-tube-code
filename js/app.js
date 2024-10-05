// button
const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
        .then((res) => res.json())
        .then((data) => displayCategories(data.categories))
        .catch((error) => console.log(error));
};

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn");
    for (const btn of buttons) {
        btn.classList.remove("active")
    }
}

const loadCategoriesVideo = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then((res) => res.json())
        .then((data) => {
            removeActiveClass()
            const activeBtn = document.getElementById(`btn-${id}`);
            activeBtn.classList.add('active')
            displayVideos(data.category);
        })
        .catch((error) => console.log(error));
}


// display button
const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById("categories-conteiner");
    for (const item of categories) {
        // create button
        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick="loadCategoriesVideo(${item.category_id})" class="btn category-btn">
        ${item.category}
        </button>
        `
        categoriesContainer.appendChild(buttonContainer)
    }
};

// video
const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then((res) => res.json())
        .then((data) => displayVideos(data.videos));
};


const videodetails = async (videoId) => {
    const url = await fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`)
    const data = await url.json()
    displayDetails(data.video)
}

const displayDetails = (video) => {
    const detailsContainer = document.getElementById('modal-content');
    document.getElementById('custom_modal').showModal();
    detailsContainer.innerHTML = `
        <img class="mb-3" src="${video.thumbnail}"/>
        <p class="font-bold">${video.title}</p>
        <p>${video.description}</p>
    `
}

const displayVideos = (videos) => {
    function getTimeString(time) {
        const hours = parseInt(time / 3600);
        const remainingSecond = parseInt(time % 3600);
        const minutes = parseInt(remainingSecond / 60);
        return `${hours} hrs ${minutes} min ago`
    }

    const videosContainer = document.getElementById("videos");
    videosContainer.innerHTML = "";
    if (videos.length === 0) {
        videosContainer.classList.remove('grid');
        videosContainer.innerHTML = `
        <div class="flex justify-center items-center min-h-[600px]">
            <div>
            <img class="mx-auto" src="assets/icon.png"/>
            <h1 class="font-bold text-2xl text-center mt-4">Oops!! Sorry, There is no <br> content here</h1>
            </div>
        </div>
        `;
        return
    }
    else {
        videosContainer.classList.add('grid');
    }
    for (const video of videos) {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="card card-compact">
            <figure class="max-h-[200px] relative">
                <img
                class="w-full h-full object-cover"
                src= ${video.thumbnail} />
                ${video.others.posted_date.length === 0 ? "" :
                `<span class="absolute bottom-2 right-2 p-2 rounded bg-slate-900 text-white">
                    ${getTimeString(video.others.posted_date)}
                </span>`
            }
            </figure>
            <div class="py-3 flex gap-2">
                <div>
                    <img class="w-10 h-10 object-cover rounded-full" src=${video.authors[0].profile_picture}/>
                </div>
                <div>
                    <h5 class="font-medium text-xl">${video.title}</h5>
                    <div class="flex gap-2 items-center">
                        <p>${video.authors[0].profile_name}</p>
                        ${video.authors[0].verified === true ? '<img class="w-5 h-5 object-cover" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png"/>' : ''}
                    </div>
                    <p>${video.others.views}</p>
                </div>
            </div>
                <button onclick="videodetails('${video.video_id}')" class="btn btn-sm bg-blue-500 text-white">Click</button>
        </div>
        `;
        videosContainer.appendChild(card)
    }
};
document.getElementById('search-input').addEventListener('keyup', (e) => {
    loadVideos(e.target.value)
})
loadCategories();
loadVideos();