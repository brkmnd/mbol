    var traverseTree = function(outf,tree){
        var exec = function(depth,tree){
            switch(tree.type){
                case "scope":
                    for(var i = 0; i < tree.lines.length; i++){
                        exec(depth+1,tree.lines[i]);
                        }
                    break;
                case "binding-type":
                    exec(depth+1,tree.args[0]);
                    break;
                case "binding":
                    for(var i = 0; i < tree.lines.length; i++){
                        exec(depth+1,tree.lines[i]);
                        }
                    break;
                case "type-plus":
                    exec(depth+1,tree.args[0]);
                    exec(depth+1,tree.args[1]);
                    break;
                case "type-constr":
                    exec(depth+1,tree.body);
                    break;
                case "type-constr-body":
                    exec(depth,tree.args[0]);
                    break;
                case "op-bin":
                    exec(depth+1,tree.args[0]);
                    exec(depth+1,tree.args[1]);
                    break;
                case "block":
                    for(var i = 0; i < tree.lines.length; i++){
                        exec(depth+1,tree.lines[i]);
                        }
                    break;
                case "match":
                    for(var i = 0; i < tree.cases.length; i++){
                        var c = tree.cases[i];
                        var cstr = "";
                        cstr += writeMatchLeft(c.mleft);
                        cstr += writeMatchWhen(c.mwhen);
                        outf(int2spaces(depth+1)+"&lt;case&gt;"+cstr);
                        exec(depth+2,c.mblock);
                        } 
                    break;
                case "atom-tuple":
                    for(var i = 0; i < tree.args.length; i++){
                        exec(depth +1,tree.args[i]);
                        }
                    break;
                case "list":
                    for(var i = 0; i < tree.args.length; i++){
                        exec(depth+1,tree.args[i]);
                        }
                    break;
                case "array":
                    for(var i = 0; i < tree.args.length; i++){
                        exec(depth+1,tree.args[i]);
                        }
                    break;
                case "indexing":
                    exec(depth+1,tree.items);
                    exec(depth+1,tree.ind);
                    break;
                case "atom":
                    break;
                default:
                    break;
                }
            outf(depth,tree);
            };
        exec(0,tree);
        };
