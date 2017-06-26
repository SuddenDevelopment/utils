var utils = function(){
  'use strict';
  var self=this;
  //----====|| UTILITY FUNCTIONS ||====----\\
  //get a value from a defined path in an object
   // https://jsperf.com/lodash-get-vs-monster-method/2
   self.has = Object.prototype.hasOwnProperty;
   self.test = function(varSomething){ console.log('utils lib is working: ',varSomething); };
   //find the index of a given value in an array of objects 
//----====|| ARRAYS ||====----\\

        //trick forEach, destructive to the array but fast
    self.forEach = function(arr,fn){
      var v,i=0;
      while(v=arr.pop()){
        fn(v,i); 
        i++;
      }
    };
    self.arrSort = function(a,b){
      if (a.intSort < b.intSort)
        return -1;
      if (a.intSort > b.intSort)
        return 1;
      return 0;
    };
     self.for = function(arr,fn){ for(var i=arr.length-1;i>=0;i--){ fn(arr[i],i); } };
        self.unique = function(arr) {
      //found here: https://jsperf.com/array-unique-values/18
      var set = [arr[0]],
          bst = { v: arr[0], l: null, r: null };
      for (var i = 1, len = arr.length; i < len; i++) {
        var value = arr[i], root = bst, uv = true;
        while (true) {
          if (value > root.v) {
            if (!root.r) {
              root.r = { v: value, l: null, r: null };
              break;
            }
            root = root.r;
          } else if (value < root.v) {
            if (!root.l) {
              root.l = { v: value, l: null, r: null };
              break;
            }
            root = root.l;
          } else {
            uv = false;
            break;
          }
        }
        if (uv) { set.push(value); }
      }
      return set;
    };

    //move the position of an element in the array
    self.arrMove = function(arr,intOld,intNew){
      //get the element
      var v=arr[intOld];
      //remove it from the array
      arr.splice(intOld,1);
      //insert it where it belongs
      arr=arr.splice(intNew,0,v);
      return arr;
    }

//----====|| COLLECTIONS ||====----\\
    self.getIndex = function(arr, key, value) {
        for (var i=arr.length-1;i>=0;i--) {
            if (arr[i][key] === value) {
                arr=[]; 
                return i;
            }
        }
        return -1;
    };
//----====|| DEEP OBJECTS ||====----\\
   self.get = function(objModel, strPath) {
        var arrProps = strPath.split('.'),
            prop = objModel,
            len = arrProps.length,i;
        for(var i = 0; i < len; i++) {
            if(typeof prop[arrProps[i]] !== 'undefined' && prop[arrProps[i]] !== null) { prop = prop[arrProps[i]]; }
            else if(arrProps[i]==='[]' && typeof prop !== 'undefined'){
              var arrReturn=[];
              //this is for an array where the next property
              //console.log('get',arrProps[i-1],prop);
              for(var ii=0; ii<prop.length; ii++){
                if(typeof prop[ii][arrProps[i+1]] !== 'undefined'){ arrReturn.push(prop[ii][arrProps[i+1]]); }
              }
              return arrReturn;
            } 
            else { return null;}
        }
        return prop;
    };
    // credit: http://jsfiddle.net/jfriend00/Sxz2z/
    self.set = function(obj, path, value) {
      var tags = path.split("."), len = tags.length - 1;
      for (var i = 0; i < len; i++) {
        //set parent paths if they dont exist
        if(typeof obj[tags[i]] === 'undefined'){ obj[tags[i]]={}; }
        obj = obj[tags[i]]; 
      }
      obj[tags[len]] = value;
    };
    self.del = function(obj,path){
      var tags = path.split("."), len = tags.length - 1;
      for (var i = 0; i < len; i++) { obj = obj[tags[i]]; }
      delete obj[tags[len]];
    };
    self.stripFields = function(objData,arrFields){
      //array of fields loop
      self.for(arrFields,function(v,k){
        self.remove(objData,v);
      });
    };
    self.keepFields = function(objData,arrFields){
      //TODO probably needs to be converted to supporting deep paths like parent.child like stripFields, better version inside json.decor
      //object properties loop
      self.forOwn(objData,function(v,k){
        var fKeep = false;
        //array of fields to keep loop
        self.for(arrFields,function(vv,kk){
          if(k===vv){ fKeep=true; }
        });
        if(fKeep===false){
          delete objData[v];
        }
      });  
    };
    //for each property in an object
    self.forOwn = function(obj,fn){ self.forEach(Object.keys(obj),function(v,k){ fn(obj[v],v); }); };



     self.defaults = function(objTarget,objDefaults){
      self.forOwn(objDefaults,function(v,k){ 
        if(!objTarget[k]){ objTarget[k]= v;}
        else if(typeof objTarget[k]==='object' && typeof objDefaults ==='object'){ self.defaults(objTarget[k],objDefaults[k]); }
      });
      //console.log(objTarget,objDefaults);
      return objTarget;
    };
     //return an array of all keys full dpeth recursion
     self.deepKeys = function(objData){
        var arrKeys = [];
        self.forOwn(objData,function(v,k){
            //this requires recursion
            if(typeof v ==='object' && v!== null){ 
                //array recursion
                if(v.constructor===Array){
                  for(var i=0;i<v.length;i++){
                    self.forEach(self.deepKeys(v[i]),function(vv,kk){ 
                    arrKeys.push(k+'.'+vv); 
                  }); 
                  }
                }
                //object recursion
                else{ 
                  self.forEach(self.deepKeys(v),function(vv,kk){ 
                    arrKeys.push(k+'.'+vv); 
                  }); 
                }
            }
            //this is a leaf node property
            else{ arrKeys.push(k); }
        });
        return arrKeys;
     };
     self.filterOld = function(arrData,strPath,intValue){
      var arrFresh=[];
        self.forEach(arrData,function(v,k){
          if(self.get(v,strPath) > intValue){ arrFresh.push(v); }
        });
        return arrFresh;
      };

    //----====|| STRINGS ||====----\\
    self.strCount = function(strNeedle,strHaystack,objOptions){
        if(objOptions && typeof objOptions.preserveCase!== 'undefined' && objOptions.preserveCase === false){ 
            strNeedle = strNeedle.toLowerCase(); strHaystack = strHaystack.toLowerCase; 
        }
        var arrMatch = strHaystack.split(strNeedle);
        return arrMatch.length-1;
    };
    self.strCounts = function(arrNeedles,strHaystack,objOptions){
        var objResults = {};
        self.for(arrNeedles,function(v,k){
            objResults[v] = self.strCount(v,strHaystack,objOptions);
        });
        return objResults;
    };
    
    //----====|| END UTILITY FUNCTIONS ||====----\\
};
if (typeof module !== 'undefined' && module.exports){module.exports = utils;}
else{
  //this loads it in global
  var _ = new utils();
  //this is to load it in angular
  if(typeof angular !== 'undefined'){
    var suddenutils = angular.module('suddenutils',[]);
    suddenutils.factory('_', ['$window', function($window) {
    return $window._;
    }]);
  }

}