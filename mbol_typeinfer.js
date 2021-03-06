    var typeInfer = function(tree){
        var environment = {
            // Contains type environmemt for operators
            // The last value in the list is the return type
            "plus":[
                ["int","int","int"],
                ["float","float","float"]
                ],
            "logical-or":[
                ["bool","bool","bool"]
                ],
            "logical-imp":[
                ["bool","bool","bool"]
                ],
            "tuple":[],
            "fun":[]
            };
        var createTypeVar = function(){
            // Creates a new unique var-id
            var typeVarId = 1;
            return function(){
                var retval = "@" + typeVarId.toString();
                typeVarId++;
                return retval;
                };
            }();
        //var typeVarId = 1;
        var compareTypes = function(t0,t1){
            // Compare two type-lists
            // IOterating over the shortest of the
            // two type-lists
            var len0 = Math.min(t0.length,t1.length);
            for(var i = 0; i < len0; i++){
                if(t0[i][0] !== "@" && t0[i] !== t1[i]){
                    return false;
                    }
                }
            return true;
            };
        var matchTypeOp = function(op,t0){
            // Matches some op against the environment
            // found above. If no match are found in environment
            // return null, else return the found return type
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
        var unifyBinding = function(ids,expr,scope){
            // Tries to unify left and right side of binding
            // Adds types to left side
            if(expr.type === "atom-tuple"){
                if(ids.length !== expr.args.length){
                    return false;
                    }
                for(var i = 0; i < ids.length; i++){
                    // If id already has been given a type
                    // override it
                    var id = ids[i].v;
                    var exprType = expr.args[i].prgType;
                    ids[i].prgType = exprType;
                    scope[id] = exprType;
                    }
                return true;
                }
            if(ids.length === 1){
                ids[0].prgType = expr.prgType;
                scope[ids[0].v] = expr.prgType;
                return true;
                }
            return false;
            };
        var unify = function(node){
            // Tries to unify arguments of given node
            // Done as side effect. Returns true on success
            // false on failure
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
                //node.prgType[0] += typeVarId.toString();
                //typeVarId++;
                node.prgType[0] = createTypeVar();
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
        var scopeCheckUp = function(d,v){ 
            // Checks from current depth and up to see
            // if binding is located in current or some
            // parrent scope
            // return: the scope depth if found
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
                        if(!unifyBinding(node.id,node.lines[node.lines.length - 1],scope)){
                            alert("type error: binding");
                            }
                        break;
                    case "op-bin":
                        if(!unify(node)){
                            alert("type error");
                            }
                        break;
                    case "atom":
                        var scopeI = scopeCheckUp(depth,node.v);
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
                            node.prgType[0] = createTypeVar();
                            }
                        break;
                    }
                },
            tree);
        return tree;
        };
