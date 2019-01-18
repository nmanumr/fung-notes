renderMathInElement(document.body);


function getDocUrl() {
    var paths = window.location.pathname.split('/')
    if (paths[1] == 'fung-notes')
        paths = [paths[2], paths[3]];
    else // running locally
        paths = [paths[1], paths[2]];

    if(paths[0] && paths[1])
        return `docs/${paths.join('/')}.md`
    else if(paths[0])
        return `docs/${paths.join('/')}index.md`
    else
        return `docs/index.md`
}

function getLastChangeDate(){
    var doc = getDocUrl();
    fetch(`https://api.github.com/repos/nmanumr/fung-notes/commits?path=${doc}&page=1&per_page=1`)
        .then(response => response.json())
        .then(data=>{
            var diff = Date.now() - new Date(data[0].commit.author.date);
            diff = moment.duration(diff).humanize();
            var name = data[0].commit.author.name;

            var lastChangesNode = document.createElement('p');
            lastChangesNode.classList.add('last-changes');
            lastChangesNode.innerHTML = `Last update: <a href="${data[0].html_url}">${diff} ago</a> by <a href="${data[0].author && data[0].author.html_url}">${name}</a>`
            document.getElementsByTagName('article')[0].prepend(lastChangesNode);
        })
}

document.addEventListener('DOMContentLoaded', getLastChangeDate, false);
