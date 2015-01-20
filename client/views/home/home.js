Template['home'].helpers({
    'courses': function() {
        return courses.find();
    },
    'currentCount': function(){
        return this.members.length;
    },
    'selectedPlan': function(){
        var res = Session.get('selectedPlan');
        if(res){
            return res;
        } else {
            return "Waiting";
        }
    },
    'firstPlans': function() {
        return Session.get('firstPlans');
    },
    'secondPlans': function() {
        queryStartTime = Session.get('queryStartTime');
        plans = Session.get('secondPlans');
        if(queryStartTime){
            //console.log(queryStartTime);
            res = [];
            for(var i in plans){
                secStart = plans[i].start.split(":")[0] * 60 + Number(plans[i].start.split(":")[1]);
                if(secStart >= queryStartTime){
                    res.push(plans[i]);
                }
            }
            return res;

        } else {
            return plans;
        }
    }
});

Template['home'].events({
    'submit form': function(event) {
        event.preventDefault();
        queryDate = event.target.queryDate.value;
        departCity = event.target.departCity.value;
        firstWay = event.target.firstWay.value;
        transferCity = event.target.transferCity.value;
        delayMinutes = event.target.delayMinutes.value;
        arriveCity = event.target.arriveCity.value;
        secondWay = event.target.secondWay.value;

        Session.set('delayMinutes', delayMinutes);
        Session.set('firstPlans', null);
        Session.set('secondPlans', null);

        Meteor.call('getPlan', firstWay, secondWay, queryDate, departCity, transferCity, arriveCity, function(error, result){
            //console.log(result);

            items = JSON.parse(result[0].content).result;
            var firstPlans = [];
            for(var i in items){
                if(firstWay == 'getTrainPlan'){
                    plan = items[i].station_train_code + ' ' + items[i].start_time + ' ' + items[i].start_station_name +
                            ' -> ' +
                            items[i].arrive_time + ' ' + items[i].to_station_name;
                    firstPlans.push({'content':plan, 'start': items[i].start_time, 'end': items[i].arrive_time});
                } else {
                    plan = items[i].name + ' ' + items[i].DepTime + ' ' + items[i].startAirport +
                            ' -> ' +
                            items[i].ArrTime + ' ' + items[i].endAirport;
                    firstPlans.push({'content':plan, 'start': items[i].DepTime, 'end': items[i].ArrTime});
                }
            }
            //console.log(firstPlans);
            Session.set('firstPlans', firstPlans);

            items = JSON.parse(result[1].content).result;
            //console.log(items);
            var secondPlans = [];
            for(var j in items){
                console.log(items[j]);
                if(secondWay == 'getTrainPlan'){
                    plan = items[j].station_train_code + ' ' + items[j].start_time + ' ' + items[j].start_station_name +
                            ' -> ' +
                            items[j].arrive_time + ' ' + items[j].to_station_name;
                    secondPlans.push({'content':plan, 'start': items[j].start_time, 'end': items[j].arrive_time});
                } else {
                    plan = items[j].name + ' ' + items[j].DepTime + ' ' + items[j].startAirport +
                            ' -> ' +
                            items[j].ArrTime + ' ' + items[j].endAirport;
                    secondPlans.push({'content':plan, 'start': items[j].DepTime, 'end': items[j].ArrTime});
                }
            }
            //console.log(secondPlans);
            Session.set('secondPlans', secondPlans);

        });

        // Meteor.call(firstWay, queryDate, departCity, transferCity, function (error, result){
        //     console.log("FRT:",firstWay);

        //     //console.log(firstWay);
        //     var items = JSON.parse(result.content).result;
        //     var plans = [];
        //     // examine result
        //     for(var i in items){
        //         if(firstWay == 'getTrainPlan'){
        //             plan = items[i].station_train_code + ' ' + items[i].start_time + ' ' + items[i].start_station_name +
        //                     ' -> ' +
        //                     items[i].arrive_time + ' ' + items[i].to_station_name;
        //             plans.push({'content':plan, 'start': items[i].start_time, 'end': items[i].arrive_time});
        //         } else {
        //             plan = items[i].name + ' ' + items[i].DepTime + ' ' + items[i].startAirport +
        //                     ' -> ' +
        //                     items[i].ArrTime + ' ' + items[i].endAirport;
        //             plans.push({'content':plan, 'start': items[i].DepTime, 'end': items[i].ArrTime});
        //         }
        //     }
        //     console.log(plans);
        //     Session.set('firstPlans', plans);
        // });

        // Meteor.call(secondWay, queryDate, transferCity, arriveCity, function (error, result){
        //     console.log("SEC:",secondWay);

        //     //console.log(resu);
        //     var items = JSON.parse(result.content).result;
        //     var plans = [];
        //     // examine result
        //     for(var i in items){
        //         if(secondWay == 'getTrainPlan'){
        //             plan = items[i].station_train_code + ' ' + items[i].start_time + ' ' + items[i].start_station_name +
        //                     ' -> ' +
        //                     items[i].arrive_time + ' ' + items[i].to_station_name;
        //             plans.push({'content':plan, 'start': items[i].start_time, 'end': items[i].arrive_time});
        //         } else {
        //             plan = items[i].name + ' ' + items[i].DepTime + ' ' + items[i].startAirport +
        //                     ' -> ' +
        //                     items[i].ArrTime + ' ' + items[i].endAirport;
        //             plans.push({'content':plan, 'start': items[i].DepTime, 'end': items[i].ArrTime});
        //         }
        //     }
        //     //console.log(plans);
        //     Session.set('secondPlans', plans);

        // });
    },
    'click .first-way': function() {
        Session.set("queryStartTime", this.end.split(":")[0] * 60 + Number(this.end.split(":")[1]) + Number(Session.get('delayMinutes')));
        Session.set("selectedPlan", this.content);
    },
    'dblclick .first-way': function() {
        if(this.content == Session.get('selectedPlan')){
            Session.set("queryStartTime", 0);
            Session.set("selectedPlan", null);
        }
    }
});

Template['home'].rendered = function () {
    $('.progress').progress();
    $('.dropdown')
      .dropdown();


};
