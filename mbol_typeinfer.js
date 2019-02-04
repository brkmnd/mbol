    var typeInfer = function(tree){
        //add generic functions and overloads here
        var environment = {
            "plus":[
                ["int","int","int"],
                ["float","float","float"]
                ],
            "tuple":[],
            "fun":[]
            };
        var typeVarId = 1;
        var compareTypes = function(t0,t1){ 
            //compare iterating over the shortest of the
            //two type-lists
            var len0 = Math.min(t0.length,t1.length);
            for(var i = 0; i < len0; i++){
                if(t0[i][0] !== "@" && t0[i] !== t1[i]){
                    return false;
                    }
                }
            return true;
            };
        var matchTypeOp = function(op,t0){
            if(environment[op] === undefined){
                return null;
                }
            for(var i = 0; i < environment[op].length; i++){
                if(compareTypes(t0,environment[op][i])){
                    var retval = environment[op][i];
                    return retval[retval.length - 1];
                    }
                }
            return null;
            };
        var matchBinding = function(ids,expr,scope){
            if(expr.type === "atom-tuple"){
                if(ids.length !== expr.args.length){
                    return false;
                    }
                for(var i = 0; i < ids.length; i++){
                    //check whether id is not literal.
                    var id = ids[i].v;
                    var exprType = expr.args[i].prgType;
                    scope[id] = exprType;
                    }
                return true;
                }
            if(ids.length === 1){
                scope[ids[0]] = expr.prgType;
                return true;
                }
            return false;
            };
        var unify = function(node){
            if(node.args === undefined){
                return false;
                }
            var typeList = [];
            var containsLitType = false;
            for(var i = 0; i < node.args.length; i++){
                var t0 = node.args[i].prgType[0];
                if(t0[0] !== "@"){
                    containsLitType = true;
                    }
                typeList.push(t0);
                }
            if(!containsLitType){
                node.prgType[0] += typeVarId.toString();
                typeVarId++;
                return true;
                }
            var mType = matchTypeOp(node.v,typeList);
            if(mType !== null){
                node.prgType[0] = mType;
                return true;
                }
            return false;
            };
        var scopes = {};
        var scopeCheckCurrent = function(d,v){
            return scopes[d] !== undefined && scopes[d][v] !== undefined;
            };
        var scopeCheckDown = function(d,v){ 
            for(var i = d; i >= 0; i--){
                if(scopes[i] !== undefined && scopes[i][v] !== undefined){
                    return i;
                    }
                }
            return -1;
            };
        var scopeLastDepth = 0;
        traverseTree(
            function(depth,node){
                switch(node.type){
                    case "binding":
                        //reset scope, this is not done properly at the moment.
                        //scope = {};
                        var scope = function(){
                            if(scopeLastDepth > depth){
                                scopes[scopeLastDepth] = {};
                                }
                            if(scopes[depth] === undefined){
                                scopes[depth] = {};
                                }
                            scopeLastDepth = depth;
                            return scopes[depth];
                            }();
                        if(!matchBinding(node.id,node.lines[node.lines.length - 1],scope)){
                            alert("type error: binding");
                            }
                        break;
                    case "op-bin":
                        if(!unify(node)){
                            alert("type error");
                            }
                        break;
                    case "atom":
                        var scopeI = scopeCheckDown(depth,node.v);
                        if(scopeI > -1){
                            if(node.prgType[0] === "@"){
                                node.prgType = scopes[scopeI][node.v];
                                }
                            //check whether infered type match that of scope type
                            else if(compareTypes(node.prgType,scopes[scopeI][node.v])){
                                alert("type matched succesfully");
                                }
                            else {
                                alert("scope error");
                                }
                            }
                        else if(node.prgType[0] === "@"){
                            node.prgType[0] += typeVarId.toString();
                            typeVarId++;
                            }
                        break;
                    }
                },
            tree);
        return tree;
        };
