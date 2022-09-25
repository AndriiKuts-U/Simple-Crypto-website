//an array, defining the routes
export default[

    {
        hash:"welcome",
        target:"articles",
        getTemplate:(targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-welcome").innerHTML

    },
    {
        hash:"crypto",
        target:"articles",
        getTemplate:(targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("cryptocurrencies").innerHTML
    },
    {
        hash:"FAQ",
        target:"articles",
        getTemplate:(targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("FAQ").innerHTML
    },
    {
        hash:"BTC",
        target:"articles",
        getTemplate:(targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("BTCprice").innerHTML
    },
    {
        hash:"main",
        target:"m",

        getTemplate:createHtml4Main
    },
    {
        hash:"artEdit",
        target:"articles",
        getTemplate: editArticle
    },
    {
        hash:"artDelete",
        target:"articles",
        getTemplate: remove
    },
    {
        hash:"article",
        target:"articles",
        getTemplate: fetchAndDisplayArticleDetail
    },
    {
        hash:"opinions",
        target:"articles",
        getTemplate: createHtml4opinions
    },
    {
        hash:"addOpinion",
        target:"articles",
        getTemplate: (targetElm) =>{
            document.getElementById(targetElm).innerHTML = document.getElementById("template-addOpinion").innerHTML;
            document.getElementById("opnFrm").onsubmit=processOpnFrmData;
        }
    }

];

function createHtml4opinions(targetElm){

    const opinionsFromStorage=localStorage.Opinions_Storage;
    let opinions=[];

    if(opinionsFromStorage){
        opinions=JSON.parse(opinionsFromStorage);
        opinions.forEach(opinion => {
            opinion.created = (new Date(opinion.created)).toDateString();

        });
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-opinions").innerHTML,
        opinions
    );
}

const articlesPerPage = 20;

function fetchAndDisplayArticles(targetElm, offsetFromHash,totalCountFromHash){




    const offset=Number(offsetFromHash);
    const totalCount=Number(totalCountFromHash);

    let urlQuery = "";

    if (offset && totalCount){
        urlQuery=`?offset=${offset}&max=${articlesPerPage}`;
    }else{
        urlQuery=`?max=${articlesPerPage}`;
    }
    const url = `${urlBase}/article${urlQuery}`;
    fetch(url)
        .then(response =>{
            if(response.ok){
                return response.json();
            }else{ //if we get server error
                return Promise.reject(
                    new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            addArtDetailLink2ResponseJson(responseJSON);
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles").innerHTML,
                    responseJSON
                );
        })
        .catch (error => { ////here we process all the failed promises
            const errMsgObj = {errMessage:error};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        });
}


//const articlesElm = document.getElementById("articles");
const errorElm = document.getElementById("template-articles-error");


function errorHandler(error) {
    console.log("hello");
    errorElm.innerHTML=`Error reading data from the server. ${error}`; //write an error message to the page
}

function createHtml4Main(targetElm,  offsetFromHash, totalCountFromHash){
    const offset=Number(offsetFromHash);
    const total=Number(totalCountFromHash) ;

    const data4rendering={
        currPage:offset,
        pageCount:total
    };

    if(offset>1){
        data4rendering.prevPage=offset-1;
    }

    if(offset<total){
        data4rendering.nextPage=offset+1;
    }
    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("main").innerHTML,
        data4rendering
    );

    fetchAndDisplayArticles( "articles", offset * 20,totalCountFromHash );

}

const urlBase = "https://wt.kpi.fei.tuke.sk/api";

function remove(targetElm,artIdFromHash ) {
    const id=Number(artIdFromHash);
    const url = `${urlBase}/article/${id}`;
    fetch(`${url}`, {
        method: 'DELETE'
    }).then(() => {
        window.alert("Successfully removed");
    }).catch(err => {
        window.alert(`Failed to remove. Error : ${err}`);
    });
}


function addArtDetailLink2ResponseJson(responseJSON){

    responseJSON.articles = responseJSON.articles.map(
        article =>(
            {
                ...article,
                detailLink:`#article/${article.id}/${responseJSON.meta.offset}/${responseJSON.meta.totalCount}`
            }
        )
    );
}

function editArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    fetchAndProcessArticle(...arguments,true);
}
function fetchAndDisplayArticleDetail(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash) {
    fetchAndProcessArticle(...arguments,false);
}


function fetchAndProcessArticle(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash,forEdit){
    const url = `${urlBase}/article/${artIdFromHash}`;

    fetch(url)
        .then(response =>{
            if(response.ok){
                return response.json();
            }else{ //if we get server error
                return Promise.reject(
                    new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            if(forEdit){
                responseJSON.formTitle="Article Edit";
                responseJSON.formSubmitCall =
                    `processArtEditFrmData(event,${artIdFromHash},${offsetFromHash},
                           ${totalCountFromHash},'${urlBase}')`;
                responseJSON.submitBtTitle="Save article";
                responseJSON.urlBase=urlBase;
                responseJSON.backLink=`#main/${offsetFromHash / 20}/20`;
                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article-form").innerHTML,
                        responseJSON
                    );
            }else{
                responseJSON.backLink=`#main/${offsetFromHash / 20}/20`;
                responseJSON.editLink=
                    `#artEdit/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.deleteLink=
                    `#artDelete/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;

                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article").innerHTML,
                        responseJSON
                    );
            }
        })
        .catch (error => { ////here we process all the failed promises
            const errMsgObj = {errMessage:error};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        });
}



