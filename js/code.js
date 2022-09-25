
function opinion2html(opinion){
    opinion.createdDate=(new Date(opinion.created)).toDateString();
    const template = document.getElementById("mTmplOneOpinion").innerHTML;
    const htmlWOp = Mustache.render(template,opinion);

    delete(opinion.createdDate);
    return htmlWOp;
}

function image2html(image){
    const template = document.getElementById("mTmplOneImage").innerHTML;
    const htmlWOp = Mustache.render(template,image);
    return htmlWOp;
}




function opinionArray2html(sourceData){

    let htmlWithOpinions="";

    for(const opn of sourceData){
        htmlWithOpinions += opinion2html(opn);
    }

    return htmlWithOpinions;
}



function download_image(event){
    const imageElm=document.getElementById("imageContainer");
    const URLimage = document.getElementById("URL").value.trim();
    if(URLimage==""){
        window.alert("Please, enter URL");
        return;
    }
    const image =
        {
            URl : URLimage,
        };

    imageElm.innerHTML =image2html(image);
}


function processOpnFrmData(event){
    let opinions=[];
    if(localStorage.Opinions_Storage){
        opinions=JSON.parse(localStorage.Opinions_Storage);
    }
    event.preventDefault();

    const nopName = document.getElementById("nameElm").value.trim();
    const nopOpn = document.getElementById("opnElm").value.trim();
    const email = document.getElementById("email").value.trim();
    const URLimage = document.getElementById("URL").value.trim();
    const keyWord = document.getElementById("KeyWords").value.trim();
    const design = document.getElementById("topic1").checked;
    const Crypto = document.getElementById("topic2").checked;
    const support = document.getElementById("topic3").checked;

    let M = "None";
    if(document.getElementById("male").checked)M = "Male";
    if(document.getElementById("female").checked)M = "Female";
    if(document.getElementById("other").checked)M = "Other";


    if(nopName=="" || nopOpn=="" ){
        window.alert("Please, enter both your name and opinion");
        return;
    }

    const newOpinion =
        {
            name: nopName,
            sex : M,
            email : email,
            URl : URLimage,
            design: design,
            crypto : Crypto,
            support : support,
            preferredCrypto : keyWord,
            comment: nopOpn,
            created: new Date()
        };

    console.log("New opinion:\n "+JSON.stringify(newOpinion));

    opinions.push(newOpinion);

    localStorage.Opinions_Storage = JSON.stringify(opinions);

    window.location.hash="#opinions";

    // commFrmElm.reset();
}
