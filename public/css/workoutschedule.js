class Day{
    constructor(index,cardio,strength,time){
        this.cardio = cardio;
        this.strength = strength;
        this.time = time;
        this.workoutsCardio = [];
        this.workoutsUpper = [];
        this.workoutsCore = [];
        this.workoutsLower = [];
        this.index = index;
    }
    
    get joint(){
        if (this.cardio&&this.strength){
            return true;
        }else{
            return false;
        }
    }

    get workoutsStrength(){
        var x = this.workoutsCardio.concat(this.workoutsUpper);
        return x.concat(workoutsLower);
    }

    get workouts(){
        return this.workoutsStrength().concat(this.workoutsCardio);
    }
}

let days = [false, false, false, false, false, false, false]; //representative of Mon Tues Weds Thurs Fri Sat Sun
let dayCardio = [false, false, false, false, false, false, false];
let dayStrength = [false, false, false, false, false, false, false];
let dayWorkouts =[null,null,null,null,null,null,null];

for(let i = 0; i<dayWorkouts.length; i++){
    dayWorkouts[i]=new Day(i, false, false, 0)
}

let cardio = false;
let strength = false;
let armLegSplit = false;
let startDay = -1;
let numRest = 0;
let numWork = 0;

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('poop logged in: ', user);

        if (currentUser == null){
            getUser(user.uid).then(doc=>{
                currentUser = doc;
                currentUserData = doc.data();
                check();
            })
            .catch(error=>console.error(error));}
        else{
            check();
        }

        
        
    } else {
        console.log('user logged out')
    }
})


function check(){
    const scheduleForm = document.querySelector('.schedule-button');
        const scheduleModal = document.querySelector('#modal-schedule')
    scheduleForm.addEventListener('click', (e) => {
    // prevent refresh (losing info)
    e.preventDefault();

    // get user info
    days = [false, false, false, false, false, false, false]; //representative of Mon Tues Weds Thurs Fri Sat Sun
    dayCardio = [false, false, false, false, false, false, false];
    dayStrength = [false, false, false, false, false, false, false];

    cardio = false;
    strength = false;
    numRest = 0;
    numWork = 0;
    armLegSplit = false;
    startDay = -1;

    const ele3 = document.getElementsByName('days');
    for(i = 0 ; i < ele3.length ; i++) {
        if(ele3[i].checked) days[i] = true;
    }

    const ele4 = document.getElementsByName('work');
    if(ele4[0].checked){
        strength = true;
    } 
    else if(ele4[1].checked){
        cardio = true;
    }
    else{
        strength = true;
        cardio= true;
    }

    console.group(scheduleModal);
    M.Modal.getInstance(scheduleModal).close();
    
    initialize();
    document.querySelector("#made").classList.remove("hide");
})
}


function initialize(){
    console.log("start");
    console.log(days);
    console.log(dayStrength);
    console.log(dayCardio);
    console.log(dayWorkouts);
    console.log(startDay);

for(let i = 0; i < days.length; i++){
    if(days[i]){
        numWork++;
        if(startDay==-1){
            startDay = i;
        }  
    }
}

numRest = 7-numWork;

if((cardio && !strength) || (!cardio && strength)){

    if (numWork >=4){
        findBeginner();
    }


    for(let i = 0; i<days.length; i++){
        if (days[i]) {
            if (cardio) {dayCardio[i] = true}
            else {dayStrength[i] = true}
        }
    }
    
    
}
else { 
    if(numWork >= 4){
        if(numWork == 7){
            setRestDay(6);
        }
        let alt = true;
        for(let i = startDay; i<days.length; i++){
            if (days[i]){
                if (alt){
                    dayStrength[i] = true;
                }
                else{
                    dayCardio[i] = true;
                }
                alt= !alt;
            }
        }
        console.log("mid");
        console.log(days);
    console.log(dayCardio);
    console.log(dayStrength);
    console.log(startDay);
    //console.log(numWork);
    //console.log(cardio);
    //console.log(strength);
    }
    else{
        for(let i = 0; i<days.length; i++){
            if(days[i]){
                dayCardio[i] = true;
                dayStrength[i] = true;
            }
            
        }
    }
}


let table = document.getElementById("schedule"); //gets schedules week graphic
let tableDays = table.rows[1];


if (numWork != 1 && strength){
    let val = true;
    let index = 0;
    let startVal = -1;
    let times = 2;

    if(numWork == 2){
        times = 1;
    }

    while (val){
        let b = index-1;

        b = arrayWrapCheck(b, dayStrength);
        //alert(dayStrength);
        if(!dayStrength[b] && dayStrength[index]){
            
            startVal = index;
            let c = arrayWrapCheck(startVal+1, dayStrength);
            if(dayStrength[c]){
                armLegSplit = true;
                val = false;
            }
            else{
                times --;
            }
        }
        if (times == 0){
            val = false;
        }
        index++;
        index = arrayWrapCheck(index, days);
    }
}
let swap = true;
for(let i = 0; i<days.length;i++){
    let childList = tableDays.cells[i].childNodes[1];
    childList.innerText = '';
    if(days[i]){
        dayWorkouts[i].cardio = dayCardio[i];
        dayWorkouts[i].strength = dayStrength[i];
        console.log(dayWorkouts[i]);
        

        if(dayStrength[i]){
        
            if (armLegSplit){
                if (swap){
                    dayWorkouts[i].workoutsUpper = insertWorkouts("upper-body");
                    var x = document.createElement("li");
                    x.innerText = "Strength: Upper and Core";
                    x.classList.add("type");
                    var y = document.createElement("li");
                    
                    childList.appendChild(x);
                    

                    if(dayWorkouts[i].workoutsUpper.length>0){
                        y.innerText = dayWorkouts[i].workoutsUpper[0].name;

                    }
                    else{
                        y.innerText = "No upper workouts found.";
                    }
                    childList.appendChild(y);
                    swap = false;
                }
                else{
                    dayWorkouts[i].workoutsLower = insertWorkouts("lower-body");
                    var x = document.createElement("li");
                    x.innerText = "Strength: Lower and Core";
                    x.classList.add("type");
                    var y = document.createElement("li");
                    childList.appendChild(x);

                    if(dayWorkouts[i].workoutsLower.length>0){
                        y.innerText = dayWorkouts[i].workoutsLower[0].name;

                    }
                    else{
                        y.innerText = "No lower workouts found.";
                    }
                    childList.appendChild(y);

                    swap = true;
                }
            }
            else{
                dayWorkouts[i].workoutsUpper = insertWorkouts("upper-body");
                dayWorkouts[i].workoutsLower = insertWorkouts("lower-body");
                var x = document.createElement("li");
                x.innerText = "Strength: Fullbody";
                x.classList.add("type");

                var y = document.createElement("li");
                var z = document.createElement("li");

                if(dayWorkouts[i].workoutsUpper.length>0){
                    y.innerText = dayWorkouts[i].workoutsUpper[0].name;

                }
                else{
                    y.innerText = "No upper workouts found.";
                } 
                if(dayWorkouts[i].workoutsLower.length>0){
                    z.innerText = dayWorkouts[i].workoutsLower[0].name;

                }
                else{
                    z.innerText = "No lower workouts found.";
                }

                childList.appendChild(x);
                childList.appendChild(y);
                childList.appendChild(z);
            }
            
            dayWorkouts[i].workoutsCore = insertWorkouts("core");
            var z = document.createElement("li");
            
            

            if(dayWorkouts[i].workoutsCore.length>0){
                z.innerText = dayWorkouts[i].workoutsCore[0].name;

            }
            else{
                z.innerText = "No core workouts found.";
            }

            childList.appendChild(z);

        }
        if(dayCardio[i]){
            dayWorkouts[i].workoutsCardio = insertWorkouts("cardio");
            var x = document.createElement("li");
            x.innerText = "Cardio";
            x.classList.add("type");
            var y = document.createElement("li");
            childList.appendChild(x);
            if(dayWorkouts[i].workoutsCardio.length>0){
                
                y.innerText = dayWorkouts[i].workoutsCardio[0].name;
                
                
            }
            else{
                y.innerText = "No cardio workouts found.";
            }
            childList.appendChild(y);
            
        }
        
    }
    else{
        var x = document.createElement("li");
        x.innerText = "Rest";
        x.classList.add("rest");
        childList.appendChild(x);
        
    }

    
}
    if (armLegSplit){
        document.getElementById("split").classList.remove("hide");
    }
    else{
        document.getElementById("split").classList.add("hide");
    }
    console.log("END");
    console.log(days);
    console.log(dayStrength);
    console.log(dayCardio);
    console.log(dayWorkouts);
}

function findBeginner(){
    for (let i = 0; i<5; i++){
        let a = i;
        let b = i+2;
        let c = i+4;

        const check = (a,b,c)=>{
            if(days[a]&&days[b]&&days[c]){
                for (let k = 0; k<days.length; k++){
                    if(k!=a&k!=b&&k!=c){
                        setRestDay(k);
                    }
                }
                return true;
            }else{
                return false;
            }
        }
        
        b = arrayWrapCheck(b, days);

        c = arrayWrapCheck(c, days);

        console.log(`${a}${b}${c}`);
        if (check(a,b,c)){
            return true;
        }
        else if(i>0&&i<3){
            a = i + 4;
            b = a + 2;
            c = a + 4;
            
            b = arrayWrapCheck(b, days);

            c = arrayWrapCheck(c, days);

            console.log(`${a}${b}${c}`);
            if (check(a,b,c)){
                return true;
            }
        }
    }
    console.log("wah");
    let start = -1;
            let i = 0;

            while (true){
                b = i-1;

                b = arrayWrapCheck(b, days);
                console.log(!days[b] && days[i]);

                if(!days[b] && days[i]){
                    start = i;
                    c = start + 2;
                    c = arrayWrapCheck(c, days);

                    if (days[c]){
                        setRestDay(c);
                    }
                    else if (days[arrayWrapCheck(c+1, days)]){
                        setRestDay(arrayWrapCheck(c+1, days));
                    }
                    else if(start == days.length-1){
                        setRestDay(0);
                    }
                    else {
                        setRestDay(arrayWrapCheck(start+5, days));
                    }
                    return true;
                }

                i++;
                i = arrayWrapCheck(i, days);
            }
            
}

function comboHandler(start, combo){
    if (combo == 3){
        if(start == days.length-1){
            setRestDay(0);
        }
        else{
            setRestDay(start+1);
        }
    }
    if (combo == 4){
        
    }
}

function arrayWrapCheck(index, array){
    if(index>=array.length){
        return index-array.length;
    }else if (index<0){
        return index+array.length;
    }else {
        return index;
    }
    
}

function setRestDay(index){
    days[index] = false;
    numWork--;
    numRest++;
}

function insertWorkouts(type){
                
                let workouts = parseWorkouts("txt/workouts.txt");
                
                let sortedWorkouts = [];
                workouts.forEach( workout => {
                    if ( checkWorkout(workout, type) ) {
                        sortedWorkouts.push(workout);
                    }
                })
                
                return sortedWorkouts;
                
}
