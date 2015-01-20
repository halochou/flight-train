getTrainPlan = function (queryDate, dep, arr){
    // this.unblock();
    // check(queryDate, String);
    // check(dep, String);
    // check(arr, String);

    // http://apis.haoservice.com/lifeservice/train/ypcx?date=2014-08-27&from=上海&to=温州&key=您申请的APPKEY
    var result = HTTP.get("http://apis.haoservice.com/lifeservice/train/ypcx",
                       {params: {
                        date: queryDate,
                        from: dep,
                        to: arr,
                        key: '0ee0e43ac3cd4a0d9507f1e1a99c4e6f'
                   }});
    //console.log(result.content);
    return result;
};
getFlightPlan = function (queryDate, dep, arr){
    //check(courseId, String);
    // this.unblock();
    // check(queryDate, String);
    // check(dep, String);
    // check(arr, String);
    // http://apis.haoservice.com/plan/s2s?start=北京&end=郑州&key=您申请的APPKEY
    var result = HTTP.get("http://apis.haoservice.com/plan/s2s",
                       {params: {
                        start: dep,
                        end: arr,
                        key: '91181fbcdc3f4f81b1ca5100a4a87e35'
                   }});
    //console.log(result);
    return result;
};

Meteor.methods({
    'getPlan': function(firstWay, secondWay, queryDate, dep, trans, arr){
        this.unblock();
        //console.log(firstWay, secondWay, queryDate, dep, trans, arr);
        check(firstWay, String);
        check(secondWay, String);
        check(queryDate, String);
        check(dep, String);
        check(trans, String);
        check(arr, String);
        // http://apis.haoservice.com/plan/s2s?start=北京&end=郑州&key=您申请的APPKEY
        if(firstWay == 'getTrainPlan'){
            firstRes = getTrainPlan(queryDate, dep, trans);
        } else {
            firstRes = getFlightPlan(queryDate, trans, arr);
        }
        if(secondWay == 'getTrainPlan'){
            secondRes = getTrainPlan(queryDate, dep, trans);
        } else {
            secondRes = getFlightPlan(queryDate, trans, arr);
        }
        return [firstRes,secondRes];
    }
});
